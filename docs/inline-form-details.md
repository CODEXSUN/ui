# Inline form details

Import `InlineFormDetails` and `InlineFormField` from `@workspace/ui/blocks/inline-form-details`. Use inside an owning form, such as UpsertForm, with its Save in the shell header. UIUX Blocks → Inline Edit includes the example.

Supply fields with stable unique names, labels and initial values. Optional types, multiline, select options, maxLength, helper, required and readOnly configure the control. Secret fields mask saved presence (`stored`) without receiving saved secrets. Show reveals replacement text only. Initial values are a mount-time snapshot; remount when switching records.

Named hidden fields submit the latest drafts through FormData, including an editor still open. Pencil edits; check closes; cancel/Escape restores the prior draft. Enter closes single-line edits; multiline retains newlines. This block never persists values. The owning app must validate all submitted fields server-side (closed hidden fields do not provide native required/format validation), enforce permissions/revisions, and preserve blank credentials when appropriate.
