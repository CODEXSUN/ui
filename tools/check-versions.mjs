#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CHANGELOG_PATH, readLatestVersionedChangelogEntry, formatChangelogCommitSubject } from './changelog.mjs';
import { bumpPatch } from './version-bump.mjs';
const ROOT = resolve(import.meta.dirname, '..');
export function checkVersions(rootDir) {
  const failures = []; let rootVersion = ''; let subject = '';
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    rootVersion = String(pkg.version); bumpPatch(rootVersion);
    if (existsSync(join(rootDir, 'package-lock.json'))) {
      const lock = JSON.parse(readFileSync(join(rootDir, 'package-lock.json'), 'utf8'));
      if (lock.version !== rootVersion || lock.packages?.['']?.version !== rootVersion) failures.push('Package-lock root versions do not match package.json.');
    } else failures.push('package-lock.json is missing.');
    const changelog = readFileSync(join(rootDir, CHANGELOG_PATH), 'utf8');
    const lines = changelog.split(/\r?\n/);
    for (const expected of [`Current version: ${rootVersion}`, `Release tag: v-${rootVersion}`, `Changelog label: v ${rootVersion}`, `## v-${rootVersion}`]) if (!lines.includes(expected)) failures.push(`Changelog is missing: ${expected}`);
    const entry = readLatestVersionedChangelogEntry(rootDir);
    if (entry.version !== rootVersion) failures.push('Latest changelog entry does not match package.json.');
    subject = formatChangelogCommitSubject(entry);
  } catch (error) { failures.push(error.message); }
  return { rootVersion, failures, subject };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = checkVersions(ROOT);
  if (result.failures.length) { console.error(JSON.stringify(result, null, 2)); process.exitCode = 1; }
  else console.log(`Version check passed for ${result.rootVersion}. Commit preview: ${result.subject}`);
}
