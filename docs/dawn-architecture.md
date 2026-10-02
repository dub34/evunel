# Dawn 16 architecture and section audit

Notes for the EVUNEL team on how Dawn `v16.0.0` is built and what we keep, rework or remove. Plan tasks 0.4 and 0.5.

## 1. How a page is assembled

```
layout/theme.liquid
├── <head>: meta-tags snippet, global JS (deferred), {% style %} block with CSS custom properties, base.css
├── {% sections 'header-group' %}   → announcement-bar, header
├── {{ content_for_layout }}        → the template: templates/<type>.json → list of sections
├── {% sections 'footer-group' %}   → footer
└── cart drawer (when cart_type is "drawer")
```

| Layer | Where | What it is |
| --- | --- | --- |
| Layout | `layout/theme.liquid`, `layout/password.liquid` | Page shell. Global CSS variables are generated here from theme settings. |
| Templates | `templates/*.json` | Which sections a page type shows and their settings. Edited in the theme editor; Shopify writes editor changes back to these files. `gift_card.liquid` is the only Liquid template. |
| Section groups | `sections/header-group.json`, `sections/footer-group.json` | Sections shared by every page. |
| Sections | `sections/*.liquid` | Markup + `{% schema %}` (settings, blocks, presets). A section with `presets` can be added in the editor; `enabled_on` limits where. |
| Blocks | Inside each section schema | Dawn 16 does not use theme blocks (no `blocks/` folder). |
| Snippets | `snippets/*.liquid` | Partials rendered with `{% render %}`; isolated scope, so every value is passed in. |
| Assets | `assets/` | One CSS file per component (loaded by the section that needs it) and one JS file per feature. No build step. |
| Settings | `config/settings_schema.json`, `config/settings_data.json` | Global settings definition and their values. `settings_data.json` is owned by the editor. |
| Locales | `locales/*.json`, `locales/*.schema.json` | Storefront strings and editor labels (`t:` keys). |

## 2. JavaScript model

- No framework. Each interactive part is a custom element (`header-menu`, `menu-drawer`, `cart-drawer`, `cart-items`, `facet-filters-form`, `predictive-search`, `variant-selects`, `quantity-input`, `product-recommendations` and others).
- `assets/pubsub.js` is a small event bus. Events (`assets/constants.js`): `cart-update`, `quantity-update`, `option-value-selection-change`, `variant-change`, `cart-error`.
- HTML is rendered on the server. When something changes (cart, filters, variant), the JS fetches fresh HTML for the affected sections through the Section Rendering API (`?sections=…` / `?section_id=…`) and swaps it in. `cart.js`, `facets.js`, `product-info.js` and `predictive-search.js` all work this way.

**Rule for new EVUNEL features:** follow the same model. One custom element per component, server-rendered markup, a deferred script loaded only by the section that uses it, and `pubsub` events for anything that touches the cart.

## 3. CSS model

- `base.css` (81 KB) holds global styles; components add their own files such as `component-card.css` and `component-facets.css`.
- The root font size is `62.5%`, so **`1rem` = 10 px**, scaled by `--font-body-scale`. Dawn uses `rem` about 2,000 times. We keep this base and express UI-kit tokens in it (body 15 px → `1.5rem`) instead of changing the root size.
- Colours are RGB triplets (`--color-foreground: 40,39,39`) used as `rgb(var(--color-foreground))` or with opacity: `rgba(var(--color-foreground), 0.5)`. There are 212 opacity uses; many are text at `0.5`–`0.75`, which fails WCAG AA on ivory. Text colours move to the UI-kit tokens (`--ev-text-muted`, `--ev-text-subtle`). Low-opacity uses for lines and fills (`0.04`–`0.2`) can stay.
- Every radius, border and shadow comes from a theme setting (242 radius references, 442 shadow references). EVUNEL uses square corners, fine lines and no shadows, so these settings go and the variables are fixed in `css-variables`.

## 4. Findings that change the plan

| Finding | Impact |
| --- | --- |
| Dawn 16 removed the legacy customer account templates. | New Shopify customer accounts are required, not optional. |
| There is no Ukrainian storefront locale (`uk.json`). Polish, Czech, Slovak, German, French, Dutch and Italian exist. | Add `locales/uk.json` for evunel.com.ua (phase 10). |
| The mega menu is a `<details>` element that opens on click only. | Hover with a close delay is new work (task 3.2, NAV-01). |
| The product card prints the vendor as plain text. | Make it a link to the brand page (task 4.1, BRD-01). |
| `main-product` already supports `collapsible_tab` blocks with dynamic sources, and Shopify product disclosures (`product.metafields.shopify.disclosure`). | Use disclosures for regulatory warnings; build only the list-based blocks (active ingredients, nutrition) as new (task 7.3). |
| Cart type is a setting (`drawer`, `page`, `notification`). | Fix it to `drawer` and remove the notification variant. |
| Dawn ships about 130 global settings; about 85 of them style borders, radii and shadows. | Remove those groups in phase 2. |

## 5. Section audit

Decision key: **Keep** — use as is or with light restyling; **Rework** — keep the logic, change markup and styles substantially; **Remove** — delete with its CSS, JS and snippets.

### Shell and shared

| Section | Lines | Decision | EVUNEL use / plan task |
| --- | ---: | --- | --- |
| `announcement-bar` | 263 | Rework | Forest bar with market selector (3.1) |
| `header` | 688 | Rework | Mega menu with hover, mobile drawer (3.2, 3.3) |
| `footer` | 546 | Rework | Menus, newsletter, socials, Brands A–Z (3.5) |
| `cart-drawer` | 2 | Keep | Section Rendering target for the drawer |
| `cart-icon-bubble` | 16 | Keep | Bag count in the header |
| `cart-live-region-text` | 2 | Keep | Screen reader announcements |
| `cart-notification-button`, `cart-notification-product` | 62 | Remove | Notification cart is not used |
| `predictive-search` | 269 | Rework | Brands in results, focus on open (4.6) |
| `apps` | 32 | Keep | Slot for app blocks (reviews, wishlist app if chosen) |
| `custom-liquid` | 70 | Keep | Escape hatch for one-off embeds |

### Home and content

| Section | Lines | Decision | EVUNEL use / plan task |
| --- | ---: | --- | --- |
| `image-banner` | 508 | Rework | Editorial hero (5.1) |
| `multicolumn` | 456 | Rework | Values strip (5.1) |
| `collection-list` | 309 | Rework | Two worlds: Beauty outside, Wellbeing within (5.1) |
| `featured-collection` | 530 | Rework | Product edit (5.1) |
| `image-with-text` | 488 | Rework | Ritual feature, philosophy blocks (5.2) |
| `rich-text` | 356 | Keep | Philosophy statement, About copy |
| `featured-blog` | 330 | Rework | Journal teaser (5.2) |
| `newsletter` | 255 | Rework | Newsletter (5.3) |
| `collapsible-content` | 518 | Rework | FAQ on Help (5.6) |
| `contact-form` | 219 | Rework | Help contact form (5.6) |
| `main-page`, `page` | 177 | Keep | Generic pages |
| `main-blog`, `main-article` | 519 | Rework | Journal index and article (5.5) |
| `main-404` | 24 | Rework | 404 (5.8) |
| `main-password-header`, `main-password-footer`, `email-signup-banner` | 659 | Keep | Password page before launch (5.8) |
| `slideshow` | 592 | Remove | Not in the prototype |
| `collage` | 433 | Remove | Not in the prototype |
| `multirow` | 416 | Remove | Covered by `image-with-text` |
| `video` | 256 | Remove | Not in the prototype; restore from upstream if needed |
| `featured-product` | 1566 | Remove | Not in the prototype; duplicates product page logic |

### Catalogue, product and cart

| Section | Lines | Decision | EVUNEL use / plan task |
| --- | ---: | --- | --- |
| `main-collection-banner` | 78 | Rework | Collection intro (6.1) |
| `main-collection-product-grid` | 417 | Rework | Grid, facets, sort, world tabs (6.1–6.4) |
| `main-search` | 531 | Rework | Search results page (6.5) |
| `main-list-collections` | 141 | Keep | `/collections` route; low priority |
| `main-product` | 2327 | Rework | Purchase panel, accordions, category blocks (7.1–7.4) |
| `related-products` | 257 | Rework | Recommendations (7.5) |
| `disclosures` | 114 | Keep | Shopify product disclosures for warnings (7.2) |
| `pickup-availability` | 109 | Remove | No local pickup; orders ship from the 3PL |
| `quick-order-list`, `bulk-quick-order-list` | 112 | Remove | B2B bulk ordering, not in scope |
| `main-cart-items`, `main-cart-footer` | 697 | Rework | Cart page, threshold, gift option (4.3–4.5) |

**Summary:** 46 sections → 36 kept or reworked, 10 removed.

### Snippets to remove with those sections

`cart-notification`, `quick-order-list`, `quick-order-list-row`, `quick-order-product-row` (already orphaned), and `header-dropdown-menu` once the desktop menu type is fixed to mega. Matching assets: `cart-notification.js`, `component-cart-notification.css`, `quick-order-list.js`, `quick-order-list.css`, `quick-add-bulk.js`, `pickup-availability.js`, `component-pickup-availability.css`, `collage.css`, `component-slideshow.css`, `video-section.css`, `section-featured-product.css`. Each removal is checked with `shopify theme check` for broken references.

## 6. What Dawn does not have

| Feature | Plan task |
| --- | --- |
| Brands A–Z page and brand profile (`templates/metaobject/brand.json`) | 8.1, 8.2 |
| Five product templates with category blocks | 7.3, 7.4 |
| World tabs and per-world filter sets on collections | 6.2, 6.3 |
| Free delivery threshold bar and gift option in the cart | 4.4, 4.5 |
| Wishlist | 4.7 |
| Local market suggestion without forced redirect | 3.4 |
| Policy and information page with sticky table of contents | 5.7 |
| Ukrainian storefront locale | 10.1 |

## 7. Settings audit (`config/settings_schema.json`)

| Group | Decision |
| --- | --- |
| Logo, favicon | Keep |
| Colors (`color_schemes`) | Keep; redefine as Ivory, Forest, Oxblood, Graphite |
| Typography (`font_picker` × 2, scales) | Replace with EVUNEL fonts loaded through `@font-face`; remove the scale sliders |
| Layout (page width, spacing) | Keep page width; fix spacing to the UI-kit scale |
| Animations | Keep reveal on scroll; respect `prefers-reduced-motion` |
| Buttons, variant pills, inputs, cards, collection cards, blog cards, content containers, media, popups, drawers, badges | Remove; values are fixed by the UI-kit |
| Brand information, social media | Keep |
| Search input | Keep; show vendor on |
| Currency format | Keep |
| Cart | Fix `cart_type` to drawer; keep vendor, note and colour scheme settings; add free delivery threshold |
| Customer accounts | Keep |

## 8. Next steps

1. Review the audit above.
2. Remove the ten sections, their snippets and assets in one commit, and update `CHANGES-FROM-DAWN.md`.
3. Start phase 2: tokens, fonts, colour schemes and settings cleanup.
