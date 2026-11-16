import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs.js';

export type FormTab = { value: string; label: string; icon?: ReactNode; count?: number; content: ReactNode };
export function FormAnimatedTabs({ tabs, value, onValueChange, label = 'Record details' }: { tabs: readonly FormTab[]; value: string; onValueChange: (value: string) => void; label?: string }) {
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const measure = () => {
      const root = list.current;
      const active = root?.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (root && active) setBar({ left: active.offsetLeft + 8, width: Math.max(0, active.offsetWidth - 16) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  }, [value, tabs]);
  return <Tabs value={value} onValueChange={onValueChange} className="w-full overflow-hidden rounded-md border border-border bg-card shadow-sm">
    <TabsList ref={list} aria-label={label} className="relative h-auto w-full justify-start gap-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-none border-b border-border bg-card p-0">
      {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value} className="relative shrink-0 gap-1.5 rounded-none border-0 bg-transparent px-4 py-2.5 text-muted-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none [&_svg]:size-4">{tab.icon}{tab.label}{tab.count !== undefined && <span className="rounded-full bg-accent px-1 text-xs text-accent-foreground">{tab.count}</span>}</TabsTrigger>)}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 h-0.5 bg-foreground transition-[left,width] duration-200 ease-out motion-reduce:transition-none" style={bar}/>
    </TabsList>
    {tabs.map(tab => <TabsContent key={tab.value} value={tab.value} className="m-0 min-h-32 p-4 text-sm">{tab.content}</TabsContent>)}
  </Tabs>;
}
