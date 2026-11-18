# Agent Chat Workspace

Public import: `@workspace/ui/blocks/agent-chat` (`AgentChatWorkspace`, `AgentChatProps`, `AgentChatMode`, `AgentChatMessage`). UIUX has a live Agent Chat preview and typed usage under Shared Patterns. Gallery messages are explicitly demo-only.

Controlled inputs: projects/project, conversations/conversationId, messages, activities, mode, running/loading, connected and connectionLabel/error. Apps supply navigation, project/mode selection, new-chat and settings callbacks, async onSend and onStop. onSend resolves after the app accepts/persists a turn; false or rejection preserves the draft. onStop must cancel the actual worker.

The block composes shared shadcn controls, Sheet, RecordList, ActivityFeed, MarkdownContent and useClipboard. It does not connect to Codex or store records. The app owns APIs, permissions, validation, context, persistence and streaming. Stream only public activity; do not supply hidden reasoning, raw credentials or unrelated command logs.

Enter sends, Shift+Enter adds a line, IME composition is respected. Auto-scroll follows new content while near the bottom. Existing conversations bind their project; choose New chat to change project. History is a drawer, not a duplicate app shell. The bottom composer stays mounted while chat data updates.

Completed Plan-mode messages can expose an approval handoff. Apps supply `onApprovePlan(messageId)` and `onOpenTask(taskId)`. `AgentChatMessage` accepts optional `mode`, `taskId` and `taskLinkState` (pending/ready). Eligible replies show Approve plan & create task; pending links offer Retry task creation, ready links offer Open task. The app must validate approval and source records and persist the link before reporting ready. The shared block never starts coding. UIUX's existing Agent Chat usage demonstrates this as a labelled temporary preview.
