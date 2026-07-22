# CODEXSUN UI Changelog

## Version State

Current version: 1.0.43
Release tag: v-1.0.43
Changelog label: v 1.0.43

## v-1.0.43

### [v 1.0.43] 2026-07-22 8:52 pm - Establish UI repository release workflow

#### Database Changes

- Database update: No.

#### App Codebase Changes

- Kept Tailwind source discovery application-owned so the shared UI package remains free of application-specific paths.
- Added repository-local Assist, dependency, version, and Git workflow tooling and bumped the repository to 1.0.43.

## v-1.0.42

### [v 1.0.42] 2026-07-22 - Establish UI repository documentation

#### Database Changes

- Database update: No.
- Documented the repository-owned migration and seed lifecycle without moving persistence behavior across repositories.

#### App Codebase Changes

- Added repository-local Assist discovery, ownership, structure, environment, version, and Git workflow guidance.
- Added standalone version validation, version bump, and `github:now` tooling.
