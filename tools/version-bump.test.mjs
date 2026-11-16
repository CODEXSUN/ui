import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { bumpNextVersion, bumpPatch } from './version-bump.mjs';
import { checkVersions } from './check-versions.mjs';
import { formatChangelogCommitSubject, parseLatestVersionedChangelogEntry } from './changelog.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'app-version-'));
  mkdirSync(join(root, 'docs')); mkdirSync(join(root, 'tools'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: '@workspace/example-app', type: 'module', version: '0.1.0', dependencies: { '@workspace/ui': 'file:../../packages/ui' } }));
  writeFileSync(join(root, 'package-lock.json'), JSON.stringify({ version: '0.1.0', packages: { '': { version: '0.1.0' }, 'node_modules/other': { version: '0.1.0' } } }));
  writeFileSync(join(root, 'docs/CHANGELOG.md'), '# Changelog\n\n## Version State\n\nCurrent version: 0.1.0\n\nRelease tag: v-0.1.0\n\nChangelog label: v 0.1.0\n\n## v-0.1.0\n\n### [v 0.1.0] 2026-11-16 - Initial log\n\n#### Database Changes\n\n- Database update: No (manual).\n\n#### App Codebase Changes\n\n- Initial baseline.\n');
  return root;
}
function snapshot(root) { return ['package.json', 'package-lock.json', 'docs/CHANGELOG.md'].map(file => readFileSync(join(root, file), 'utf8')); }

test('only numeric three-part patch versions and the reference commit format are accepted', () => {
  assert.equal(bumpPatch('0.1.0'), '0.1.1');
  for (const value of ['1.0', '1.0.1beta', '1.0.1.2', '01.0.0']) assert.throws(() => bumpPatch(value), /Unsupported/);
  const entry = parseLatestVersionedChangelogEntry('### [v 0.1.0] 2026-11-16 - Local audit');
  assert.equal(formatChangelogCommitSubject(entry), '#1.0 - Local audit');
});

test('bump preview changes nothing; explicit fixture bump updates only app roots and log', () => {
  const root = fixture();
  try {
    const before = snapshot(root);
    const preview = bumpNextVersion(root, 'Fixture release', { dryRun: true, databaseUpdate: false });
    assert.equal(preview.nextVersion, '0.1.1'); assert.deepEqual(snapshot(root), before);
    bumpNextVersion(root, 'Fixture release', { databaseUpdate: false });
    assert.deepEqual(checkVersions(root).failures, []);
    assert.equal(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).dependencies['@workspace/ui'], 'file:../../packages/ui');
    const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
    assert.equal(lock.packages[''].version, '0.1.1'); assert.equal(lock.packages['node_modules/other'].version, '0.1.0');
    const log = readFileSync(join(root, 'docs/CHANGELOG.md'), 'utf8');
    assert.ok(log.indexOf('## v-0.1.1') < log.indexOf('## v-0.1.0'));
    assert.match(log, /Database update: No \(manual\)/);
    assert.match(log, /Initial baseline/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('malformed locks and mismatched changelog entries fail before version writes', () => {
  const root = fixture();
  try {
    writeFileSync(join(root, 'package-lock.json'), '{broken'); const before = snapshot(root);
    assert.throws(() => bumpNextVersion(root, 'Bad release'));
    assert.deepEqual(snapshot(root), before);
    assert.ok(checkVersions(root).failures.length);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('GitHub helper defaults to audit and leaves Git index, refs, package versions and log unchanged', () => {
  const root = fixture();
  try {
    for (const file of ['github-helper.mjs', 'changelog.mjs', 'check-versions.mjs', 'version-bump.mjs']) cpSync(resolve(import.meta.dirname, file), join(root, 'tools', file));
    execFileSync('git', ['init', '--initial-branch=main'], { cwd: root, stdio: 'ignore' });
    const before = snapshot(root);
    const output = execFileSync(process.execPath, ['tools/github-helper.mjs'], { cwd: root, encoding: 'utf8' });
    assert.match(output, /Dry run only/); assert.match(output, /#1\.0 - Initial log/);
    assert.deepEqual(snapshot(root), before);
    assert.equal(execFileSync('git', ['ls-files', '--stage'], { cwd: root, encoding: 'utf8' }), '');
    assert.deepEqual(readdirSync(join(root, '.git/refs/heads')), []);
    assert.throws(() => execFileSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: root, stdio: 'ignore' }));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
