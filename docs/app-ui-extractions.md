# Shared UI extracted from application audit

2026-11-18. Ecommerce and archived Project Manager were excluded.

| Public import | Purpose | Consumer |
| --- | --- | --- |
| @workspace/ui/blocks/detail-table | Read-only related rows with typed renderers, caption and empty state. Main record lists continue to use MasterListV1. | Billing sale, purchase, quotation, export sale |
| @workspace/ui/blocks/diagram-editor | Controlled nodes/connections, inspector, pointer and keyboard movement, isolated SVG references | Codeitz architecture |
| @workspace/ui/blocks/schema-fields-editor | Controlled schema column controls and shared checkboxes. No schema execution. | Codeitz schema designs |
| @workspace/ui/blocks/whiteboard | Lazy vendor editor, dirty tracking, serialization and theme integration | Codeitz whiteboards |
| @workspace/ui/public-controls and @workspace/ui/public-controls.css | Escaped dependency-free HTML input/select/button/field markup with 44px styling | ABConnect static public site |

React apps should use shared React controls rather than the HTML renderers. Static sites may copy built public artifacts as part of their build, never shared source. field(label, control) requires trusted control markup from the shared renderers; labels, option values and attributes are escaped. Site branding/navigation/content stays app-owned.

Each extraction has a separate UIUX Shared Blocks page, a live example, copyable usage code and its real public import in the app header. Whiteboard is deliberately not exported from the root barrel: import it lazily from its subpath to avoid loading the vendor editor on every app screen. Apps own authorized loading, saving, validation and navigation. A new content value for a Whiteboard should mount a new keyed instance, matching the previous editor lifecycle.

Existing Checkbox, Button, Tabs and CheckResults also replaced native/custom implementations in Zetro, Codeship and Codeitz. Domain forms, auth contexts, permission mapping, stage/status mapping and API services remain app-owned composition.
