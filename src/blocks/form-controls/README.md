# Form controls

Public entry: @workspace/ui/blocks/form-controls.

FormLookup and FormDatePicker adapted from Codexsun packages/ui/src/workspace/lookup.tsx and date-picker.tsx. FormSelect adapted from select.tsx with native name/required forwarding. Backgrounds use shared theme tokens. FormAnimatedTabs follows the CRM enquiry tabs with Radix keyboard navigation and a measured moving underline; reduced motion disables transition.

Apps own option data and callbacks. Lookup supports descriptions, search, option-only or text entry, creation, keyboard navigation and empty/loading states. No server fetch is performed. Pass a hidden named field for lookup/date submission. The reference date picker's required prop is not enforced; validate dates in the app. Calendar years are 2000–2050. Manual input dd-MM-yyyy emits yyyy-MM-dd. Select name and required are forwarded to Radix. Create is supported only by FormLookup; callbacks own persistence and preview creation is sample-only.

See UIUX /blocks/forms/lookup, /select, /date-picker and /animated-tabs for live usage. Project Manager is excluded from this work.

Individual public paths (preferred for usage and documentation):

| Control | Public import |
| --- | --- |
| FormLookup | `@workspace/ui/blocks/form-controls/lookup` |
| FormSelect | `@workspace/ui/blocks/form-controls/select` |
| FormDatePicker | `@workspace/ui/blocks/form-controls/date-picker` |
| FormAnimatedTabs | `@workspace/ui/blocks/form-controls/animated-tabs` |

The existing form-controls barrel remains supported for compatibility.
