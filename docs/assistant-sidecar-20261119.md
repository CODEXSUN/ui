# Assistant sidecar — shared UI release handoff

Status: additive shared UI source ready for isolated owner review/publication. No standalone deployment.

Authorized by Zetro user: reusable chat sidecar, original Codexsun logo, top-menu entry across apps, attachments and voice. Zetro owns data/auth/model execution; SDK owns product logo and trusted URL composition.

## Exact UI source scope

- src/blocks/assistant-sidecar.tsx (new): generic optional nonmodal iframe drawer and generic chat panel. Product name/logo, messages, callbacks, history/settings slots supplied through props; no SDK import, credentials, database or provider code. Composer uses public controls, MarkdownContent, clipboard and FileUpload. Voice starts only on user action, generates a reviewable draft and aborts on unmount/new chat. Unsupported voice is explicit.
- src/layouts/main-layouts/main-layout.tsx: only additive AssistantSidecar import, optional assistant prop/destructure and searchLeadingAction composition. Preserve the owner's existing responsive canvas edits.
- src/components/sheet.tsx: optional overlay flag, default true. Sidecar uses modal=false/overlay=false so underlying host remains usable. Existing Sheet consumers retain their overlay.
- src/blocks/file-upload.tsx: additive compact/selectionOnly variants and optional upload callback for selection-only mode. Existing upload defaults preserved; selection never fabricates a saved upload ID or invokes storage.
- tests/assistant-sidecar.test.mjs (new): dictated drafts do not send automatically; selected files remain local until submit; same-tick duplicate submits dispatch once; successful sends clear drafts/selections; unmount aborts speech; unsupported voice never dispatches.
- package.json: only ./blocks/assistant-sidecar public export. Preserve unrelated version/Comments/AttachmentList changes and release independently.
- docs/assistant-sidecar-20261119.md (this handoff).

UIUX-owned composition scope: new src/web/modules/gallery/shared-usage/assistant-sidecar.tsx; additive shared-pattern-catalog.ts/shared-block-page.tsx entry; gallery/page.tsx optional assistant composition; SDK file dependency and corresponding lock update. Do not silently publish other owners' UIUX edits.

## Actual checks

- Shared UI typecheck/build passed; existing 91 tests passed before the final additive layout refinement. Focused assistant/file tests 4/4 passed afterward.
- Public SDK tests 16/16 passed, including trusted URL validation and source labels carrying no authority.
- Actual isolated Chrome with the same public MainLayout/SDK composition: disposable CRM and Billing hosts received real native Codex replies, shared the same synthetic user's history, and created an owner discussion through Zetro's real API/service/database. No production records were used.
- Widths 360/768/1440: host document exactly viewport width, iframe 342/446/446 with no internal horizontal overflow; composer visible. The final embedded viewport-height correction also passed the real browser recheck; the composer stays at the drawer bottom. Final UI build and focused4 tests passed after this correction.
- Voice recognition was tested with a deterministic browser API substitute and unsupported-browser fallback, not live microphone capture. Existing FileUpload validation remains the shared source.

Zetro integration/operating details: ../../../apps/zetro/docs/chat-sidecar.md. The running Docker app remains separately verified 1.0.4 until shared UI and SDK exports are pinned in a fresh approved release. Never publish the entire mixed UI worktree merely to obtain this export.

## Shared UI owner review — 2026-11-19

Reviewed for UI0.1.17, preserving public Whiteboard0.1.15/16 and Comments0.1.14. Added demonstrated late-speech/pending-send fixes, default-upload type compatibility, safe iframe schemes, focus return and optional lazy loading.103 tests and installed SDK0.1.7/public API checks pass; actual ten-theme/width sidecar cases pass. Saved AttachmentList ships in the same reviewed release; no standalone service. Exact publication and limitations: supervisor-audit-20261119-capabilities.md.
