import type { LucideIcon } from "lucide-react";

export type MainLayoutNavigationItem = {
  count?: number;
  children?: MainLayoutNavigationItem[];
  icon?: LucideIcon;
  label: string;
  onSelect?: () => void;
};

export type MainLayoutNavigationSection = {
  icon?: LucideIcon;
  items: MainLayoutNavigationItem[];
  label: string;
};
