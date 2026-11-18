import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/button.js';
import type { StorefrontImage } from '../../../contracts/ecommerce.js';

/** An editorial announcement with app-owned copy, imagery and a real destination. */
export function StorefrontAnnouncementBanner({ id, title, eyebrow, description, images, actionHref, actionLabel = 'Explore the collection' }: {
  id: string; title: string; eyebrow?: string; description?: string; images: readonly StorefrontImage[];
  actionHref?: string; actionLabel?: string;
}) {
  return <section id={id} className="ec-announcement-banner" aria-labelledby={id + '-heading'}>
    <div className="ec-announcement-art ec-announcement-art-left">{images[0] && <img src={images[0].src} alt="" width={500} height={500} loading="lazy"/>}</div>
    <div className="ec-announcement-copy">{eyebrow && <p className="ec-eyebrow">{eyebrow}</p>}<h2 id={id + '-heading'}>{title}</h2>{description && <p className="ec-announcement-description">{description}</p>}{actionHref && <Button asChild className="ec-pill"><a href={actionHref}>{actionLabel}<ArrowUpRight size={16}/></a></Button>}</div>
    <div className="ec-announcement-art ec-announcement-art-right">{images[1] && <img src={images[1].src} alt="" width={500} height={500} loading="lazy"/>}</div>
  </section>;
}
