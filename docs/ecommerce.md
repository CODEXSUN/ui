# Ecommerce storefront blocks

Public import: `@workspace/ui/blocks/ecommerce`. UIUX preview and compiled usage: `/blocks/shared-patterns/ecommerce`.

`StorefrontLayout`, `StorefrontHeader`, `StorefrontHero`, `StorefrontCollection`, `StorefrontProductCard`, `StorefrontFeature`, `StorefrontValues`, `StorefrontFooter`, `StorefrontProductDetails` and `StorefrontBag` provide reusable rendering and interaction. The shared stylesheet owns responsive layouts and uses existing semantic tokens. The selected palette (Silver by default) is scoped with existing data attributes; light/dark/system appearance comes from the existing DesignSystemProvider, including portal content. Workspace preferences are not rewritten.

Mount below the existing shared DesignSystemProvider and import the public shared stylesheet once. Supply navigation hrefs, image dimensions/alt text, display prices, category state, search state, product selection and bag callbacks. Dialog and Sheet reuse shared focus trapping, keyboard dismissal and focus restoration. Buttons and inputs reuse the public controls. Reduced-motion disables decorative transitions.

The shared package owns no catalog fixtures, API calls, inventory, prices, totals, orders, authentication, cart persistence or payments. Product details disable the add action without a callback. Bag checkout disables without a callback and always disables in preview mode. Use preview mode for sample products. Apps must validate quantity, availability, price and all transactions server-side before enabling real commerce.

`StorefrontProduct` defines display data. `StorefrontBagLine` carries an app-owned quantity; callbacks report user intent. App-owned URL state should preserve search/category/product selection through direct links and Back/Forward. The Ecommerce example implements these at `/storefront`.

## Expanded storefront sections

StorefrontHeroCarousel composes the existing Carousel primitive. Supply slides and onProductView; optional autoPlayMs controls rotation (0 disables it), and suspended pauses rotation for app-owned overlays. Arrows and direct selectors pause automatic rotation. Pointer interaction, hover/focus, reduced motion, hidden tabs and open shared dialogs stop rotation as applicable. Inactive slides are inert; one persistent h1 labels the collection. StorefrontProductShelf uses the same primitive for a browsable product row.

StorefrontBenefits, StorefrontCategories, StorefrontJournal, StorefrontGuideDetails, StorefrontFaq and StorefrontClosing accept app-owned content/actions. Guide dialogs reuse shared focus return; FAQs reuse the existing Accordion. StorefrontBranding supplies light/dark logo URLs to the header/footer. Footer supports named groups of real links. No fabricated trust claims or external subscriptions are built into these blocks.

Public display contracts live in contracts/ecommerce.ts, exported from @workspace/ui/blocks/ecommerce. The UIUX example includes every new section and its typed usage. Ecommerce owns Codexsun brand files, sample catalog, hero/editorial content and validated local preview-bag persistence. Shared components never access catalog APIs or save business data.

## Customer shopping journey blocks

StorefrontCategoryRail and StorefrontPictureStory support image-led discovery. StorefrontShop owns reusable search/category/sort controls over app-supplied state; apps derive the product result set and URL state. StorefrontProductPage, StorefrontCartPage, StorefrontCheckout, StorefrontReceiptPage and StorefrontTrackingLookup render the full customer journey. StorefrontQuantity is reused by the product page, cart and existing bag block. StorefrontCartLines and StorefrontOrderSummary accept app-formatted line/total labels.

StorefrontDelivery and StorefrontReceipt are display/input contracts exported from contracts/ecommerce.ts. Shared UI does not validate commerce authority, persist contact data, compute authoritative prices, create orders or call payment/carrier APIs. Checkout explicitly renders demo payment without card inputs. Apps own validation, busy/error state, submission, durable services and clear demo/live status. The receipt view never advances shipping states on a timer.

UIUX preview and typed usage: /blocks/shared-patterns/ecommerce-journey. The consuming ecommerce app provides the complete browser-local demo with allowlisted receipt serialization. See its customer-journey-design-review.md for the boundary before live commerce integration.
