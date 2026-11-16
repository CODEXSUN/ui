import { useState, type CSSProperties, type ReactNode } from "react";
import { LayoutDashboardIcon, PanelLeftIcon, PanelsTopLeftIcon, Settings2Icon } from "lucide-react";
import { AppLayout } from "./app-layout.js";
import { AppHeader, type AppHeaderBreadcrumb } from "./app-header.js";
import { SideMenu } from "./side-menu.js";
import { StatusBar } from "./status-bar.js";
import { TopMenu, type TopMenuProps } from "./top-menu.js";
import type { TopMenuNotification } from "./top-menu-notifications.js";
import type { TopMenuSearchItem } from "./top-menu-search.js";
import type { TopMenuAppItem, TopMenuUser } from "./top-menu-types.js";
import type { MainLayoutNavigationItem, MainLayoutNavigationSection } from "./types.js";
import { SidebarProvider, SidebarInset, useSidebar } from "../../components/sidebar.js";

export type MainLayoutProps = {
  addonItems?: TopMenuAppItem[];
  appItems: TopMenuAppItem[];
  applicationName: string;
  companyBrand?: TopMenuProps['companyBrand'];
  children?: ReactNode;
  className?: string;
  homeHref?: string;
  navigation: MainLayoutNavigationSection[];
  notifications?: TopMenuNotification[];
  logoutHref?: string;
  onLogout?: () => void | Promise<void>;
  onNotificationDismiss?: (id: string) => void;
  onProfile?: () => void;
  onSettingsSelect?: () => void;
  onOverviewSelect?: () => void;
  initialSelection?: string;
  selectedPage?: string;
  headerBreadcrumbs?: AppHeaderBreadcrumb[];
  headerActions?: ReactNode;
  headerName?: string | null;
  headerClassName?: string;
  profileHref?: string;
  searchPlaceholder?: string;
  statusLabel?: string;
  workspaceTitle?: string;
  versionLabel?: string;
  showOverview?: boolean;
  user: TopMenuUser;
};

export function MainLayout(props: MainLayoutProps) {
  return <SidebarProvider className="h-dvh min-h-0" style={{ "--sidebar-width": "19rem", "--sidebar-width-icon": "2.5rem" } as CSSProperties}><MainLayoutShell {...props} /></SidebarProvider>;
}

function MainLayoutShell({
  addonItems = [],
  appItems,
  applicationName,
  companyBrand,
  children,
  className = "",
  homeHref,
  navigation,
  notifications = [],
  logoutHref,
  onLogout,
  onNotificationDismiss,
  onProfile,
  onSettingsSelect,
  onOverviewSelect,
  initialSelection,
  selectedPage,
  headerBreadcrumbs,
  headerActions,
  headerName,
  headerClassName,
  profileHref,
  searchPlaceholder = "Search workspaces or commands...",
  statusLabel = "Ready",
  workspaceTitle = "Overview",
  versionLabel = "v 0.1.0",
  showOverview,
  user
}: MainLayoutProps) {
  const { open: sidebarOpen, toggleSidebar, setOpenMobile } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localSelected, setSelected] = useState(initialSelection ?? workspaceTitle);
  const selected = selectedPage ?? localSelected;
  function selectPage(label: string) {
    setOpenMobile(false);
    setSelected(label);
    if (label === 'Settings') onSettingsSelect?.();
    if (label === workspaceTitle) onOverviewSelect?.();
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearch("");
  }

  function navigationCommands(items: MainLayoutNavigationItem[], section: MainLayoutNavigationSection): TopMenuSearchItem[] {
    return items.flatMap(item => [
      ...(item.children?.length && !item.onSelect ? [] : [{
        label: `Go to ${item.label}`,
        description: `Open ${section.label}`,
        icon: item.icon ?? section.icon ?? PanelsTopLeftIcon,
        onSelect: () => { selectPage(item.label); item.onSelect?.(); },
      }]),
      ...navigationCommands(item.children ?? [], section),
    ]);
  }

  const searchItems: TopMenuSearchItem[] = [
    {
      label: `Go to ${workspaceTitle}`,
      description: "Open workspace overview",
      icon: LayoutDashboardIcon,
      onSelect: () => selectPage(workspaceTitle)
    },
    ...navigation.flatMap(section => navigationCommands(section.items, section)),
    {
      label: "Open settings",
      description: "Open workspace settings",
      icon: Settings2Icon,
      onSelect: () => selectPage("Settings")
    },
    {
      label: "Toggle sidebar",
      description: sidebarOpen ? "Hide workspace navigation" : "Show workspace navigation",
      icon: PanelLeftIcon,
      onSelect: toggleSidebar
    }
  ];

  return (
    <AppLayout className={className}>
      <TopMenu
        addonItems={addonItems}
        appItems={appItems}
        applicationName={applicationName}
        companyBrand={companyBrand}
        {...(logoutHref ? { logoutHref } : {})}
        notifications={notifications}
        onCloseSearch={closeSearch}
        {...(onLogout ? { onLogout } : {})}
        {...(onNotificationDismiss ? { onNotificationDismiss } : {})}
        onOpenSearch={() => setSearchOpen(true)}
        {...(onProfile ? { onProfile } : {})}
        onSearchChange={setSearch}
        onToggleSidebar={toggleSidebar}
        {...(profileHref ? { profileHref } : {})}
        search={search}
        searchItems={searchItems}
        searchOpen={searchOpen}
        searchPlaceholder={searchPlaceholder}
        user={user}
      />
      <div className="relative flex min-h-0 flex-1 pt-0.5">
          <SideMenu
            navigation={navigation}
            onSelect={selectPage}
            search={search}
            selected={selected}
            workspaceTitle={workspaceTitle}
            showOverview={showOverview}
          />
        <SidebarInset className="min-h-0 min-w-0 overflow-hidden md:peer-data-[variant=inset]:m-1 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:mt-0 md:peer-data-[variant=inset]:mb-0.5">
          <AppHeader
            breadcrumbs={headerBreadcrumbs ?? [{ label: selected }]}
            homeHref={homeHref ?? appItems.find((item) => item.active)?.url ?? "/"}
            name={headerName === null ? undefined : headerName ?? user.name}
            actions={headerActions}
            className={headerClassName}
          />
          <div aria-label="Workspace canvas" className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </div>
      <StatusBar status={statusLabel} workspace={selected} versionLabel={versionLabel} />
    </AppLayout>
  );
}
