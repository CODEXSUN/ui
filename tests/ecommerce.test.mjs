import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StorefrontLayout, StorefrontCollection, StorefrontProductCard, StorefrontHero } from '@workspace/ui/blocks/ecommerce';

const product = { id: 'sample', name: '<Sample headphones>', category: 'audio', tagline: 'Sample only', description: 'No inventory', priceLabel: '$0', colorLabel: 'Ivory', image: { src: '/sample.jpg', alt: 'Ivory headphones' }, highlights: [] };
test('product card escapes catalog content and exposes an accessible, named action', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontProductCard, { product, onView() {} }));
  assert.match(html, /Explore &lt;Sample headphones&gt;/);
  assert.match(html, /alt="Ivory headphones"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /\$0/);
  assert.doesNotMatch(html, /<Sample headphones>/);
});
test('empty filtered collection retains category state and offers recovery', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontCollection, { title: 'Collection', description: 'Sample', products: [], categories: [{ id: 'all', label: 'All' }, { id: 'audio', label: 'Audio' }], category: 'audio', onCategoryChange() {}, onProductView() {}, search: 'missing', onClearSearch() {}, notice: 'Sample catalog' }));
  assert.match(html, /aria-pressed="true"[^>]*>Audio/);
  assert.match(html, /No essentials found/);
  assert.match(html, /Reset collection/);
  assert.match(html, /Sample catalog/);
});
test('storefront inherits selected shared tokens and provides a priority hero with a real link', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontLayout, null, React.createElement(StorefrontHero, { title: 'Everyday', eyebrow: 'Collection', description: 'Sample', image: product.image, primaryAction: { href: '#collection', label: 'Explore collection' } })));
  assert.match(html, /data-design-variant="silver"/);
  assert.match(html, /href="#collection"/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(html, /<h1 id="storefront-title">Everyday/);
});
import { StorefrontHeroCarousel, StorefrontFooter, StorefrontFaq } from '@workspace/ui/blocks/ecommerce';
import { StorefrontMerchandisingSection } from '@workspace/ui/blocks/ecommerce';
test('merchandising uses escaped offer copy, accessible carousel controls and no fake savings', () => {
  const props = { id: 'edit', title: 'The edit', badge: '<Offer>', products: [product, { ...product, id: 'second' }], onProductView() {} };
  const offers = renderToStaticMarkup(React.createElement(StorefrontMerchandisingSection, { ...props, kind: 'offers' }));
  assert.match(offers, /&lt;Offer&gt;/); assert.doesNotMatch(offers, /<Offer>|% off|<del/);
  const carousel = renderToStaticMarkup(React.createElement(StorefrontMerchandisingSection, { ...props, kind: 'carousel' }));
  assert.match(carousel, /Previous slide/); assert.match(carousel, /Next slide/); assert.match(carousel, /aria-roledescription="carousel"/);
  const empty = renderToStaticMarkup(React.createElement(StorefrontMerchandisingSection, { ...props, products: [], kind: 'products' }));
  assert.equal(empty, '');
});
test('presentation carries app-supplied columns and card choices without changing theme ownership', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontLayout, { presentation: { columns: 6, cardVariant: 'compact', spacing: 'airy' } }, React.createElement(StorefrontProductCard, { product, onView() {} })));
  assert.match(html, /--ec-columns:6/); assert.match(html, /data-card-variant="compact"/); assert.match(html, /data-spacing="airy"/); assert.match(html, /ec-bordered-card/);
});

test('hero carousel keeps inactive slides inert and exposes manual rotation controls', () => {
  const slide = { id: 'one', eyebrow: 'Sample', title: 'Quiet everyday', description: 'Sample only', image: product.image, actionLabel: 'Explore', actionHref: '#collection' };
  const html = renderToStaticMarkup(React.createElement(StorefrontHeroCarousel, { slides: [slide, { ...slide, id: 'two', title: 'Another everyday' }], onProductView() {} }));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /aria-roledescription="carousel"/);
  assert.match(html, /aria-hidden="true" inert=""/);
  assert.match(html, /Previous slide/);
  assert.match(html, /Next slide/);
  assert.match(html, /Choose featured product/);
});
test('footer exposes real grouped links and original logo slots without trademark claims', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontFooter, { brand: 'Codexsun', logoSrc: '/brand.svg', logoDarkSrc: '/brand-dark.svg', description: 'Sample', note: 'No orders', groups: [{ title: 'Discover', links: [{ label: 'Journal', href: '#journal' }] }] }));
  assert.match(html, /Codexsun home/);
  assert.match(html, /src="\/brand-dark.svg"/);
  assert.match(html, /href="#journal"/);
  assert.doesNotMatch(html, /®/);
});
import { StorefrontCartPage, StorefrontCheckout, StorefrontReceiptPage } from '@workspace/ui/blocks/ecommerce';
import { StorefrontProductPage } from '@workspace/ui/blocks/ecommerce';

test('availability displays on cards and a stock limit disables cart quantity increases', () => {
  const stocked = { ...product, availabilityLabel: 'In stock', maxQuantity: 3 };
  const card = renderToStaticMarkup(React.createElement(StorefrontProductCard, { product: stocked, onView() {} }));
  assert.match(card, /In stock/);
  const cart = renderToStaticMarkup(React.createElement(StorefrontCartPage, { lines: [{ product: stocked, quantity: 3 }], totalLabel: '$0', onQuantityChange() {} }));
  assert.match(cart, /aria-label="Increase [^"]+ quantity" disabled=""/);
});

test('unavailable products cannot be added and related products have an app-owned heading', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontProductPage, { product, purchaseAvailable: false, unavailableLabel: 'Out of stock', relatedTitle: 'Similar products', related: [{ ...product, id: 'another' }], onAdd() {}, onProductView() {} }));
  assert.match(html, /Out of stock/); assert.match(html, /Similar products/);
  assert.doesNotMatch(html, /Add to bag/); assert.doesNotMatch(html, /Increase [^"]+ quantity/);
});

test('empty cart offers a shopping route and cannot continue to checkout', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontCartPage, { lines: [], totalLabel: '$0', onQuantityChange() {} }));
  assert.match(html, /href="\/shop"/); assert.doesNotMatch(html, /href="\/checkout"/);
});
test('checkout links delivery errors to fields and requests no payment secrets', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontCheckout, { lines: [{ product, quantity: 1 }], totalLabel: '$0', values: { name: '', email: '', address: '', city: '', postalCode: '', country: '' }, errors: { email: 'Enter a valid email.' }, onChange() {}, onSubmit() {} }));
  assert.match(html, /checkout-email-error/); assert.match(html, /aria-invalid="true"/); assert.match(html, /Place demo order/); assert.match(html, /No payment will be taken/); assert.doesNotMatch(html, /name="(?:card|cvv|password)"/);
});
test('receipt clearly separates a local demo order from unstarted shipping stages', () => {
  const html = renderToStaticMarkup(React.createElement(StorefrontReceiptPage, { confirmation: true, order: { id: 'DEMO-ABCD1234', dateLabel: '17 November 2026', lines: [{ product, quantity: 2, lineTotalLabel: '$0' }], totalLabel: '$0', status: 'Order received' } }));
  assert.match(html, /No payment was taken/); assert.equal((html.match(/Not started/g) ?? []).length, 3); assert.match(html, /track-order\?order=DEMO-ABCD1234/); assert.match(html, /aria-current="step"/);
});
