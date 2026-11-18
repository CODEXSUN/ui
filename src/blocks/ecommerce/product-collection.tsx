import { ArrowUpRight, SearchX } from 'lucide-react';
import { Button } from '../../components/button.js';
import type { StorefrontCategory, StorefrontProduct } from '../../../contracts/ecommerce.js';

export function StorefrontProductCard({ product, onView, badge }: { product: StorefrontProduct; onView: (id: string) => void; badge?: string }) {
  return <article className="ec-product-card ec-bordered-card"><Button type="button" variant="ghost" className="ec-product-image" onClick={() => onView(product.id)} aria-label={`Explore ${product.name}`}>
    <img {...product.image} width={product.image.width ?? 1024} height={product.image.height ?? 1024} loading="lazy"/>
  </Button>{badge && <span className="ec-card-badge">{badge}</span>}<div className="ec-product-copy"><div><p className="ec-product-color">{product.colorLabel}{product.category && product.colorLabel !== product.category ? ' · ' + product.category : ''}</p><h3><Button type="button" variant="link" onClick={() => onView(product.id)}>{product.name}</Button></h3><p className="ec-card-summary">{product.tagline}</p>{product.availabilityLabel && product.availabilityLabel !== 'Availability on request' && <p className="ec-availability">{product.availabilityLabel}</p>}</div></div><div className="ec-card-footer"><strong className="ec-product-price">{product.priceLabel}</strong><Button type="button" variant="outline" size="icon-sm" aria-label={`View ${product.name}`} onClick={() => onView(product.id)}><ArrowUpRight size={16}/></Button></div></article>;
}

export function StorefrontCollection({ title, description, categories, category, onCategoryChange, products, onProductView, search, onClearSearch, notice, id = "collection" }: {
  id?: string; title: string; description: string; categories: readonly StorefrontCategory[]; category: string; onCategoryChange: (id: string) => void;
  products: readonly StorefrontProduct[]; onProductView: (id: string) => void; search?: string; onClearSearch?: () => void; notice?: string;
}) {
  return <section id={id} tabIndex={-1} className="ec-collection ec-container" aria-labelledby={id + "-title"}><div className="ec-section-heading"><div><h2 id={id + "-title"}>{title}</h2>{description && <p>{description}</p>}</div><span className="ec-collection-count" role="status">{products.length} {products.length === 1 ? 'essential' : 'essentials'}</span></div>
    <div className="ec-filter-row"><div className="ec-filters" role="group" aria-label="Filter collection">{categories.map(item => <Button key={item.id} type="button" variant={item.id === category ? 'default' : 'ghost'} className="ec-filter" aria-pressed={item.id === category} onClick={() => onCategoryChange(item.id)}>{item.label}</Button>)}</div>{search && <Button type="button" variant="link" onClick={onClearSearch}>Clear “{search}”</Button>}</div>
    {products.length ? <div className="ec-product-grid">{products.map(product => <StorefrontProductCard key={product.id} product={product} onView={onProductView}/>)}</div> : <div className="ec-empty"><SearchX size={30} aria-hidden="true"/><h3>No essentials found.</h3><p>Try another search or explore a different collection.</p>{onClearSearch && <Button type="button" variant="outline" onClick={onClearSearch}>Reset collection</Button>}</div>}
    {notice && <p className="ec-catalog-notice">{notice}</p>}
  </section>;
}
