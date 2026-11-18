import { ArrowUpRight, ArrowRight, Check, Compass, Sparkles } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../../components/carousel.js';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/accordion.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/dialog.js';
import { StorefrontProductCard } from './product-collection.js';
import { useStorefrontTheme } from './theme.js';
import { useStorefrontReturnFocus } from './focus.js';
import type { StorefrontImage, StorefrontProduct, StorefrontGuide } from '../../../contracts/ecommerce.js';

export function StorefrontBenefits({ items }: { items: readonly { title: string; description: string }[] }) {
  const icons = [Compass, Sparkles, Check];
  return <section className="ec-benefits" aria-label="The considered collection"><div className="ec-container">{items.map((item, index) => { const Icon = icons[index % icons.length]; return <div key={item.title}><Icon size={19} strokeWidth={1.4} aria-hidden="true"/><div><h2>{item.title}</h2><p>{item.description}</p></div></div>; })}</div></section>;
}

export function StorefrontCategories({ items }: { items: readonly { id: string; title: string; subtitle: string; image: StorefrontImage; href: string }[] }) {
  return <section id="collections" className="ec-container ec-category-section" aria-labelledby="collections-title"><div className="ec-section-heading"><div><p className="ec-eyebrow">FIND YOUR EVERYDAY</p><h2 id="collections-title">A place for every part of you.</h2></div><a className="ec-text-link" href="#collection">Explore everything<ArrowUpRight size={16}/></a></div><div className="ec-category-grid">{items.map(item => <a key={item.id} className="ec-category-card" href={item.href}><img {...item.image} width={600} height={600} loading="lazy"/><div><span>{item.subtitle}</span><h3>{item.title}<ArrowUpRight size={22}/></h3></div></a>)}</div></section>;
}

export function StorefrontProductShelf({ title, description, products, onProductView }: { title: string; description: string; products: readonly StorefrontProduct[]; onProductView: (id: string) => void }) {
  return <section className="ec-container ec-product-shelf" aria-label={title}><Carousel opts={{ align: 'start' }}><div className="ec-section-heading"><div><p className="ec-eyebrow">THE CONSIDERED EDIT</p><h2>{title}</h2><p>{description}</p></div><div className="ec-carousel-controls"><CarouselPrevious/><CarouselNext/></div></div><CarouselContent className="ec-shelf-track">{products.map(product => <CarouselItem key={product.id} className="ec-shelf-item"><StorefrontProductCard product={product} onView={onProductView}/></CarouselItem>)}</CarouselContent></Carousel></section>;
}

export function StorefrontJournal({ items, onRead }: { items: readonly StorefrontGuide[]; onRead: (id: string) => void }) {
  return <section id="journal" tabIndex={-1} className="ec-container ec-journal" aria-labelledby="journal-title"><div className="ec-section-heading"><div><p className="ec-eyebrow">THE EVERYDAY JOURNAL</p><h2 id="journal-title">Good things to know.</h2><p>A little perspective. A better everyday.</p></div></div><div className="ec-journal-grid">{items.map(item => <article key={item.id}><Button type="button" variant="ghost" className="ec-journal-image" onClick={() => onRead(item.id)} aria-label={`Read ${item.title}`}><img {...item.image} width={600} height={450} loading="lazy"/></Button><p className="ec-eyebrow">{item.category}</p><h3><Button type="button" variant="link" onClick={() => onRead(item.id)}>{item.title}<ArrowUpRight size={17}/></Button></h3><p>{item.summary}</p></article>)}</div></section>;
}

export function StorefrontGuideDetails({ guide, onClose }: { guide?: StorefrontGuide; onClose: () => void }) {
  const theme = useStorefrontTheme(); const focus = useStorefrontReturnFocus('#journal');
  return <Dialog open={!!guide} onOpenChange={open => { if (!open) onClose(); }}><DialogContent {...theme} {...focus} className={`${theme.className} ec-guide-dialog`}>{guide && <><DialogHeader><p className="ec-eyebrow">{guide.category}</p><DialogTitle>{guide.title}</DialogTitle><DialogDescription>{guide.summary}</DialogDescription></DialogHeader><img {...guide.image} width={800} height={500}/><div>{guide.paragraphs.map(text => <p key={text}>{text}</p>)}</div></>}</DialogContent></Dialog>;
}

export function StorefrontFaq({ items }: { items: readonly { question: string; answer: string }[] }) {
  return <section id="help" className="ec-container ec-faq" aria-labelledby="faq-title"><div><p className="ec-eyebrow">A LITTLE CLARITY</p><h2 id="faq-title">Before you explore.</h2><p>Good questions deserve simple answers.</p></div><Accordion type="single" collapsible>{items.map((item, index) => <AccordionItem key={item.question} value={String(index)}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent>{item.answer}</AccordionContent></AccordionItem>)}</Accordion></section>;
}

export function StorefrontClosing({ title, description, action }: { title: string; description: string; action: { label: string; href: string } }) {
  return <section className="ec-closing"><div className="ec-container"><p className="ec-eyebrow">A LITTLE LESS. A LITTLE BETTER.</p><h2>{title}</h2><p>{description}</p><Button asChild variant="default" className="ec-pill"><a href={action.href}>{action.label}<ArrowRight size={16}/></a></Button></div></section>;
}
