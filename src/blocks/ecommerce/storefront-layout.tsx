import type { CSSProperties, ReactNode } from 'react';
import type { StorefrontPresentation } from '../../../contracts/ecommerce.js';
import { useStorefrontTheme } from './theme.js';

export function StorefrontLayout({ children, className = '', onNavigate, presentation, contentWidth = 'standard' }: { children: ReactNode; className?: string; onNavigate?: (href: string) => boolean; presentation?: StorefrontPresentation; contentWidth?: 'standard' | 'aligned' }) {
  const theme = useStorefrontTheme();
  return <div {...theme} className={`ecommerce-storefront ${theme.className} ${presentation ? 'ec-presentation' : ''} ${contentWidth === 'aligned' ? 'ec-aligned-layout' : ''} ${className}`} data-card-variant={presentation?.cardVariant} data-spacing={presentation?.spacing} style={presentation ? { '--ec-columns': presentation.columns } as CSSProperties : undefined} onClick={event => {
    if (!onNavigate || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    if (onNavigate(link.href)) event.preventDefault();
  }}>{children}</div>;
}
