import { useEffect, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '../../components/carousel.js';
import type { StorefrontHeroSlide } from '../../../contracts/ecommerce.js';

export function StorefrontHeroCarousel({ slides, onProductView, autoPlayMs = 6500, suspended = false, heading = "Everyday essentials, thoughtfully chosen." }: { slides: readonly StorefrontHeroSlide[]; onProductView: (id: string) => void; autoPlayMs?: number; suspended?: boolean; heading?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!api) return;
    const select = () => setActive(api.selectedScrollSnap());
    const pause = () => setPaused(true);
    select(); api.on('select', select); api.on('reInit', select); api.on('pointerDown', pause);
    return () => { api.off('select', select); api.off('reInit', select); api.off('pointerDown', pause); };
  }, [api]);
  useEffect(() => {
    if (!api || slides.length < 2 || paused || hovered || focused || suspended || reducedMotion || autoPlayMs < 1000) return;
    const timer = window.setInterval(() => { if (!document.hidden && !document.querySelector('[role="dialog"][data-state="open"]')) api.scrollNext(); }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [api, slides.length, autoPlayMs, paused, hovered, focused, suspended, reducedMotion]);
  if (!slides.length) return null;
  return <Carousel setApi={setApi} opts={{ loop: true, duration: reducedMotion ? 0 : 25 }} className="ec-hero-carousel ec-hero" aria-label="Featured products" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <h1 className="sr-only">{heading}</h1>
    <CarouselContent className="ec-carousel-track">{slides.map((slide, index) => <CarouselItem key={slide.id} className="ec-hero-slide" aria-label={`${index + 1} of ${slides.length}: ${slide.title.replace(/\n/g, ' ')}`} aria-hidden={index !== active} inert={index !== active}>
      <div className="ec-container ec-hero-grid"><div className="ec-hero-copy"><p className="ec-eyebrow">{slide.eyebrow}</p><h2>{slide.title}</h2>{slide.description && <p className="ec-hero-description">{slide.description}</p>}
        <div className="ec-hero-actions"><Button asChild variant="default" className="ec-pill"><a href={slide.actionHref}>{slide.actionLabel}<ArrowUpRight size={16}/></a></Button>{slide.detailLabel && <Button type="button" variant="link" onClick={() => onProductView(slide.id)}>{slide.detailLabel}<ArrowUpRight size={15}/></Button>}</div>
      </div><figure className="ec-hero-media"><img {...slide.image} width={slide.image.width ?? 1024} height={slide.image.height ?? 1024} fetchPriority={index === 0 ? 'high' : 'auto'} loading={index === 0 ? 'eager' : 'lazy'}/><figcaption>{slide.caption}</figcaption></figure></div>
    </CarouselItem>)}</CarouselContent>
    {slides.length > 1 && <div className="ec-container ec-carousel-bar"><p aria-live={paused || focused ? 'polite' : 'off'} aria-atomic="true"><span>{String(active + 1).padStart(2, '0')}</span> / {String(slides.length).padStart(2, '0')}</p><div className="ec-carousel-controls"><div className="ec-carousel-dots" role="group" aria-label="Choose featured product">{slides.map((slide, index) => <Button type="button" key={slide.id} variant="ghost" size="icon-sm" aria-label={`Show ${slide.eyebrow}: ${slide.title.replace(/\n/g, " ")}`} aria-pressed={active === index} onClick={() => { api?.scrollTo(index); setPaused(true); }}><span/></Button>)}</div><CarouselPrevious onClick={() => { api?.scrollPrev(); setPaused(true); }}/><CarouselNext onClick={() => { api?.scrollNext(); setPaused(true); }}/>{autoPlayMs >= 1000 && <Button type="button" variant="ghost" size="icon-sm" disabled={reducedMotion} onClick={() => setPaused(value => !value)} aria-label={paused || reducedMotion ? 'Play featured products' : 'Pause featured products'}>{paused || reducedMotion ? <Play/> : <Pause/>}</Button>}</div></div>}
  </Carousel>;
}
