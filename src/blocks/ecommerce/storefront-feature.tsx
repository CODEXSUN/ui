import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/button.js';
import type { StorefrontImage, StorefrontBranding } from '../../../contracts/ecommerce.js';
import { StorefrontBrand } from './storefront-brand.js';

export function StorefrontFeature({ eyebrow, title, description, image, action }: { eyebrow: string; title: string; description: string; image: StorefrontImage; action: { label: string; onClick: () => void } }) {
  return <section className="ec-container ec-feature" aria-label={eyebrow}><div className="ec-feature-copy"><p className="ec-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p><Button type="button" variant="outline" className="ec-pill" onClick={action.onClick}>{action.label}<ArrowUpRight size={16}/></Button></div><img {...image} width={image.width ?? 1024} height={image.height ?? 1024} loading="lazy"/></section>;
}

export function StorefrontValues({ title, items }: { title: string; items: readonly { title: string; description: string }[] }) {
  return <section id="our-approach" className="ec-container ec-values" aria-labelledby="approach-title"><p className="ec-eyebrow">A MORE CONSIDERED EVERYDAY</p><h2 id="approach-title">{title}</h2><div>{items.map((item, index) => <article key={item.title}><span className="ec-value-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>;
}

export function StorefrontFooter({ brand, logoSrc, logoDarkSrc, description, links = [], groups, note }: StorefrontBranding & { brand: string; description: string; links?: readonly { label: string; href: string }[]; groups?: readonly { title: string; links: readonly { label: string; href: string }[] }[]; note: string }) {
  return <footer className="ec-footer"><div className="ec-container"><div className="ec-footer-top"><div className="ec-footer-brand"><StorefrontBrand brand={brand} href="/" logoSrc={logoSrc} logoDarkSrc={logoDarkSrc}/><p>{description}</p><a href="#storefront-main" className="ec-text-link">Back to the top<ArrowUpRight size={13}/></a></div><nav aria-label="Footer navigation" className="ec-footer-groups">{(groups ?? [{ title: 'Explore', links }]).map(group => <div key={group.title}><h2>{group.title}</h2>{group.links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}</div>)}</nav></div><div className="ec-footer-bottom"><span>{note}</span></div></div></footer>;
}
