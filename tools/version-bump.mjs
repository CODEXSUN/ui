#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CHANGELOG_PATH, readLatestVersionedChangelogEntry } from './changelog.mjs';
const ROOT = resolve(import.meta.dirname, '..');
export function findWorkspacePackageFiles(rootDir) {
  // This is a standalone app. Shared file: dependencies retain their own versions.
  return [resolve(rootDir, 'package.json')];
}
export function bumpPatch(version) {
  const parts = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
  if (!parts || !parts.slice(1).every(value => Number.isSafeInteger(Number(value))) || !Number.isSafeInteger(Number(parts[3]) + 1)) throw new Error(`Unsupported version format: ${version}`);
  return `${parts[1]}.${parts[2]}.${Number(parts[3]) + 1}`;
}
function databaseUpdate(root, requested) {
  if (typeof requested === 'boolean') return { hasUpdate: requested, mode: 'manual', files: [] };
  try {
    execFileSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: root, stdio: 'ignore' });
    const output = execFileSync('git', ['--no-optional-locks', 'status', '--porcelain=v1', '-z', '--untracked-files=all'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const files = output.split('\0').filter(Boolean).map(value => value.slice(3)).filter(file => /(?:^|\/)(?:database|migrations|db)\/|(?:schema|migration)\.[cm]?[jt]s$/.test(file.replaceAll('\\', '/')));
    return { hasUpdate: files.length > 0, mode: 'auto', files };
  } catch { return { hasUpdate: null, mode: 'unavailable: no Git history; review manually', files: [] }; }
}
export function bumpNextVersion(rootDir, title = 'version update', options = {}) {
  const root = realpathSync(rootDir);
  if (typeof title !== 'string' || !title.trim() || title.length > 200 || /[\r\n]/.test(title)) throw new Error('Provide one short version title (maximum 200 characters).');
  const packageFile = join(root, 'package.json');
  const lockFile = join(root, 'package-lock.json');
  const changelogFile = join(root, CHANGELOG_PATH);
  // Validate every file and construct all changes before writing anything.
  for (const file of [packageFile, changelogFile, ...(existsSync(lockFile) ? [lockFile] : [])]) {
    if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink() || !realpathSync(file).startsWith(root + (process.platform === 'win32' ? '\\' : '/'))) throw new Error('Version files must be regular files inside this app.');
  }
  const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
  const currentVersion = String(pkg.version); const nextVersion = bumpPatch(currentVersion);
  const currentEntry = readLatestVersionedChangelogEntry(root);
  let changelog = readFileSync(changelogFile, 'utf8');
  if (currentEntry.version !== currentVersion || !changelog.includes(`Current version: ${currentVersion}`) || !changelog.includes(`Release tag: v-${currentVersion}`) || !changelog.includes(`Changelog label: v ${currentVersion}`)) throw new Error('Package and changelog versions must agree before bumping.');
  const changes = new Map(); pkg.version = nextVersion; changes.set(packageFile, JSON.stringify(pkg, null, 2) + '\n');
  if (existsSync(lockFile)) {
    const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
    if (lock.version !== currentVersion || lock.packages?.['']?.version !== currentVersion) throw new Error('Package-lock root version must agree before bumping.');
    lock.version = nextVersion; lock.packages[''].version = nextVersion;
    changes.set(lockFile, JSON.stringify(lock, null, 2) + '\n');
  }
  const database = databaseUpdate(root, options.databaseUpdate);
  const timestamp = new Date().toISOString().slice(0, 10);
  changelog = changelog.replace(/^Current version: .*$/m, `Current version: ${nextVersion}`).replace(/^Release tag: .*$/m, `Release tag: v-${nextVersion}`).replace(/^Changelog label: .*$/m, `Changelog label: v ${nextVersion}`);
  const entry = `## v-${nextVersion}\n\n### [v ${nextVersion}] ${timestamp} - ${title.trim()}\n\n#### Database Changes\n\n- Database update: ${database.hasUpdate === null ? 'Unknown' : database.hasUpdate ? 'Yes' : 'No'} (${database.mode}).\n\n#### App Codebase Changes\n\n- Bumped ${pkg.name ?? 'application'} version to ${nextVersion}.\n- Add the verified change details before publishing.\n\n`;
  const marker = changelog.search(/^## v-/m);
  changelog = marker < 0 ? changelog + '\n' + entry : changelog.slice(0, marker) + entry + changelog.slice(marker);
  changes.set(changelogFile, changelog);
  if (!options.dryRun) for (const [file, content] of changes) writeFileSync(file, content, 'utf8');
  return { currentVersion, nextVersion, title: title.trim(), reference: Number(nextVersion.split('.')[2]), databaseUpdate: database, dryRun: !!options.dryRun, files: [...changes.keys()].map(file => file.slice(root.length + 1)) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2); let title = 'version update'; let database;
    for (let index = 0; index < args.length; index++) {
      if (args[index] === '--dry-run') continue;
      if (args[index] === '--title' && args[index + 1]) { title = args[++index]; continue; }
      if (args[index] === '--database-update') { database = true; continue; }
      if (args[index] === '--no-database-update') { database = false; continue; }
      throw new Error(`Unknown or incomplete option: ${args[index]}`);
    }
    console.log(JSON.stringify(bumpNextVersion(ROOT, title, { databaseUpdate: database, dryRun: args.includes('--dry-run') }), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
