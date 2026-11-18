export type StorefrontImage = { src: string; alt: string; width?: number; height?: number };
export type StorefrontCategory = { id: string; label: string };
export type StorefrontPresentation = { columns: 3 | 4 | 5 | 6; cardVariant: 'classic' | 'compact' | 'editorial'; spacing: 'comfortable' | 'airy' };
/** Display data only. Catalog, pricing, availability and transactions stay app-owned. */
export type StorefrontProduct = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  priceLabel: string;
  availabilityLabel?: string;
  maxQuantity?: number;
  image: StorefrontImage;
  colorLabel: string;
  highlights: readonly string[];
};
export type StorefrontBagLine = { product: StorefrontProduct; quantity: number; lineTotalLabel?: string };
export type StorefrontBranding = { logoSrc?: string; logoDarkSrc?: string };
export type StorefrontHeroSlide = {
  id: string; eyebrow: string; title: string; description: string; image: StorefrontImage;
  actionLabel: string; actionHref: string; detailLabel?: string; caption?: string;
};
export type StorefrontGuide = { id: string; category: string; title: string; summary: string; image: StorefrontImage; paragraphs: readonly string[] };
export type StorefrontDelivery = { name: string; email: string; address: string; city: string; postalCode: string; country: string };
export type StorefrontReceipt = { id: string; dateLabel: string; lines: readonly StorefrontBagLine[]; totalLabel: string; status: string };
