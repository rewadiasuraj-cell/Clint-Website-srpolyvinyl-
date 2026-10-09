# S. R. Polyvinyl Ltd. — Website

Static website for S. R. Polyvinyl Ltd. (PVC resin, PVC paste resin, plasticizers and allied chemicals), New Delhi.

Live: https://clint-website-srpolyvinyl.rewadiasuraj.workers.dev/

## Pages
| File | Page |
|---|---|
| `public/index.html` | Home: hero slider, intro, statement, journey in numbers, and previews with links: products (4), authorized distributors, industries (4), why us (3), clientele (all 6, scrolling row) |
| `public/about.html` | Editorial company profile, authorized principals and sourcing process |
| `public/products.html` | All 18 product lines in a searchable, filterable three-column catalog with grade details |
| `public/industries.html` | Industries served, with the products supplied to each (linked to the products page) |
| `public/clientele.html` | All client logos |
| `public/contact.html` | Contact actions, expanded requirement form, map |
| `public/404.html` | Page not found |

All site files are inside `public/`:
- `css/style.css`: all styles (colours are set at the top under `:root`)
- `js/main.js`: header, mobile menu, hero slider, client marquee, scroll animations, counters, card tilt, enquiry form
- `images/`: logos, product photos, office photos, certificates, client logos (WebP)

No build step or framework: edit the HTML/CSS directly.

## Client refresh review

Open `public/review.html` to compare the proposed designs. Alternative pages are intentionally accessible from this review page rather than the main navigation:
- `about-alternative.html`: photo-led About Us option.
- `products-alternative.html`: four-column compact product catalog.

Home has six hero slides (IG Petro, Payal, Tricon and three company concepts), a video slide using the existing licensed/site-provided video, manual controls, pause and bounded desktop parallax. Motion is disabled for reduced-motion preferences. Brand features for IG Petro and Tricon are enquiry prompts, not claims of authorized distributorship. BPCL is displayed as text because no BPCL logo is supplied.

The product catalog preserves existing descriptions and grades. Consistent SVG bags and drums are illustrative, not manufacturer pack shots; the page discloses this. Replace them with client-approved standardized photos when available.

The enquiry form adds purpose, manufacturer, grade, quantity, delivery location and preferred contact method. All fields are included in email and WhatsApp messages. There is still no backend submission service.

Review the two About Us options, two product layouts and supplier copy before merging. Pushing to `main` triggers production deployment.

## Common edits
- **Phone / email / address**: search and replace in the 7 HTML files (header, footer, contact page).
- **WhatsApp number**: `https://wa.me/918586980901` and `data-whatsapp="918586980901"` on the contact form.
- **Product grades**: edit the `<ul class="grades">` lists in `public/products.html`.
- **Add a client logo**: add a WebP to `public/images/clients/` and copy one `<div class="client">` block inside `.cm-track` in both `public/clientele.html` and `public/index.html` (the scrolling row repeats the cards by itself).

## Enquiry form
The site is static (no server), so the form does not send email by itself:
- **Send by email** opens the visitor's email app with the enquiry filled in, addressed to `info@srpolyvinyl.com`.
- **Send on WhatsApp** opens WhatsApp with the enquiry filled in.

To receive submissions directly in an inbox, connect a form service (e.g. Web3Forms or Formspree) to `#enquiryForm`.

## Deploy
Connected to Cloudflare. Every push to `main` deploys automatically in under a minute.

- **Cloudflare Workers** (current): `wrangler.jsonc` serves `public/` as static assets. Build command: *(empty)*. Deploy command: `npx wrangler deploy`.
- **Cloudflare Pages** (alternative): framework preset **None**, build command *(empty)*, build output directory `public`, production branch `main`.

**Custom domain:** Cloudflare dashboard → the Worker → Settings → Domains & Routes → Add custom domain.

## Refresh validation

`node --check public/js/main.js` checks JavaScript syntax. `NODE_PATH=/path/to/jsdom/node_modules node scripts/check-refresh.cjs` runs catalog, slider, menu, enquiry and content-removal regression checks. A local static-link audit passed. Browser visual QA remains pending: Chromium downloads failed in the editing environment. Review desktop/mobile layouts and video playback before merging.
