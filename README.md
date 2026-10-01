# EVUNEL Shopify theme

Online Store 2.0 theme for EVUNEL, a premium store for beauty outside and wellbeing within.

The theme is a fork of Shopify's [Dawn](https://github.com/Shopify/dawn) theme, restyled and extended to match the approved EVUNEL prototype and UI-kit. Dawn provides the commerce logic (cart, facets, predictive search, localization, accessibility); the EVUNEL layer replaces Dawn's visual design and adds the features Dawn does not have (brand directory, category product templates, wishlist and more).

## Status

Stage 1: theme development. Integrations (Zoho One, Microsoft Dynamics), the OpenCart migration and Markets configuration are out of scope for this stage.

## Based on Dawn

| | |
| --- | --- |
| Upstream | https://github.com/Shopify/dawn |
| Forked from | `v16.0.0` (commit `bc39a7d2`) |
| Change log against Dawn | [CHANGES-FROM-DAWN.md](CHANGES-FROM-DAWN.md) |

Dawn 16 supports only the new Shopify customer accounts. The legacy customer account templates are removed, so the store must use new customer accounts.

### Fork rules

1. **Dawn is a starting point, not a dependency.** After the fork the code is ours. We do not merge Dawn releases wholesale; we port security fixes and relevant bug fixes by hand.
2. **Replace Dawn styles, do not override them.** Typography, colour, spacing, radii and shadows come from the EVUNEL UI-kit tokens. Do not stack EVUNEL CSS on top of Dawn CSS.
3. **Delete what we do not use.** Unused Dawn sections, snippets and settings are removed rather than hidden.
4. **Log every structural change** in [CHANGES-FROM-DAWN.md](CHANGES-FROM-DAWN.md), so future Dawn fixes can be ported with confidence.

## Getting started

Requirements: Node.js 20+, Git, and access to the EVUNEL development store.

1. Install [Shopify CLI](https://shopify.dev/docs/api/shopify-cli):

   ```sh
   npm install -g @shopify/cli@latest
   ```

2. Clone the repository:

   ```sh
   git clone git@github.com:dub34/evunel.git
   cd evunel
   git remote add upstream https://github.com/Shopify/dawn.git
   git remote set-url --push upstream no-push
   ```

3. Start the local development server against the development store:

   ```sh
   shopify theme dev --store <store-name>.myshopify.com
   ```

   The CLI uploads the theme as a temporary development theme and serves a hot-reloading preview at `http://127.0.0.1:9292`.

4. Lint before you push:

   ```sh
   shopify theme check
   ```

## Branches and deployment

| Branch | Connected theme | Purpose |
| --- | --- | --- |
| `main` | Live theme (once the store launches) | Reviewed, releasable code only |
| `develop` | Unpublished "EVUNEL – develop" theme | Integration branch for review on the development store |
| `feature/*` | Local `shopify theme dev` | One branch per task, merged into `develop` through a pull request |

Themes are connected to branches with the Shopify GitHub integration (Online Store → Themes → Add theme → Connect from GitHub). Changes made in the theme editor are committed back to the connected branch by Shopify, mostly in `config/settings_data.json` and `templates/*.json`. Pull before you start work.

## Porting Dawn updates

```sh
git fetch upstream --tags
# See what changed in Dawn between our base and a newer release
git diff v16.0.0 <new-tag> --stat
git diff v16.0.0 <new-tag> -- assets/cart.js
```

Port the relevant hunks by hand or with `git cherry-pick`, test, and record the port in [CHANGES-FROM-DAWN.md](CHANGES-FROM-DAWN.md).

## Conventions

- **Language:** README files, code comments and commit messages are written in English.
- **Design tokens:** colours, fonts and the type scale come from `snippets/css-variables.liquid` (EVUNEL UI-kit). Do not hard-code colours or font sizes in components.
- **Text:** no storefront copy in templates; every string lives in `locales/*.json` so the theme can be translated per market.
- **Pending client decisions** (see the Decisions sheet in the data model workbook) stay configurable through theme settings and are never hard-coded.
- **Formatting:** Prettier with the settings in `.prettierrc.json`.
- **Secrets:** API tokens (for example, the Admin API token used by the metafield scripts) go in `.env`, which is git-ignored. Never commit them.

## Project documents

The client handoff pack (brief, data model workbook, prototype source and brand assets) is kept outside this repository. Ask the project manager for access.

## License

Dawn is © Shopify Inc. and is used under the terms in [LICENSE.md](LICENSE.md), which permit developing themes for Shopify stores. EVUNEL brand assets belong to EVUNEL.
