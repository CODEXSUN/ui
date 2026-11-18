#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { platform } from "node:os";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { formatChangelogCommitSubject, readLatestVersionedChangelogEntry } from "./changelog.mjs";
import { checkVersions } from "./check-versions.mjs";

const ROOT = resolve(import.meta.dirname, "..");

async function withPrompt(callback) {
  if (!process.stdin.isTTY && platform() === "win32") {
    return callback(askWindowsModal);
  }

  if (!process.stdin.isTTY) {
    throw new Error(
      "Interactive terminal input is required for github:now. Run it from a terminal that accepts input."
    );
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    return await callback((query, defaultValue = "") => {
      return new Promise((resolveAnswer) => {
        rl.question(query, (answer) => resolveAnswer(answer || defaultValue));
      });
    });
  } finally {
    rl.close();
  }
}

function askWindowsModal(query, defaultValue = "") {
  const isConfirmation = /\[y\/N\]:\s*$/i.test(query);

  if (isConfirmation) {
    const script = [
      "Add-Type -AssemblyName System.Windows.Forms",
      `$result = [System.Windows.Forms.MessageBox]::Show(${quotePowerShellString(
        query.replace(/\s*\[y\/N\]:\s*$/i, "")
      )}, 'GitHub Commit Review', 'YesNo', 'Question')`,
      "if ($result -eq 'Yes') { 'yes' } else { 'no' }"
    ].join("; ");

    return runPowerShellModal(script);
  }

  const script = [
    "Add-Type -AssemblyName Microsoft.VisualBasic",
    `[Microsoft.VisualBasic.Interaction]::InputBox(${quotePowerShellString(
      query
    )}, 'GitHub Commit Review', ${quotePowerShellString(defaultValue)})`
  ].join("; ");

  return runPowerShellModal(script);
}

function runPowerShellModal(script) {
  return execFileSync("powershell.exe", ["-NoProfile", "-STA", "-Command", script], {
    encoding: "utf8",
    windowsHide: false
  }).trim();
}

function quotePowerShellString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function renderReviewBox({ fileCount, subject, version }) {
  const rows = [
    "GitHub Commit Review",
    `Version: ${version}`,
    `Subject: ${subject}`,
    `Files: ${fileCount}`
  ];
  const width = Math.max(...rows.map((row) => row.length)) + 4;
  const border = `+${"-".repeat(width)}+`;
  const lines = rows.map((row) => `| ${row.padEnd(width - 2)} |`);

  return ["", border, ...lines, border, ""].join("\n");
}

function isYes(value) {
  return ["y", "yes"].includes(value.trim().toLowerCase());
}

export function parseOptions(args) {
  const options = { files: [], staged: false, publish: false, syncOnly: false, yes: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--publish') options.publish = true;
    else if (arg === '--sync-only') options.syncOnly = true;
    else if (arg === '--staged') options.staged = true;
    else if (arg === '--yes') options.yes = true;
    else if (['--file', '--message'].includes(arg) && args[i + 1] && !args[i + 1].startsWith('--')) {
      const value = args[++i];
      if (arg === '--file') options.files.push(value);
      else options.message = value;
    } else throw new Error(`Unknown or incomplete option: ${arg}`);
  }
  if ([options.dryRun, options.publish, options.syncOnly].filter(Boolean).length > 1) throw new Error('Choose --dry-run, --sync-only or --publish.');
  if (options.staged && options.files.length) throw new Error('Choose --staged or explicit --file paths, not both.');
  if (options.publish && !options.staged && !options.files.length) throw new Error('Publish requires --staged or one or more --file paths.');
  options.files = [...new Set(options.files.map(file => {
    const path = file.replaceAll('\\', '/');
    if (/^(?:\/|[a-z]:)/i.test(path) || path.split('/').some(part => ['', '.', '..', '.git'].includes(part.toLowerCase()))) throw new Error(`Use an exact repository-relative file path: ${file}`);
    return path;
  }))];
  return options;
}

function gitAt(root) {
  return (args, quiet = false) => {
    try {
      return execFileSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
    } catch (error) {
      if (quiet) return '';
      throw new Error(`git ${args.join(' ')} failed: ${[error.stdout, error.stderr].filter(Boolean).map(value => value.toString().trim()).join('\n') || error.message}`);
    }
  };
}

function upstreamInfo(git, log) {
  const branch = git(['symbolic-ref', '--quiet', '--short', 'HEAD'], true);
  const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], true);
  if (!branch || !upstream) throw new Error('A named branch with a configured upstream is required.');
  const remote = git(['config', '--get', `branch.${branch}.remote`]);
  const mergeRef = git(['config', '--get', `branch.${branch}.merge`]);
  if (remote === '.' || !mergeRef.startsWith('refs/heads/')) throw new Error('A remote branch upstream is required.');
  const fetchUrl = git(['remote', 'get-url', remote]);
  const pushUrl = git(['remote', 'get-url', '--push', remote]);
  log(`Remote: ${remote} | fetch: ${fetchUrl} | push: ${pushUrl} | branch: ${branch} | upstream: ${upstream}`);
  return { remote, mergeRef, upstream };
}

export function synchronize(root, log = console.log) {
  const git = gitAt(root);
  const info = upstreamInfo(git, log);
  git(['-c', 'maintenance.auto=false', '-c', 'gc.auto=0', 'fetch', info.remote]);
  const behind = Number(git(['rev-list', '--count', `HEAD..${info.upstream}`]));
  const ahead = Number(git(['rev-list', '--count', `${info.upstream}..HEAD`]));
  log(`Remote status: ${ahead} ahead, ${behind} behind.`);
  if (behind) {
    if (git(['status', '--porcelain=v1', '--untracked-files=all'])) throw new Error('Pull requires a clean checkout. Preserve pending work or use an isolated checkout; no autostash is performed.');
    log('Pulling and merging the upstream before release review.');
    git(['-c', 'maintenance.auto=false', '-c', 'gc.auto=0', 'pull', '--no-rebase', '--no-edit', '--no-autostash', info.remote, info.mergeRef]);
  }
  return info;
}

function stagedFiles(git) {
  return git(['diff', '--cached', '--name-only', '--no-renames', '-z']).split('\0').filter(Boolean);
}

export async function runHelper(root, options, { log = console.log, ask } = {}) {
  const git = gitAt(root);
  if (options.syncOnly) return synchronize(root, log);
  // Synchronization always precedes version validation, selection and review.
  const info = options.publish ? synchronize(root, log) : null;
  const audit = checkVersions(root);
  if (audit.failures.length) throw new Error(audit.failures.join('\n'));
  const entry = readLatestVersionedChangelogEntry(root);
  const defaultSubject = formatChangelogCommitSubject(entry);
  const status = git(['status', '--porcelain=v1', '--untracked-files=all']);
  log(status || 'No pending changes.');
  if (!options.publish) {
    log(renderReviewBox({ fileCount: status ? status.split('\n').length : 0, subject: options.message || defaultSubject, version: entry.version }));
    log('Dry run only. No pull, commit, or push was performed.');
    return;
  }
  if (git(['diff', '--name-only', '--diff-filter=U'])) throw new Error('Resolve merge conflicts before publishing.');
  if (!options.staged) {
    const outside = stagedFiles(git).filter(file => !options.files.includes(file));
    if (outside.length) throw new Error(`Unrelated staged changes: ${outside.join(', ')}. Nothing was staged by the helper.`);
    // Exact file paths only; directory or pathspec expansion must never widen scope.
    const toStage = [];
    for (const file of options.files) {
      const matches = git(['--literal-pathspecs', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', file]).split('\0').filter(Boolean);
      if (!matches.length) {
        const previous = git(['--literal-pathspecs', 'ls-tree', '-r', '--name-only', '-z', 'HEAD', '--', file]).split('\0').filter(Boolean);
        if (previous.length === 1 && previous[0] === file && stagedFiles(git).includes(file)) continue;
      }
      if (!matches.length || matches.some(match => match !== file)) throw new Error(`Selection must name an exact existing or tracked file: ${file}`);
      toStage.push(file);
    }
    if (toStage.length) git(['--literal-pathspecs', 'add', '--', ...toStage]);
  }
  const selected = stagedFiles(git);
  if (!selected.length) throw new Error('No staged changes selected for commit.');
  if (!options.staged && selected.some(file => !options.files.includes(file))) throw new Error('Staged scope changed; review the index before retrying.');
  git(['diff', '--cached', '--check']);
  const head = git(['rev-parse', 'HEAD']);
  const tree = git(['write-tree']);
  log(`Selected files (${selected.length}):\n${selected.map(file => `  ${file}`).join('\n')}`);
  log(git(['diff', '--cached', '--stat']));
  log(git(['log', '--oneline', `${info.upstream}..HEAD`]) || 'No existing outgoing commits.');
  let subject = options.message?.trim() || defaultSubject;
  log(renderReviewBox({ fileCount: selected.length, subject, version: entry.version }));
  if (!options.yes) {
    const review = async prompt => {
      subject = (await prompt(`Commit message [${subject}]: `, subject)).trim() || subject;
      log(renderReviewBox({ fileCount: selected.length, subject, version: entry.version }));
      if (!isYes(await prompt('Commit and push only this reviewed index? [y/N]: '))) throw new Error('Cancelled. Selected changes remain staged.');
    };
    if (ask) await review(ask);
    else await withPrompt(review);
  }
  if (!subject || /[\r\n]/.test(subject)) throw new Error('Provide a single-line commit message.');
  // Re-fetch after review: remote movement must never cause an unreviewed merge.
  git(['fetch', info.remote]);
  if (Number(git(['rev-list', '--count', `HEAD..${info.upstream}`]))) throw new Error('Remote changed during review. Synchronize and verify again before publishing.');
  if (head !== git(['rev-parse', 'HEAD']) || tree !== git(['write-tree'])) throw new Error('HEAD or staged content changed during review. Review again before publishing.');
  git(['commit', '-m', subject]);
  // Hooks must not silently change the reviewed commit or add outgoing commits.
  if (git(['rev-parse', 'HEAD^{tree}']) !== tree || git(['rev-parse', 'HEAD^']) !== head) throw new Error('Commit differs from the reviewed snapshot; push stopped. Inspect the local commit.');
  git(['push', info.remote, `HEAD:${info.mergeRef}`]);
  log(`Done - ${subject}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  (async()=>{
    const args=process.argv.slice(2);
    if(args.includes('--release')) {
      if(!args.includes('--yes')||args.some(option=>!['--release','--yes','--initial'].includes(option)))throw new Error('Use --release --yes only for an audited staged release.');
      const {publishRelease}=await import('./publish-release.mjs');
      return publishRelease(ROOT,{confirm:true,initial:args.includes('--initial')});
    }
    return runHelper(ROOT,parseOptions(args));
  })().catch(error=>{console.error('Error: '+error.message);process.exitCode=1;});
}
