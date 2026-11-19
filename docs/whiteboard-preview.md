# Whiteboard previews

Import WhiteboardPreview and Whiteboard from @workspace/ui/blocks/whiteboard. Pass the saved scene JSON as content and an accessible label to the preview. Compose it inside CardLink; previews contain no editor controls. Blank and malformed scenes have readable fallback states. Rendering creates a bounded PNG and revokes its object URL on change/unmount.

Mount Whiteboard lazily on the record page. serialize() rejects while the initial scene is loading; show its message without saving. After saving a new record, pass the returned scene back as content before remounting with its persisted ID. Apps own status, revisions and database writes.
