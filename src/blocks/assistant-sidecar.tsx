import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ArrowUp,
  Copy,
  History,
  Mic,
  Plus,
  Settings,
  Square,
} from "lucide-react";
import { Button } from "../components/button.js";
import { Textarea } from "../components/textarea.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/sheet.js";
import { MarkdownContent } from "../components/markdown-content.js";
import { FileUpload } from "./file-upload.js";
import { useClipboard } from "../lib/use-clipboard.js";
export type AssistantSidecarOptions = {
  url: string;
  name: string;
  description?: string;
  logoSrc: string;
};
function safeAssistantAddress(value: string): string | undefined {
  try {
    const target = new URL(value, typeof window === 'undefined' ? 'http://localhost/' : window.location.href);
    return ['http:', 'https:'].includes(target.protocol) && !target.username && !target.password ? value : undefined;
  } catch { return undefined; }
}
export function AssistantSidecar({
  url,
  name,
  description,
  logoSrc,
}: AssistantSidecarOptions) {
  const address = safeAssistantAddress(url);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const id = useId();
  const launcher = useRef<HTMLButtonElement>(null);
  function changeOpen(next: boolean) { setOpen(next); if (next) { setLoaded(false); setWaiting(false); } }
  useEffect(() => { setLoaded(false); setWaiting(false); }, [url]);
  useEffect(() => {
    if (!address || !open || loaded) return;
    const timer = setTimeout(() => setWaiting(true), 10000);
    return () => clearTimeout(timer);
  }, [open, loaded, address]);
  return (
    <Sheet open={open} onOpenChange={changeOpen} modal={false}>
      <Button
        ref={launcher}
        variant="ghost"
        size="icon"
        disabled={!address}
        title={address ? name : "Assistant address unavailable"}
        aria-label={`Open ${name}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => changeOpen(!open)}
      >
        <img src={logoSrc} alt="" className="size-6" />
      </Button>
      <SheetContent
        overlay={false}
        id={id}
        side="right"
        className="top-14 bottom-8 h-auto w-[calc(100vw-1rem)] max-w-md rounded-xl border p-0 sm:max-w-md"
        onCloseAutoFocus={event => { event.preventDefault(); launcher.current?.focus(); }}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>
            {description ?? "Business assistant"}
          </SheetDescription>
        </SheetHeader>
        {address && waiting && !loaded && (
          <p role="status" className="p-4 text-sm">
            Connecting to {name}…{" "}
            <a href={address} target="_blank" rel="noreferrer">
              Open chat separately
            </a>
          </p>
        )}
        {!address ? <p role="alert" className="p-4 text-sm">Assistant address is unavailable.</p> : <iframe
          title={`${name} chat`}
          src={address}
          className="h-full w-full rounded-xl border-0"
          referrerPolicy="no-referrer"
          allow="microphone"
          onLoad={() => setLoaded(true)}
        />}
      </SheetContent>
    </Sheet>
  );
}
export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: string;
};
export type AssistantChatPanelProps = {
  name: string;
  logoSrc: string;
  messages: readonly AssistantMessage[];
  busy: boolean;
  error?: string;
  history?: ReactNode;
  settings?: ReactNode;
  onNew: () => void;
  onSend: (text: string, files: readonly File[]) => Promise<boolean>;
  onStop: () => void;
  onReview?: (id: string) => void;
};
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult:
    | ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
export function AssistantChatPanel({
  name,
  logoSrc,
  messages,
  busy,
  error,
  history,
  settings,
  onNew,
  onSend,
  onStop,
  onReview,
}: AssistantChatPanelProps) {
  const [draft, setDraft] = useState(""),
    [files, setFiles] = useState<File[]>([]),
    [attachmentKey, setAttachmentKey] = useState(0),
    [localError, setLocalError] = useState(""),
    [tab, setTab] = useState<"chat" | "history" | "settings">("chat"),
    [listening, setListening] = useState(false),
    [submitting, setSubmitting] = useState(false);
  const recognition = useRef<Recognition | null>(null),
    sending = useRef(false),
    feed = useRef<HTMLDivElement>(null);
  const clipboard = useClipboard();
  const active = useRef(true);
  const speechEpoch = useRef(0);
  const working = busy || submitting;
  function cancelVoice() {
    speechEpoch.current++;
    const current = recognition.current;
    recognition.current = null;
    if (current) { current.onresult = null; current.onerror = null; current.onend = null; current.abort(); }
  }
  useEffect(() => { active.current = true; return () => { active.current = false; cancelVoice(); }; }, []);
  useEffect(() => { if (busy) { cancelVoice(); setListening(false); } }, [busy]);
  useEffect(() => {
    if (feed.current) feed.current.scrollTop = feed.current.scrollHeight;
  }, [messages, busy]);
  async function send() {
    if (working || sending.current || listening || !draft.trim()) return;
    sending.current = true;
    setSubmitting(true);
    setLocalError("");
    try {
      if (await onSend(draft.trim(), files.slice()) && active.current) {
        setDraft("");
        setFiles([]);
        setAttachmentKey((value) => value + 1);
      }
    } catch {
      if (active.current) setLocalError(
        "Message could not be sent. Check conversation history before retrying.",
      );
    } finally {
      sending.current = false;
      if (active.current) setSubmitting(false);
    }
  }
  function voice() {
    if (working) return;
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const ctor =
      (
        window as unknown as {
          SpeechRecognition?: new () => Recognition;
          webkitSpeechRecognition?: new () => Recognition;
        }
      ).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => Recognition })
        .webkitSpeechRecognition;
    if (!ctor) {
      setLocalError(
        "Voice input is unavailable in this browser. You can type or attach text.",
      );
      return;
    }
    cancelVoice();
    const instance = new ctor();
    const epoch = ++speechEpoch.current;
    const current = () => active.current && recognition.current === instance && speechEpoch.current === epoch;
    recognition.current = instance;
    instance.lang = navigator.language;
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => { if (!current()) return;
      setDraft((value) =>
        (
          value +
          " " +
          Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ")
        )
          .trim()
          .slice(0, 8000),
      );
    };
    instance.onerror = () => {
      if (!current()) return;
      speechEpoch.current++;
      setLocalError(
        "Voice input stopped. Check microphone permission or type your message.",
      );
      setListening(false);
    };
    instance.onend = () => { if (current()) { speechEpoch.current++; setListening(false); } };
    try {
      setListening(true);
      instance.start();
    } catch {
      cancelVoice(); setListening(false);
      setLocalError("Microphone could not start.");
    }
  }
  return (
    <section
      className="flex h-full min-h-0 flex-col bg-gradient-to-b from-background from-50% to-sky-100/70 dark:to-sky-950/30"
      aria-label={`${name} assistant`}
    >
      <header className="flex items-center gap-3 border-b px-4 py-3 pr-12">
        <img src={logoSrc} alt="" className="size-7" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">
            Your business coworker
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="New chat"
          disabled={working}
          onClick={() => {
            if (working || sending.current) return;
            cancelVoice();
            setListening(false);
            onNew();
            setDraft("");
            setFiles([]);
            setAttachmentKey((value) => value + 1);
            setTab("chat");
          }}
        >
          <Plus className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Chat history"
          onClick={() => setTab(tab === "history" ? "chat" : "history")}
        >
          <History className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Chat connection settings"
          onClick={() => setTab(tab === "settings" ? "chat" : "settings")}
        >
          <Settings className="size-4" />
        </Button>
      </header>
      <div ref={feed} className="min-h-0 flex-1 overflow-y-auto p-4">
        {tab !== "chat" ? (
          <div className="space-y-4">
            <Button size="sm" variant="outline" onClick={() => setTab("chat")}>
              Back to chat
            </Button>
            {tab === "history" ? history : settings}
          </div>
        ) : !messages.length ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 py-12 text-center">
            <img src={logoSrc} alt="" className="size-12" />
            <h2 className="text-xl font-semibold">
              How can I help with your work?
            </h2>
            <p className="text-sm text-muted-foreground">
              Ask about your business work and permitted records.
            </p>
          </div>
        ) : (
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="space-y-5"
          >
            {messages.map((item) => (
              <article
                key={item.id}
                className={
                  item.role === "user"
                    ? "ml-5 rounded-xl bg-muted p-3"
                    : "space-y-2"
                }
              >
                <p className="text-xs text-muted-foreground">
                  {item.role === "user" ? "You" : name}
                </p>
                <MarkdownContent content={item.content} />
                {item.status && item.status !== "completed" && (
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                )}
                {item.role === "assistant" && item.content && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Copy reply"
                    onClick={() => void clipboard.copyText(item.content)}
                  >
                    <Copy className="size-3" />
                    {clipboard.copied ? "Copied" : "Copy"}
                  </Button>
                )}
                {item.role === "assistant" &&
                  item.status === "completed" &&
                  onReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReview(item.id)}
                    >
                      Ask owner to review
                    </Button>
                  )}
              </article>
            ))}
          </div>
        )}
        {working && (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            Preparing your reply…
          </p>
        )}
      </div>
      <footer className="shrink-0 space-y-2 p-3">
        {(error || localError || clipboard.error) && (
          <p role="alert" className="text-sm text-destructive">
            {error || localError || clipboard.error}
          </p>
        )}
        <form
          className="rounded-2xl border bg-card p-3 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <Textarea
            aria-label={`Message ${name}`}
            placeholder={`Ask ${name} about your work…`}
            value={draft}
            maxLength={8000}
            disabled={working || listening}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void send();
              }
            }}
            className="min-h-20 resize-none border-0 shadow-none"
          />
          <div className="my-2">
            <FileUpload
              key={attachmentKey}
              selectionOnly
              compact
              accept=".txt,.md,.csv,.json"
              maxSizeBytes={131072}
              maxFiles={2}
              onFilesChange={(items) =>
                setFiles(items.map((item) => item.file))
              }
              disabled={working}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">
              Review attachments and dictated text before sending.
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              aria-pressed={listening}
              disabled={working}
              onClick={voice}
            >
              <Mic className="size-4" />
            </Button>
            {working ? (
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Stop reply"
                onClick={onStop}
              >
                <Square className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={!draft.trim() || listening}
              >
                <ArrowUp className="size-4" />
              </Button>
            )}
          </div>
        </form>
        <p className="text-[11px] text-muted-foreground">
          AI replies need review. Voice input may use your browser’s speech
          service.
        </p>
      </footer>
    </section>
  );
}
