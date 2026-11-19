# Comments Thread shared UI audit — 2026-11-19

Status: release-ready. Existing pending component reviewed and verified for additive UI0.1.14 / v-0.1.14. Comments add-on must wait the exact published UI SHA; existing0.1.12/0.1.13 consumers need no repin.

## Public presentation contract

Import CommentsThread, ThreadComment and CommentsThreadProps from @workspace/ui/blocks/comments-thread (also package root). Existing fields and callbacks remain compatible:

```ts
type ThreadComment = Readonly<{
  id: string; author: string; text: string; createdAt: string;
  revision: number; canEdit: boolean; canDelete: boolean;
}>;
type CommentsThreadProps = {
  items: readonly ThreadComment[];
  resourceKey?: string; // optional opaque NON-secret UI identity boundary
  canCreate?: boolean; loading?: boolean; loadingMore?: boolean;
  error?: string; actionError?: string; unavailable?: string;
  blocked?: boolean; hasMore?: boolean;
  onRefresh?: () => void; onLoadMore?: () => void;
  onCreate?: (text: string) => Promise<void>;
  onEdit?: (snapshot: ThreadComment, text: string) => Promise<void>;
  onDelete?: (snapshot: ThreadComment) => Promise<void>;
  validateText?: (text: string) => string | undefined;
};
```

The shared block owns escaped plain text, labelled form/action controls, draft validation/preservation, duplicate-action prevention, edit cancellation and delete confirmation. It does not fetch or authorize anything. Host/add-on verifies actor/tenant/resource/effective enablement/permissions and revisions on every request; capability booleans are display hints, never authorization. validateText and error props must contain safe user-facing text. Rejected mutations show fixed safe feedback and do not silently discard drafts or retry uncertain outcomes.

On actor/tenant/session/target/client identity changes, host must synchronously remount its panel with a new React key (existing CommentsPanel already does this) or supply a changed resourceKey for the shared block. This clears private UI drafts/action state; it does not authorize new scope or make old rows safe. Host must also clear old rows immediately, abort/invalidate read requests, ignore late results and perform target checks. UI will ignore callbacks resolving after unmount. A started mutation cannot be presumed rolled back merely by cancelling UI; host owns reconciliation/blocked state before another attempt.

Existing CommentsPanel receives target/client/scopeKey, synchronously keys PanelSession with scope/target/client identity and supplies these callbacks. That browser client contract remains Comments-owned; no backend, host auth, transport or SQL moves into UI.

## Findings and final changes

Original pending source lacked explicit unmount/result guards and edit submit did not recheck capability after props refresh. Delete confirmation used the latest render's revision instead of the reviewed snapshot. Fixed all three, added optional resourceKey remount boundary, copied edit/delete snapshots, reset validation on cancel/Clear draft/refresh, safe validator-exception feedback and invalid timestamp fallback. Scope changes never authorize new data or bypass callbacks. No request transport, auth model or business logic was added.

Exact UI files: src/blocks/comments-thread.tsx; src/index.ts; package.json public export/version; package-lock.json version only; tests/comments-thread.test.mjs; docs/comments-thread.md; docs/CHANGELOG.md; docs/work-record.md; this report/evidence. No new runtime or test dependency (jsdom31.0.1 already published in0.1.12). Prior auth/remote-list code and unrelated work preserved.

## Verified source, package and consumer contract

- Clean UI build passed2.977s. Final complete UI suite91/91 passed sequentially63.532s, no skipped tests;11 Comments-specific groups cover safe text, validation/throwing validator, duplicates, failures/drafts, revision capture, permission revocation, cancellation, unavailable/loading/error/load-more, blocked reconciliation and resource-switch/unmount stale results.
- Isolated snapshot of the existing Comments consumer typechecked and built; its7 browser/client tests passed1.700s against candidate UI. Tests verify authenticated-transport delegation, scope/target changes and late reads, uncertain mutation blocking, cursor merge, permission loss/mismatched targets, captured edit revisions and late mutation isolation. No addon source was edited and no database tests/seeders/migrations were invoked by this UI audit.
- Packed UI0.1.14 and the existing Comments0.1.1 candidate into a fresh isolated consumer. Strict TypeScript7+exactOptionalPropertyTypes verifies root/subpath ThreadComment, CommentsThreadProps/resourceKey/callback types and CommentsPanel/CommentsClient composition. Runtime public imports, root/subpath function identity, escaped SSR, private-path rejection and browser dependency boundary all pass. Installed component hash equals final candidate dist.
- Final tested UI archive SHA256:5fd88da9b252ba91b9b08eecbedb05ebb147bb80bdadd384cb50046e3bce4477. Consumers should package the published commit independently; this local candidate archive is evidence, not a registry publication or addon release.
- Existing Comments peer range >=0.1.10 <0.2.0 wrongly admits releases lacking CommentsThread. Add-on owner must raise browser UI floor to >=0.1.14 <0.2.0 (or approved equivalent), pin/package the exact published SHA, and repeat installed-artifact acceptance before publishing CODEXSUN/comments.git. File Manager legacy-main preservation remains addon-owner scope.

## Actual browser checks

Fresh isolated headless Edge, real CommentsPanel consumer and shared UI, disposable callbacks only. Light and dark themes each tested at360/768/1440/1920/2560. Document width equals viewport everywhere; thread widths328/410/1066/1546/2186 respectively. Long authors and unbroken text wrap; markup remains escaped with zero inserted images/scripts or executable marker. Narrow screenshot visually reviewed.

Actual interactions passed: resource switch during pending create keeps new resource rows/draft and ignores old completion; successful edit retains separate composer draft; Escape cancels edit; delete Cancel has no effect, confirmed delete invokes once; cursor load-more; error/retry; read-only controls hidden; forbidden response hides thread. Zero captured page errors. An initial synthetic fixture used offset pagination that skipped a row after deletion; corrected the fixture to its intended stable cursor, with no product/SQL change. A denial-text selector was aligned with the consumer's existing safe message; final browser run passed.

Evidence: docs/supervisor-audit-20261119-comments/browser-evidence.json and comments-{360,1920}-{light,dark}.png. Isolated packed consumer and addon snapshot are retained under C:/Users/sunda/AppData/Local/Temp/comments-supervisor-20261119/. Browser runner/server/fixture retained under C:/Users/sunda/AppData/Local/Temp/ui-supervisor-20261119/browser/comments*. No user browser profile, real credentials or production records used.

## Release and owner handoff

UI0.1.14 / immutable v-0.1.14 is ready; exact published commit follows after GitHub-helper publication. UI is a library with no standalone image, workflow or Docker deployment. Existing small apps and approved0.1.12/0.1.13 consumers need no repin/rebuild. Comments owner receives this contract/SHA and owns addon publication and actual host integration/auth verification; UI source tests do not certify a live CRM/HRMS deployment. UIUX pending Comments preview remains preserved, not repinned or released by this step.

No database/module changes, migrations, reset/reseed, data/grant changes, SDK/Platform/Billing edits or Docker operations in this Comments audit. Root deployment-ownership instruction has since changed: app owners invoke the shared CodeShip tools/lock for their own approved deployments. Any separate UIUX verification is recorded in its own report, not inferred from this library publication.
