# Repository tools

Version and release notes belong to this app's `docs/CHANGELOG.md`. Database Changes and App Codebase Changes are separate. Commit subjects use `#<minor>.<patch> - <latest entry title>`. Current baseline is 0.1.0; shared package versions are independent.

After installing dependencies to create `package-lock.json`:

- `npm run github:now` or `npm run github:audit`: audit changed files, versions, and the proposed commit subject. Default is read-only; no fetch, pull, stage, commit, or push.
- `npm run version:show` or `npm run check:versions`: verify package, lock-root, and changelog versions. A missing lockfile is reported until installation.
- `npm run version:preview -- --title "Short change"`: preview the next patch version without writing files.
- `npm run version:update -- --title "Short change" --no-database-update` or `npm run version:bump -- --title "Short change" --no-database-update`: explicitly update this app's package, lock-root (when present), and changelog. Use `--database-update` for database changes; automatic detection is advisory and reports Unknown without Git history. Add verified change details before publishing.
- `npm run verify`: typecheck, build, existing tests, tool tests, and version consistency.

## Explicit publication

Only when publication is authorized, `npm run github:now -- --publish` enters the interactive workflow. Review files and the version/title, choose whether to bump, and confirm. It then fetches/pulls if an upstream is configured, stages the changes, commits with the reviewed subject, and pushes. Configure the intended remote and upstream first. Scaffolding never connects a remote or publishes automatically. The helper does not create a Git tag.

## Optional SSH-key utility

`npm run github:ssh-key -- --help` is read-only help. Only an explicit `npm run github:ssh-key` generates an ED25519 keypair under ignored `dist/.tmp/`. Optional flags: `--comment "ui-server"` and `--json`. The private key is never printed; keep it private and move it to the intended host yourself. Nothing is uploaded, registered with GitHub, or installed into SSH configuration automatically. Key generation is not part of creation, version checks, tests, preflight, or publication.
