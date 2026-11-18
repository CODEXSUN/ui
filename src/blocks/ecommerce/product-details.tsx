import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/dialog.js';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../components/sheet.js';
import { StorefrontQuantity } from './quantity.js';
import { useStorefrontTheme } from './theme.js';
import { useStorefrontReturnFocus } from './focus.js';
import type { StorefrontProduct, StorefrontBagLine } from '../../../contracts/ecommerce.js';

export function StorefrontProductDetails({ product, onClose, onAdd, preview = false }: { product?: StorefrontProduct; onClose: () => void; onAdd?: (id: string) => void; preview?: boolean }) {
  const theme = useStorefrontTheme();
  const focus = useStorefrontReturnFocus('#storefront-main');
  return <Dialog open={!!product} onOpenChange={open => { if (!open) onClose(); }}><DialogContent {...theme} {...focus} className={`${theme.className} ec-product-dialog`}>
    {product && <><img className="ec-detail-image" {...product.image} width={1024} height={1024}/><div className="ec-detail-copy"><DialogHeader><p className="ec-eyebrow">{preview ? 'SAMPLE COLLECTION' : product.colorLabel}</p><DialogTitle>{product.name}</DialogTitle><DialogDescription>{product.description}</DialogDescription></DialogHeader><p className="ec-detail-price">{product.priceLabel}</p><p className="text-sm text-muted-foreground">{product.colorLabel}</p><ul>{product.highlights.map(item => <li key={item}>{item}</li>)}</ul><Button type="button" variant="default" onClick={() => onAdd?.(product.id)} disabled={!onAdd}>{preview ? 'Add to preview bag' : 'Add to bag'}<Plus size={16}/></Button>{preview && <p className="ec-fine-print">Sample item. No payment or order is created.</p>}</div></>}
  </DialogContent></Dialog>;
}

export function StorefrontBag({ open, onOpenChange, lines, onQuantityChange, totalLabel, preview = false, onCheckout }: {
  open: boolean; onOpenChange: (open: boolean) => void; lines: readonly StorefrontBagLine[];
  onQuantityChange: (id: string, quantity: number) => void; totalLabel: string; preview?: boolean; onCheckout?: () => void;
}) {
  const theme = useStorefrontTheme();
  const focus = useStorefrontReturnFocus('[data-storefront-bag-trigger]');
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent {...theme} {...focus} className={`${theme.className} ec-bag-sheet`}><SheetHeader><SheetTitle>{preview ? 'Your preview bag' : 'Your bag'}</SheetTitle><SheetDescription>{preview ? 'Explore the collection. These sample items are not available to order.' : 'Review your selected items.'}</SheetDescription></SheetHeader>
    <div className="ec-bag-lines">{lines.length ? lines.map(({ product, quantity }) => <article key={product.id} className="ec-bag-line"><img {...product.image} width={100} height={100}/><div><h3>{product.name}</h3><p>{product.priceLabel}</p><StorefrontQuantity name={product.name} value={quantity} onChange={value => onQuantityChange(product.id, value)} onRemove={() => onQuantityChange(product.id, 0)}/></div></article>) : <div className="ec-empty"><ShoppingBag size={32}/><h3>A little room for something good.</h3><p>Your bag is empty. Find an everyday essential you love.</p><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Explore collection</Button></div>}</div>
    {lines.length > 0 && <div className="ec-bag-summary"><div><span>{preview ? 'Sample total' : 'Subtotal'}</span><strong>{totalLabel}</strong></div><Button type="button" variant="default" disabled={preview || !onCheckout} onClick={onCheckout}>{preview ? 'Checkout unavailable in preview' : 'Continue to checkout'}</Button></div>}
  </SheetContent></Sheet>;
}
