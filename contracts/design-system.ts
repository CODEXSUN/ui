export type ThemeMode = 'light' | 'dark' | 'system';
export type Accent = 'green' | 'blue' | 'violet';
export type DesignPalette = 'default' | 'compact' | 'clear' | 'shadcn' | 'neutral' | 'orange' | 'green' | 'blue' | 'purple' | 'graphite';
export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'success' | 'danger';
export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'studio-success' | 'studio-warning';
export type CardVariant = 'default' | 'outline' | 'soft';
export type DesignPreferences = {
  componentDefaults: Record<string, string>;
  palette: DesignPalette;
  mode: ThemeMode;
  accent: Accent;
  button: ButtonVariant;
  badge: BadgeVariant;
  card: CardVariant;
};
