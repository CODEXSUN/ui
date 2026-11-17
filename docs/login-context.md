# Workspace login context

Import `LoginPage` from `@workspace/ui/blocks/auth/login-page`.

Optional `workspace` enables compact workspace branding and retains helper text
for assistive technology. Optional `tenantContext` accepts either
`{ mode: 'shared', corporateId, onCorporateIdChange }` for a controlled Corporate
ID field or `{ mode: 'domain', tenantName }` for an escaped, fixed tenant name.
Optional `disabled` prevents credential, development and provider sign-in actions.
Existing classic/split templates and role branding retain their defaults.

Apps supply verified host context, authentication callbacks and authorization.
These props neither resolve hosts nor grant tenant or role permissions. Platform
uses these public props; UIUX includes the corresponding previews and typed usage.

Verification covers shared/domain rendering, tenant text escaping, unavailable
contexts including optional actions, and default-template compatibility. No
database, credential handling, framework code or unrelated UI features are included.
