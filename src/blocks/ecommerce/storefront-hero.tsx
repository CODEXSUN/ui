import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { Button } from '../../components/button.js';
import type { StorefrontImage } from '../../../contracts/ecommerce.js';

export function StorefrontHero({ eyebrow, title, description, image, primaryAction, secondaryAction, caption }: {
  eyebrow: string; title: string; description: string; image: StorefrontImage;
  primaryAction: { label: string; href: string }; secondaryAction?: { label: string; onClick: () => void }; caption?: string;
}) {
  return <section className="ec-hero" aria-labelledby="storefront-title"><div className="ec-container ec-hero-grid">
    <div className="ec-hero-copy"><p className="ec-eyebrow">{eyebrow}</p><h1 id="storefront-title">{title}</h1><p className="ec-hero-description">{description}</p>
      <div className="ec-hero-actions"><Button asChild variant="default" className="ec-pill"><a href={primaryAction.href}>{primaryAction.label}<ArrowUpRight size={16}/></a></Button>{secondaryAction && <Button type="button" variant="link" onClick={secondaryAction.onClick}>{secondaryAction.label}<ArrowUpRight size={15}/></Button>}</div>
      <a href="#collection" className="ec-hero-scroll"><ArrowDown size={14} aria-hidden="true"/>Discover a little more</a>
    </div>
    <figure className="ec-hero-media"><img {...image} width={image.width ?? 1536} height={image.height ?? 1024} fetchPriority="high"/><figcaption>{caption}</figcaption></figure>
  </div></section>;
}
