import { Asterisk } from 'lucide-react';
import type { StorefrontBranding } from '../../../contracts/ecommerce.js';

export function StorefrontBrand({ brand, href, logoSrc, logoDarkSrc }: StorefrontBranding & { brand: string; href: string }) {
  return <a href={href} className="ec-wordmark" aria-label={`${brand} home`}>
    {logoSrc ? <><img src={logoSrc} alt="" width={32} height={32} className="ec-logo-light"/>{logoDarkSrc && <img src={logoDarkSrc} alt="" width={32} height={32} className="ec-logo-dark"/>}</> : <Asterisk size={24} strokeWidth={1.8} aria-hidden="true"/>}
    <span>{brand}</span>
  </a>;
}
