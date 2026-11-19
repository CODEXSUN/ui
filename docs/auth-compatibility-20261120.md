# Shared UI tab-session compatibility — 2026-11-20

UI0.1.19 source release, isolated atop remote18/cd99cbfa. Preserves published UI18 drawing dependency overrides/lock, sidecar, Whiteboard, tables and all other shared features. Native extensive dirty work was not staged, reset or merged wholesale. Only four runtime files changed: blocks/auth/workspace-access-gate.tsx and layouts/main-layouts/{main-layout,top-menu,top-menu-app-launcher}.tsx. Existing native gate recovery/minimum-password behavior already matched18; no duplicate recovery rewrite was imported.

## Exact app contract

- Ordinary app gate supports exact /login (also trailing slash). It first checks the selected client's session; an existing session is logged out through client.logout before a fresh form appears. Anonymous401 opens context without logout. App grant verification is deferred until the new session is checked; children never mount over a failed revocation.
- Successful explicit sign-in changes path to/ using replaceState while preserving SDK history metadata and dispatches popstate so an already-mounted parent router updates before protected children mount. Manual/expired refresh and back navigation do not immediately log out the new root session. Late completion after a newer route/unmount does not redirect or reveal stale workspace content.
- Ordinary gate /sa/login and /admin/login show a clear unsupported-route message and an App sign-in link; no old workspace or default-user form is rendered and no session/login call is made for those unsupported routes. These paths do NOT implement privileged authentication in apps. Platform owns privileged sign-in, role checks and all grants. Custom product gates/realm forms remain their owners' responsibility. No role or permission assignment was introduced.
- Existing forced password-change behavior, eight-character change policy, one-character existing-password sign-in compatibility, bounded recovery, denied403 behavior, duplicate login suppression and app-supplied verify remain. UI has no authentication database, credential cookie or selector-generation implementation. Current-tab revocation guarantees depend on the new SDK and Platform session contract, not UI alone. Already-issued client requests cannot be cancelled by this UI callback contract; stale UI completion is ignored.
- MainLayout and TopMenu accept optional launcherCatalogUrl:string|undefined, e.g./platform-api/v1/landing (Platform uses/api/v1/landing). No catalogue fetch for static-only callers. Catalogue mode requires the initialized SDK32hex sessionStorage selector codebiz.platform.tab and sends X-Platform-Tab with same-origin credentials. Missing/invalid selector, cross-origin catalogue URL, redirect, malformed response, unauthorized response or unsafe destination fails closed without static/old-account fallback. URL destinations allow HTTP(S) without credentials. On close/unmount abort work and ignore late results; reopening reads the current selector again. App URLs open target_blank with noopener noreferrer; callback entries retain their existing behavior. Backend permitted-app catalogue remains authoritative.

```tsx
<MainLayout
  {...appShellProps}
  launcherCatalogUrl="/platform-api/v1/landing"
/>
```

Use SDK0.1.10 exactef7fe98371ab569fa34a91feca9bfac35c8d201c and the reviewed compatible Platform candidate for coordinated tab isolation. UI19 alone cannot confer isolation to old SDK/session implementations. SDK optional realm types for custom product sign-in are separate; neutral gate never silently converts an unsupported privileged request into ordinary login.

## Verification and limits

Build/type checks pass;117/117 UI tests (82.643s) and4/4 release-tool tests pass. Includes actual producer drawing resolution regression,14gate cases and6launcher cases. The lock changes only root version18→19, preserving all drawing package versions. Strict TypeScript7/exactOptionalPropertyTypes packed consumer passes with public MainLayout/TopMenu/WorkspaceAccessGate and published SDK10 APIs. Configured packed consumer audit reports zero; this is a dependency-tree result, not a general security certification.

Fresh headless Edge, real packed UI19+SDK10, disposable HTTP fixture with HttpOnly per-selector session cookies and CSRF: two users in same-origin tabs, current-tab account switch while sibling remains signed in, parent-router notification, reload stability, current-tab authorized catalogue and new app tab with no opener/fresh sign-in all pass. Unsupported ordinary-app SA route exposes neither old desk nor a form; sibling remains signed in. No page errors. Evidence in auth-compatibility-20261120/. This fixture is not live Platform permission/SA/login/tenant-isolation acceptance; Platform/app owners must validate those against their real candidate before rollout. No real business accounts, customer data or role/grant writes were used.

## Ownership and deployment hold

Source publication only. No Docker fixture, image load, replacement, migration, grant/credential change, engine action or Ubuntu connection was performed. New human-directed stop pauses ALL local Docker deployment and automatic rollout until fresh explicit authorization; Ubuntu stop remains. Running app versions are not claimed updated. UIUX has existing opt-in Platform-auth candidate14 in CodeShip's preserved clean release workspace; do not call it unaffected merely because the older editable devkit tree looked public-only. UIUX SDK10/UI19 pins are a separate source-only preparation, preserving that candidate. No competing UIUX version or deployment is created by this shared-library release.
