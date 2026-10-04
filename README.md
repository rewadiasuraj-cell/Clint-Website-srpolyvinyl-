# S. R. Polyvinyl Ltd. — Website

Static website for S. R. Polyvinyl Ltd. (PVC resin, PVC paste resin, plasticizers and allied chemicals), New Delhi.

Live: https://clint-website-srpolyvinyl.rewadiasuraj.workers.dev/

## Pages
| File | Page |
|---|---|
| `public/index.html` | Home: hero, about, stats band, product explorer (6 shown, search + filters), industry panels, authorized partners, client logo wall, why us, quote CTA |
| `public/about.html` | Profile, vision & mission, values, quality assurance, certifications, infrastructure, why us (all 6), group companies, company factsheet |
| `public/products.html` | Product explorer (all 18 products, search + filters), then detailed category sections |
| `public/industries.html` | Industries served, with the products supplied to each (linked to the products page) |
| `public/clientele.html` | All client logos |
| `public/contact.html` | Contact details, enquiry form, map |
| `public/404.html` | Page not found |

All site files are inside `public/`:
- `css/style.css`: base component styles
- `css/theme.css`: industrial theme layer (graphite / warm white / grey, brand red accent, Space Grotesk + Inter); loaded after style.css
- `js/main.js`: header, mobile menu, scroll reveals, counters, hero parallax, product explorer filters, enquiry form validation
- `images/`: logos, product photos, office photos, certificates, client logos (WebP)

No build step or framework: edit the HTML/CSS directly.

## Common edits
- **Phone / email / address**: search and replace in the 7 HTML files (header, footer, contact page).
- **WhatsApp number**: `https://wa.me/918586980901` and `data-whatsapp="918586980901"` on the contact form.
- **Product grades**: edit the explorer cards (`.pcard`) and the `<ul class="grades">` lists in `public/products.html`; the Home explorer shows the same cards.
- **Add a client logo**: add a WebP to `public/images/clients/` and copy one `<div class="client ...">` block in `public/clientele.html` (the Home page shows the first three).

## Enquiry form
The site is static (no server), so the form does not send email by itself:
- **Send enquiry** validates the fields, opens the visitor's email app with the enquiry filled in (to `info@srpolyvinyl.com`) and shows a success panel.
- **Send on WhatsApp** opens WhatsApp with the enquiry filled in.

To receive submissions directly in an inbox, connect a form service (e.g. Web3Forms or Formspree) to `#enquiryForm`.

## Deploy
Connected to Cloudflare. Every push to `main` deploys automatically in under a minute.

- **Cloudflare Workers** (current): `wrangler.jsonc` serves `public/` as static assets. Build command: *(empty)*. Deploy command: `npx wrangler deploy`.
- **Cloudflare Pages** (alternative): framework preset **None**, build command *(empty)*, build output directory `public`, production branch `main`.

**Custom domain:** Cloudflare dashboard → the Worker → Settings → Domains & Routes → Add custom domain.
