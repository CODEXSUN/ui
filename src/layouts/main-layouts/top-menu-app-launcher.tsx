import { useEffect, useState } from "react";
import { BotIcon, CheckIcon, ClipboardListIcon, ContactIcon, GripIcon, LayoutDashboardIcon, PackageIcon, ReceiptTextIcon, Settings2Icon, UsersIcon } from "lucide-react";
import { Button } from "../../components/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/dropdown-menu.js";
import type { TopMenuAppItem } from "./top-menu-types.js";

const appIcons: Record<string, typeof LayoutDashboardIcon> = {
  'core-app': ClipboardListIcon, billing: ReceiptTextIcon, crm: ContactIcon,
  ecommerce: PackageIcon, hrms: UsersIcon, automation: Settings2Icon,
  zetro: BotIcon, texlinks: PackageIcon, abconnect: UsersIcon
};

export function TopMenuAppLauncher({
  addonItems = [],
  items,
  catalogUrl
}: {
  addonItems?: TopMenuAppItem[];
  items: TopMenuAppItem[];
  catalogUrl?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [remoteItems, setRemoteItems] = useState<TopMenuAppItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    if (!open || !catalogUrl) return;
    const controller = new AbortController();
    setState('loading');
    let destination: URL;
    let selector: string | null;
    try {
      destination = new URL(catalogUrl, window.location.origin);
      if (destination.origin !== window.location.origin || destination.username || destination.password) throw new Error('Invalid app catalogue');
      selector = sessionStorage.getItem('codebiz.platform.tab');
      if (!/^[a-f0-9]{32}$/.test(selector ?? '')) throw new Error('Workspace tab unavailable');
    } catch {
      setState('error');
      return () => controller.abort();
    }
    fetch(destination.href, { credentials: 'same-origin', redirect: 'error', signal: controller.signal, headers: selector ? { 'X-Platform-Tab': selector } : {} })
      .then(async response => {
        if (!response.ok) throw new Error('App list unavailable');
        const value: { apps: { appKey: string; name: string; url: string }[]; platformUrl?: string } = await response.json();
        if (!Array.isArray(value.apps)) throw new Error('Invalid app list');
        const safeUrl = (url: string) => {
          const parsed = new URL(url, window.location.origin);
          if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('Invalid app destination');
          return parsed.href;
        };
        const apps: TopMenuAppItem[] = value.apps.map(app => {
          if (typeof app.appKey !== 'string' || typeof app.name !== 'string' || typeof app.url !== 'string') throw new Error('Invalid app list');
          const url = safeUrl(app.url);
          return { title: app.name, description: `Open ${app.name}`, url, icon: appIcons[app.appKey] ?? LayoutDashboardIcon, active: new URL(url).origin === window.location.origin };
        });
        if (value.platformUrl) {
          const url = safeUrl(value.platformUrl);
          apps.unshift({ title: 'Platform', description: 'Open Platform', url, icon: LayoutDashboardIcon, active: new URL(url).origin === window.location.origin });
        }
        if (!controller.signal.aborted) {
          setRemoteItems(apps);
          setState('ready');
        }
      }).catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [catalogUrl, open]);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Apps"
          className="size-9 rounded-full p-0 ring-2 ring-primary/20 ring-offset-1 ring-offset-background"
          size="icon"
          variant="ghost"
        >
          <GripIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[min(80vh,48rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.75rem] border bg-popover p-3 text-popover-foreground shadow-2xl"
        sideOffset={10}
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium">Apps</DropdownMenuLabel>
        {catalogUrl && state !== 'ready' ? <p className="px-3 py-2 text-sm text-muted-foreground" role="status">{state === 'loading' ? 'Loading apps…' : 'Apps are unavailable. Close and reopen to try again.'}</p> : <AppGrid items={orderApps(catalogUrl ? remoteItems : items)} />}
        {addonItems.length ? (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuLabel className="px-3 py-2 text-sm font-medium">Add-ons</DropdownMenuLabel>
            <AppGrid items={addonItems} />
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function orderApps(items: TopMenuAppItem[]): TopMenuAppItem[] {
  const firstApps = ["application", "codexsun", "billing"];
  const priority = (item: TopMenuAppItem) => {
    const index = firstApps.indexOf(item.title.trim().toLowerCase());
    return index < 0 ? firstApps.length : index;
  };

  return [...items].sort((left, right) => priority(left) - priority(right));
}

function AppGrid({ items }: { items: TopMenuAppItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl bg-background p-2 shadow-sm">
      {items.map((item) => (
        <DropdownMenuItem
          asChild
          className="relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-2 text-center"
          key={item.title}
          {...(item.onSelect
            ? {
                onSelect: (event) => {
                  event.preventDefault();
                  item.onSelect?.();
                }
              }
            : {})}
        >
          {item.url && !item.onSelect ? (
            <a href={item.url} title={item.description} target="_blank" rel="noopener noreferrer">
              <AppTile item={item} />
            </a>
          ) : (
            <button title={item.description} type="button">
              <AppTile item={item} />
            </button>
          )}
        </DropdownMenuItem>
      ))}
    </div>
  );
}

function AppTile({ item }: { item: TopMenuAppItem }) {
  return (
    <>
      <div
        className={`relative flex size-11 items-center justify-center rounded-xl border bg-background shadow-sm ${item.active ? "border-primary/40 bg-primary/10 text-primary ring-2 ring-primary/10" : ""}`}
      >
        <item.icon className="size-5" />
        {item.active ? (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-2.5" />
          </span>
        ) : null}
      </div>
      <span className="w-full truncate text-center text-xs font-medium">{item.title}</span>
    </>
  );
}
