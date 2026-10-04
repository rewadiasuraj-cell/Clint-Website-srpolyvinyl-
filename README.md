# S. R. Polyvinyl Ltd. — Website

Static website for S. R. Polyvinyl Ltd. (PVC resin, paste resin, plasticizers and allied chemicals).

## Pages
- `index.html` — Home (hero slider, about, stats, products, principals, industries, clientele)
- `about.html` — Profile, vision & mission, quality assurance, certifications, infrastructure, factsheet
- `products.html` — All product categories and grades
- `contact.html` — Contact details, enquiry form (sends via email / WhatsApp), map
- `404.html` — Not-found page

All site files live in `public/` (`css/style.css`, `js/main.js`, `images/`).

## Deploy (Cloudflare Pages)
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `public`
- Production branch: `main`

## Deploy (Cloudflare Workers)
`wrangler.jsonc` serves `public/` as static assets — deploy command: `npx wrangler deploy`.
