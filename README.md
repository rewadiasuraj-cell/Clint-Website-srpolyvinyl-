# S. R. Polyvinyl Ltd. — Website

Static website for S. R. Polyvinyl Ltd. (PVC resin, PVC paste resin, plasticizers and allied chemicals), New Delhi.

Live: https://clint-website-srpolyvinyl.rewadiasuraj.workers.dev/

## Pages
| File | Page |
|---|---|
| `public/index.html` | Home: hero slider, about, stats, products, authorized distributors, industries, why us, clientele, group companies |
| `public/about.html` | Profile, vision & mission, values, quality assurance, certifications, infrastructure, company factsheet |
| `public/products.html` | All product categories with grades, plus other specialty products |
| `public/contact.html` | Contact details, enquiry form, map |
| `public/404.html` | Page not found |

All site files are inside `public/`:
- `css/style.css`: all styles (colours are set at the top under `:root`)
- `js/main.js`: header, mobile menu, hero slider, scroll animations, counters, card tilt, enquiry form
- `images/`: logos, product photos, office photos, certificates, client logos (WebP)

No build step or framework: edit the HTML/CSS directly.

## Common edits
- **Phone / email / address**: search and replace in the 5 HTML files (header, footer, contact page).
- **WhatsApp number**: `https://wa.me/918586980901` and `data-whatsapp="918586980901"` on the contact form.
- **Product grades**: edit the `<ul class="grades">` lists in `public/products.html`.
- **Add a client logo**: add a WebP to `public/images/clients/` and copy one `<div class="client ...">` block in `public/index.html`.

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
