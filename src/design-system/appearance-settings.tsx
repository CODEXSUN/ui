import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useDesignSystem } from './provider.js';
import { designPalettes } from './palettes.js';

const appearanceModes = [
  {
    id: "system",
    label: "System default",
    description: "Follow your device setting",
    icon: MonitorIcon
  },
  { id: "light", label: "Light", description: "A bright workspace", icon: SunIcon },
  { id: "dark", label: "Dark", description: "A darker workspace", icon: MoonIcon }
] as const;

export function AppearanceSettings() {
  const { preferences, update } = useDesignSystem();
  return (
          <div className="space-y-5">
            <div className="rounded-md border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Appearance &amp; Theme</h2>
              <p className="text-sm text-muted-foreground">
                Changes apply immediately and are saved on this device.
              </p>
              <div aria-label="Appearance mode" className="mt-5 grid gap-2 sm:grid-cols-3">
                {appearanceModes.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    aria-pressed={preferences.mode === id}
                    className={`min-h-24 rounded-md border p-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${preferences.mode === id ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => update({ mode: id })}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="mb-2 size-4 text-primary" />
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Design theme</h2>
              <p className="text-sm text-muted-foreground">
                Choose a palette from the shared UI design system.
              </p>
              <div aria-label="Design theme" className="mt-4 grid gap-2 sm:grid-cols-2">
                {designPalettes.map((variant) => (
                  <button
                    key={variant.id}
                    aria-label={`${variant.name}, ${variant.density}`}
                    aria-pressed={preferences.palette === variant.id}
                    className={`flex min-h-16 items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${preferences.palette === variant.id ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => update({ palette: variant.id })}
                    type="button"
                  >
                    <span aria-hidden="true" className="flex shrink-0 -space-x-1.5">
                      {variant.palette.map((color, index) => (
                        <span
                          key={index}
                          className="size-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{variant.name}</span>
                      <span className="block text-xs text-muted-foreground">{variant.density}</span>
                    </span>
                    {preferences.palette === variant.id ? (
                      <CheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
  );
}
