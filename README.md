# S. R. Polyvinyl Ltd. — Website

## Client review revision — 1 November 2026

- Home: five slides (SR Polyvinyl, IG Petro, Payal, Tricon, SR applications), existing video banners with pause controls, complete core-product grid and revised distributor section.
- Shared header: expandable product menu; maroon header and white logo on scroll.
- About options: `public/about.html` (corporate) and `public/about-option-2.html` (editorial), linked by a review switch. Option 2 is marked noindex. Certificate photos, infrastructure and values sections removed.
- Products: compact searchable grid, consistent image frames, expandable grades and product-specific enquiry links.
- Contact: enquiry purpose, quantity and delivery city; included in email/WhatsApp message preparation.
- BPCL, IG Petro and Tricon use text branding where approved logo assets were not included. Existing product photos are retained, with consistent framing; they have not been retouched or relabelled.

Preview: `python -m http.server 8765 --bind 127.0.0.1 --directory public`, then open http://127.0.0.1:8765/.
Check internal links/assets: `python check_site.py`. Check scripts: `node --check public/js/main.js` and `node --check public/js/revision.js`.
Original files are preserved in `backups/before-client-revision/`. Published to GitHub main via connector commit a8ee16837fe2fd81a11710f188f0f87ce2620951 on 1 November 2026. Cloudflare production build succeeded (version 368a5fc7-a76e-41c2-bef2-fad9e69dd93a); live homepage and About option 2 verified. This local folder still has no Git metadata.

Static website for S. R. Polyvinyl Ltd. (PVC resin, PVC paste resin, plasticizers and allied chemicals), New Delhi.

Live: https://clint-website-srpolyvinyl.rewadiasuraj.workers.dev/

## Pages
| File | Page |
|---|---|
| `public/index.html` | Home: hero slider, intro, statement, journey in numbers, and previews with links: products (4), authorized distributors, industries (4), why us (3), clientele (all 6, scrolling row) |
| `public/about.html` | Profile, vision & mission, values, quality assurance, certifications, infrastructure, why us (all 6), group companies, company factsheet |
| `public/products.html` | All product categories with grades, plus other specialty products |
| `public/industries.html` | Industries served, with the products supplied to each (linked to the products page) |
| `public/clientele.html` | All client logos |
| `public/contact.html` | Contact details, enquiry form, map |
| `public/404.html` | Page not found |

All site files are inside `public/`:
- `css/style.css`: all styles (colours are set at the top under `:root`)
- `js/main.js`: header, mobile menu, hero slider, client marquee, scroll animations, counters, card tilt, enquiry form
- `images/`: logos, product photos, office photos, certificates, client logos (WebP)

No build step or framework: edit the HTML/CSS directly.

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
