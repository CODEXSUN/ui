# CODEXSUN UI Repository Contract

## Nature

Reusable presentation system for Platform and installable CODEXSUN applications.

## Ownership

Design tokens, components, layouts, blocks, generic workspace controls, presets, and shared styling.

Excluded ownership: Business fields, module schemas, API paths, migrations, seed data, tenant workflows, and application-specific menus.

## Current Structure

- `src/components/`
- `src/design-system/`
- `src/layouts/`
- `src/blocks/`
- `src/workspace/`
- `src/lib/`

## Migration Contract

No database migrations are allowed.

## Seed Contract

No seeders are allowed.

## Environment Contract

No server secrets or business environment variables are allowed. Build-time styling configuration must remain generic and non-secret.

## Composition Contract

This repository exposes intentional public package contracts. The `codexsun` repository is the executable composition root. It may install, register, order, build, and invoke exported lifecycle functions; it must not copy this repository's business implementation.

## Required Checks

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check:versions`
- `npm run github:now -- --dry-run`

Run composed boundary, database, and E2E checks from the sibling `codexsun` repository when the change affects runtime integration.
