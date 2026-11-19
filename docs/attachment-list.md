# Saved Attachment List

Import AttachmentList, AttachmentListProps and SavedAttachment from @workspace/ui/blocks/attachment-list (also root). Supply authorized metadata and async onDownload/onDelete callbacks, plus loading/error/unavailable/blocked/hasMore/onRefresh/onLoadMore as needed. Capability booleans are UI hints; callbacks must verify current actor, tenant, target, enablement, access and revision. No public file URL/storage location is rendered.

Change resourceKey or parent React key with actor/session/target/client identity, clear old rows synchronously and cancel/invalidate prior reads in the consuming controller. This block only resets local confirmation/action state and ignores late feedback after unmount. Delete confirmation keeps a copied revision snapshot and rechecks current hint. After an uncertain action, host must block writes until explicit successful reconciliation; rejection feedback is fixed/safe.

Use shared FileUpload for owned persistence, or FileSelectionProps/selectionOnly:true for local composition. Do not treat selected files as saved IDs. Hosts own validation, authenticated transport, idempotency and retention. No provider/auth/database service is embedded. UI0.1.17 is the minimum release containing this export; public0.1.15/16 are Whiteboard releases. See supervisor-audit-20261119-capabilities.md for tests and exact frozen commit.
