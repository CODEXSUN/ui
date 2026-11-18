import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, Search, ShoppingBag, ShoppingCart, CircleUserRound, ChevronDown, Ellipsis, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../components/dropdown-menu.js';
import { StorefrontBrand } from './storefront-brand.js';
import type { StorefrontBranding } from '../../../contracts/ecommerce.js';
import { Button } from '../../components/button.js';
import { Input } from '../../components/input.js';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '../../components/sheet.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/dialog.js';
import { useStorefrontTheme } from './theme.js';

type NavigationLink = { label: string; href: string };
export type StorefrontHeaderMenuItem = { id: string; label: string; icon?: ReactNode; href?: string; onSelect?: () => void; disabled?: boolean };
export type StorefrontHeaderMenu = { title: string; notice?: string; items: readonly StorefrontHeaderMenuItem[] };
export function StorefrontHeader({ brand, homeHref, logoSrc, logoDarkSrc, links, search, onSearchChange, onSearchSubmit, onBagOpen, bagCount = 0, announcement, previewLabel, layout = 'standard', accountMenu, moreMenu }: StorefrontBranding & {
  brand: string; homeHref: string; links: readonly NavigationLink[]; search: string; onSearchChange: (value: string) => void;
  onBagOpen: () => void; bagCount?: number; announcement?: string; previewLabel?: string;
  layout?: 'standard' | 'search'; onSearchSubmit?: (value: string) => void;
  accountMenu?: StorefrontHeaderMenu; moreMenu?: StorefrontHeaderMenu;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const submitted = useRef(false);
  const theme = useStorefrontTheme();
  const [query, setQuery] = useState(search);
  useEffect(() => { setQuery(search); }, [search]);
  function customerMenu(menu: StorefrontHeaderMenu, label: string, icon: ReactNode, iconClass?: string) {
    return <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" className="ec-header-customer-action" aria-label={label}><span className={iconClass}>{icon}</span><span className="ec-header-action-label">{label}</span><ChevronDown size={13} className="ec-header-action-chevron"/></Button></DropdownMenuTrigger>
      <DropdownMenuContent {...theme} align="end" sideOffset={12} aria-label={label + ' menu'} className={`${theme.className} ec-customer-menu`}><DropdownMenuLabel>{menu.title}</DropdownMenuLabel>{menu.notice && <p className="ec-customer-menu-notice">{menu.notice}</p>}<DropdownMenuSeparator/>{menu.items.map(item => item.href && !item.disabled ? <DropdownMenuItem key={item.id} asChild><a href={item.href}>{item.icon}{item.label}</a></DropdownMenuItem> : <DropdownMenuItem key={item.id} disabled={item.disabled || !item.onSelect} onSelect={item.onSelect}>{item.icon}{item.label}</DropdownMenuItem>)}</DropdownMenuContent>
    </DropdownMenu>;
  }
  if (layout === 'search') return <>
    <a className="ec-skip" href="#storefront-main">Skip to content</a>
    {announcement && <div className="ec-announcement">{announcement}</div>}
    <header className="ec-header ec-header-search-layout"><div className="ec-container ec-header-inner ec-header-search-inner">
      <Sheet><SheetTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label="Open store menu" className="ec-menu-trigger"><Menu size={22}/></Button></SheetTrigger>
        <SheetContent {...theme} side="left" className={`${theme.className} ec-menu-sheet ec-search-menu-sheet`}><SheetHeader><SheetTitle>{brand}</SheetTitle><SheetDescription className="sr-only">Shop collections, track your order and get help.</SheetDescription></SheetHeader>
          <nav aria-label="Store navigation" className="ec-menu-links">{links.map(link => <SheetClose asChild key={link.label}><a href={link.href}>{link.label}<ArrowUpRight size={18} aria-hidden="true"/></a></SheetClose>)}</nav>
        </SheetContent>
      </Sheet>
      <StorefrontBrand brand={brand} href={homeHref} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc}/>
      <form role="search" aria-label="Search store" className="ec-header-search" onSubmit={event => { event.preventDefault(); (onSearchSubmit ?? onSearchChange)(query.trim()); }}>
        <Input type="search" aria-label="Search store products" placeholder="Search products, brands and more" value={query} onChange={event => setQuery(event.target.value)} maxLength={120}/>
        {query && <Button type="button" variant="ghost" size="icon-sm" aria-label="Clear store search" onClick={() => { setQuery(''); (onSearchSubmit ?? onSearchChange)(''); }}><X size={16}/></Button>}
        <Button type="submit" variant="default" className="ec-header-search-submit" aria-label="Search"><Search size={20}/></Button>
      </form>
      <div className="ec-customer-actions">
        {accountMenu && customerMenu(accountMenu, 'Login', <CircleUserRound size={20}/>)}
        {moreMenu && customerMenu(moreMenu, 'More', <Ellipsis size={20}/>, 'ec-header-more-icon')}
        <Button type="button" variant="ghost" data-storefront-bag-trigger aria-label={`Cart, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`} onClick={onBagOpen} className="ec-bag-trigger ec-header-customer-action"><ShoppingCart size={21}/><span className="ec-header-action-label">Cart</span>{bagCount > 0 && <span className="ec-bag-count">{bagCount}</span>}</Button>
      </div>
    </div></header>
  </>;
  return <>
    <a className="ec-skip" href="#storefront-main">Skip to content</a>
    {announcement && <div className="ec-announcement">{announcement}<ArrowUpRight size={12} aria-hidden="true"/></div>}
    <header className="ec-header"><div className="ec-container ec-header-inner">
      <StorefrontBrand brand={brand} href={homeHref} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc}/>
      <nav className="ec-desktop-nav" aria-label="Store navigation">{links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}</nav>
      <div className="ec-header-actions">
        {previewLabel && <span className="ec-preview-label">{previewLabel}</span>}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label="Search collection"><Search size={19}/></Button></DialogTrigger>
          <DialogContent {...theme} onCloseAutoFocus={event => { if (submitted.current) { event.preventDefault(); submitted.current = false; document.getElementById('collection')?.focus(); } }} className={`${theme.className} ec-search-dialog`}>
            <DialogHeader><DialogTitle>Find your everyday essential.</DialogTitle><DialogDescription>Search this collection by name or description.</DialogDescription></DialogHeader>
            <form onSubmit={event => { event.preventDefault(); submitted.current = true; setSearchOpen(false); }}>
              <label htmlFor="storefront-search" className="sr-only">Search products</label>
              <Input id="storefront-search" type="search" value={search} onChange={event => onSearchChange(event.target.value)} placeholder="Headphones, speakers, earbuds…"/>
              <Button type="submit" variant="default" className="mt-4 w-full">View results</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button type="button" variant="ghost" size="icon" data-storefront-bag-trigger aria-label={`Open bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`} onClick={onBagOpen} className="ec-bag-trigger"><ShoppingBag size={19}/>{bagCount > 0 && <span className="ec-bag-count">{bagCount}</span>}</Button>
        <Sheet><SheetTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label="Open store menu" className="ec-mobile-menu"><Menu size={20}/></Button></SheetTrigger>
          <SheetContent {...theme} className={`${theme.className} ec-menu-sheet`}><SheetHeader><SheetTitle>{brand}</SheetTitle><SheetDescription>Explore the collection.</SheetDescription></SheetHeader>
            <nav aria-label="Mobile store navigation" className="ec-menu-links">{links.map(link => <SheetClose asChild key={link.label}><a href={link.href}>{link.label}<ArrowUpRight size={20} aria-hidden="true"/></a></SheetClose>)}</nav>
          </SheetContent>
        </Sheet>
      </div>
    </div></header>
  </>;
}
