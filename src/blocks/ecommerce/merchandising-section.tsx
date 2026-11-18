import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../../components/carousel.js';
import { StorefrontProductCard } from './product-collection.js';
import { StorefrontAnnouncementBanner } from './announcement-banner.js';
import type { StorefrontProduct } from '../../../contracts/ecommerce.js';

/** Display-only merchandising. The consumer selects products and supplies honest offer copy. */
export function StorefrontMerchandisingSection({ id, title, subtitle, badge, kind, products, onProductView, actionHref, carouselStyle = 'cards' }: {
  id: string; title: string; subtitle?: string; badge?: string; kind: 'products' | 'offers' | 'promotion' | 'carousel' | 'announcement';
  products: readonly StorefrontProduct[]; onProductView: (id: string) => void; actionHref?: string;
  carouselStyle?: 'cards' | 'editorial';
}) {
  if (!products.length) return null;
  if (kind === 'announcement') return <StorefrontAnnouncementBanner id={id} title={title} eyebrow={badge} description={subtitle} images={products.slice(0, 2).map(product => product.image)} actionHref={actionHref}/>;
  if (kind === 'carousel' && carouselStyle === 'editorial') return <section id={id} className="ec-container ec-editorial-rail" aria-labelledby={id + '-heading'}>
    <div className="ec-section-heading"><div>{badge && <p className="ec-eyebrow">{badge}</p>}<h2 id={id + '-heading'}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{actionHref && <a className="ec-text-link" href={actionHref}>Shop all<ArrowUpRight size={15}/></a>}</div>
    <Carousel opts={{ align: 'start', slidesToScroll: 'auto' }} aria-label={title} className="ec-editorial-carousel">
      <CarouselContent className="ec-editorial-track">{products.map(product => <CarouselItem className="ec-editorial-item" key={product.id}><StorefrontProductCard product={product} onView={onProductView}/></CarouselItem>)}
        {actionHref && <CarouselItem className="ec-editorial-item ec-editorial-more"><a href={actionHref}>See more<ArrowUpRight size={20}/></a></CarouselItem>}
      </CarouselContent>
      <CarouselPrevious className="ec-editorial-previous"/><CarouselNext className="ec-editorial-next"/>
    </Carousel>
  </section>;
  const heading = <div className="ec-section-heading"><div>{kind === 'offers' && badge && <p className="ec-eyebrow">{badge}</p>}<h2 id={id + '-heading'}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{actionHref && <a className="ec-text-link" href={actionHref}>View all<ArrowUpRight size={15}/></a>}</div>;
  return <section id={id} className={`ec-container ec-merchandising ec-merchandising-${kind}`} aria-labelledby={id + '-heading'}>
    {kind === 'carousel' ? <Carousel opts={{ align: 'start' }} aria-label={title}>
      <div className="ec-merchandising-carousel-heading">{heading}<div className="ec-carousel-controls"><CarouselPrevious/><CarouselNext/></div></div>
      <CarouselContent className="ec-merchandising-track">{products.map(product => <CarouselItem className="ec-merchandising-item" key={product.id}><StorefrontProductCard product={product} onView={onProductView}/></CarouselItem>)}</CarouselContent>
    </Carousel> : <>{heading}{kind === 'promotion' ? <div className="ec-promotion-grid">{products.slice(0, 3).map((product, index) => <article className="ec-promotion-card" data-tone={index % 3} key={product.id}>
      <div>{badge && <p className="ec-eyebrow">{badge}</p>}<h3>{product.category}</h3><p>{product.name}</p><Button variant="link" onClick={() => onProductView(product.id)}>Explore<ArrowUpRight size={15}/></Button></div>
      <Button variant="ghost" className="ec-promotion-image" aria-label={`Explore ${product.name}`} onClick={() => onProductView(product.id)}><img {...product.image} width={600} height={480} loading="lazy"/></Button>
    </article>)}</div> : <div className="ec-product-grid">{products.map(product => <StorefrontProductCard key={product.id} product={product} onView={onProductView} badge={kind === 'offers' ? badge : undefined}/>)}</div>}</>}
  </section>;
}
