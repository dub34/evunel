# Sections removed from Dawn

Dawn sections we decided not to use, what they do, and how to get them back. Check this list before building something new: if a removed Dawn section already does the job, restore it instead of writing it from scratch.

Base: Dawn `v16.0.0`. The decisions come from the section audit in [dawn-architecture.md](dawn-architecture.md).

## How to restore a section

Every file below still exists in the upstream Dawn history.

```sh
git fetch upstream --tags
git checkout v16.0.0 -- sections/video.liquid assets/video-section.css
shopify theme check
```

Then:

1. Restyle it with the UI-kit tokens (Dawn colours, radii and shadows are not used in EVUNEL).
2. Check its translation keys. The `t:sections.<name>.*` keys are still in `locales/*.schema.json` unless they have been pruned since; if so, restore those keys from `v16.0.0` as well.
3. Remove the section from this list and log the restore in [CHANGES-FROM-DAWN.md](../CHANGES-FROM-DAWN.md).

## Status

| Status | Meaning |
| --- | --- |
| **Removed** | Deleted from the theme. |
| **Scheduled** | Still in the theme because other sections depend on it. It is removed in the plan task that reworks those sections. |

## Content sections

### Slideshow — `sections/slideshow.liquid`

**Status:** Removed.
**What it does:** A full-width or page-width carousel of image slides, each with a heading, subheading, button and colour scheme. Supports auto-rotation, slide height (adapt to image, small, medium, large), pagination style and showing text below the image on mobile.
**Settings:** `layout`, `slide_height`, `slider_visual`, `auto_rotate`, `change_slides_speed`, `image_behavior`, `show_text_below`, `accessibility_info`.
**Blocks:** `slide` (image, heading, subheading, button, text position and alignment, colour scheme).
**Files to restore:** `sections/slideshow.liquid`. Its CSS (`component-slideshow.css`, `component-slider.css`, `section-image-banner.css`) and the `slideshow-component` element in `global.js` are kept because the announcement bar and image banner use them.
**Why removed:** The prototype has a static editorial hero, not a carousel.

### Collage — `sections/collage.liquid`

**Status:** Removed.
**What it does:** A grid of two or three mixed tiles under a heading: an image, a product card, a collection card or a video that opens in a modal. Separate desktop and mobile layouts.
**Settings:** `heading`, `heading_size`, `desktop_layout`, `mobile_layout`, `card_styles`, `color_scheme`, `padding_top`, `padding_bottom`.
**Blocks:** `image`, `product`, `collection`, `video`.
**Files to restore:** `sections/collage.liquid`, `assets/collage.css`, `assets/component-modal-video.css`.
**Why removed:** Not in the prototype. Note: the blog's "collage" layout option in `main-blog` is a different thing and is not affected.

### Multirow — `sections/multirow.liquid`

**Status:** Removed.
**What it does:** A stack of image-and-text rows, alternating left and right, each with a caption, heading, text and button.
**Settings:** `image_height`, `desktop_image_width`, `image_layout`, `heading_size`, `text_style`, `button_style`, `desktop_content_position`, `desktop_content_alignment`, `mobile_content_alignment`, `section_color_scheme`, `row_color_scheme`, `padding_top`, `padding_bottom`.
**Blocks:** `row` (image, caption, heading, text, button).
**Files to restore:** `sections/multirow.liquid`. Its styles live in `component-image-with-text.css` (kept).
**Why removed:** Several `image-with-text` sections cover the same layouts.

### Video — `sections/video.liquid`

**Status:** Removed.
**What it does:** One video, either uploaded to Shopify or from YouTube/Vimeo, with a cover image, heading, description, optional looping and full-width mode. The video loads only after the visitor presses play.
**Settings:** `heading`, `heading_size`, `enable_video_looping`, `video`, `video_url`, `cover_image`, `description`, `full_width`, `color_scheme`, `padding_top`, `padding_bottom`.
**Blocks:** None.
**Files to restore:** `sections/video.liquid`, `assets/video-section.css`. It also uses `component-deferred-media.css` (kept for product media).
**Why removed:** Not in the prototype. Restore it if the client wants a brand film on the home or About page. Product videos are unaffected; they are part of the product media gallery.

### Featured product — `sections/featured-product.liquid`

**Status:** Removed.
**What it does:** The full purchase block of one chosen product (media gallery, title, price, variant picker, quantity, buy buttons, share and more) placed on any page.
**Settings:** `product`, `color_scheme`, `secondary_background`, `media_size`, `constrain_to_viewport`, `media_fit`, `media_position`, `image_zoom`, `hide_variants`, `enable_video_looping`, `padding_top`, `padding_bottom`.
**Blocks:** `@app`, `text`, `title`, `price`, `sku`, `quantity_selector`, `variant_picker`, `buy_buttons`, `share`, `custom_liquid`, `disclosures`, `rating`, `icon-with-text`.
**Files to restore:** `sections/featured-product.liquid`, `assets/section-featured-product.css`. Its JavaScript (`product-info.js`, `product-form.js`, `media-gallery.js` and others) is shared with the product page and kept.
**Why removed:** Not in the prototype, and it duplicates the product page logic we rework heavily. If a "product of the month" block is needed, restore it after the product page rework so it picks up the EVUNEL purchase panel.

## Commerce sections

### Pickup availability — `sections/pickup-availability.liquid`

**Status:** Scheduled for task 7.1 (product page purchase panel).
**What it does:** Shows whether the selected variant can be picked up in a physical location and opens a drawer with the list of locations. It is loaded through the Section Rendering API by the `<pickup-availability>` element inside the buy buttons.
**Settings and blocks:** None (rendering target only).
**Files involved:** `sections/pickup-availability.liquid`, `assets/pickup-availability.js`, `assets/component-pickup-availability.css`, plus code in `snippets/buy-buttons.liquid`, `assets/product-info.js` and `assets/quick-add.js`.
**Why removed:** EVUNEL has no local pickup; every order ships from the Polish 3PL.

### Quick order list — `sections/quick-order-list.liquid`, `sections/bulk-quick-order-list.liquid`

**Status:** Scheduled for task 4.2 (quick add on product cards).
**What it does:** A table of all variants of a product with quantity inputs, so a buyer can add many variants at once (B2B ordering). The bulk version is a modal opened from a product card when the card's quick add type is "bulk".
**Settings:** `variants_per_page`, `show_image`, `show_sku`, `color_scheme`, `padding_top`, `padding_bottom`.
**Blocks:** None.
**Files involved:** both sections, `snippets/quick-order-list.liquid`, `snippets/quick-order-list-row.liquid`, `snippets/quick-order-product-row.liquid` (already unused in Dawn), `assets/quick-order-list.js`, `assets/quick-order-list.css`, `assets/quick-add-bulk.js`, plus the "bulk" quick add option in `snippets/card-product.liquid`, `sections/featured-collection.liquid` and `sections/main-collection-product-grid.liquid`.
**Why removed:** Wholesale ordering is out of scope. EVUNEL quick add uses the standard mode only.

### Cart notification — `sections/cart-notification-button.liquid`, `sections/cart-notification-product.liquid`

**Status:** Scheduled for task 4.3 (cart drawer), together with fixing the cart type to "drawer" in phase 2.
**What it does:** A small popup under the header that confirms an item was added, used when the theme setting `cart_type` is "notification". The two sections are Section Rendering targets for the popup's button and product line.
**Settings and blocks:** None (rendering targets only).
**Files involved:** both sections, `snippets/cart-notification.liquid`, `assets/cart-notification.js`, `assets/component-cart-notification.css`, plus code in `sections/header.liquid` and the `cart_type` setting in `config/settings_schema.json`.
**Why removed:** EVUNEL always uses the cart drawer (CART-01).
