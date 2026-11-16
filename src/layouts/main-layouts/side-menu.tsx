import { CircleHelpIcon, LayoutDashboardIcon, Settings2Icon } from "lucide-react";
import { AppSidebar } from "../../blocks/menu/sidemenu/app-sidebar.js";
import type { SidemenuItem, SidemenuSubItem } from "../../blocks/menu/sidemenu/sub/sidemenu-section.js";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../components/sidebar.js";
import type { MainLayoutNavigationItem, MainLayoutNavigationSection } from "./types.js";

export type SideMenuProps = {
  navigation: MainLayoutNavigationSection[];
  onSelect: (label: string) => void;
  search: string;
  selected: string;
  workspaceTitle: string;
  versionLabel?: string;
  showOverview?: boolean;
};

/** Reference tenant sidebar; the host supplies navigation content and actions. */
export function SideMenu({ navigation, onSelect, search, selected, workspaceTitle, showOverview = true }: SideMenuProps) {
  const isSelected = (item: MainLayoutNavigationItem): boolean => selected === item.label || Boolean(item.children?.some(isSelected));
  function toItem(item: MainLayoutNavigationItem, fallbackIcon = CircleHelpIcon): SidemenuItem {
    return {
      title: item.label,
      icon: item.icon ?? fallbackIcon,
      isActive: isSelected(item),
      count: item.count,
      onSelect: () => { onSelect(item.label); item.onSelect?.(); },
      items: item.children?.map(child => toItem(child, item.icon ?? fallbackIcon) as SidemenuSubItem),
    };
  }
  const items: SidemenuItem[] = [
    ...(showOverview ? [{ title: workspaceTitle, icon: LayoutDashboardIcon, isActive: selected === workspaceTitle, onSelect: () => onSelect(workspaceTitle) }] : []),
    ...navigation.flatMap(section => section.items.filter(item => !search || item.label.toLowerCase().includes(search.toLowerCase())).map(item => toItem(item, section.icon))),
  ];
  return <AppSidebar
    aria-label="Application navigation"
    className="md:p-1 md:pt-0.5 md:pb-0.5"
    items={items}
    positioning="container"
    user={{ name: '', email: '', fallback: '' }}
    variant="inset"
    footerContent={<>
      <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild isActive={selected === 'Settings'} tooltip="Settings"><button onClick={() => onSelect('Settings')} type="button"><Settings2Icon /><span className="group-data-[collapsible=icon]:hidden">Settings</span></button></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
    </>}
  />;
}
