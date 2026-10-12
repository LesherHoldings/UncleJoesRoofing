# Uncle Joe's Roofing — unclejoesroofing.com

Marketing website for Uncle Joe's Roofing (a DBA of Fortress Siding), serving Conshohocken, Blue Bell, Malvern, Paoli and the surrounding Montgomery & Chester County area. *Call Your Uncle.*

- **Astro 7 + Tailwind CSS 4.** Every page is pre-built static HTML. There's no server code.
- **GoHighLevel** handles leads: the GHL form sits on the service, town and contact pages, and the GHL calendar is on `/book/`.
- **Built for phones first.** Measured with Lighthouse on mobile against the production build: Performance 97, Accessibility 100, Best Practices 100, SEO 100.

---

## Run it locally

You need **Node.js 22+**.

```bash
cd uncle-joes-roofing
npm install
cp .env.example .env      # optional — fill in GA4 ID / webhook URL to test them
npm run dev               # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with live reload |
| `npm run build` | Lists remaining placeholders, then builds to `dist/` and `.vercel/output/` |
| `npm run check` | TypeScript / Astro type check |
| `npm run check:placeholders` | Lists every placeholder still in the site |
| `npm run check:placeholders -- --strict` | Same, but fails if any are left. Run it before launch. |

The GHL form and calendar are live even in local dev, so a test submission creates a real contact in GHL. Delete test contacts afterwards.

---

## Editing content (no code needed)

All copy lives in Markdown files. The settings at the top of each file (between the `---` lines) control the page's **title**, **meta description** and **H1**. Everything below them is the page body.

| What you want to change | Edit this file |
| --- | --- |
| Phone, address, hours, HIC #, financing partner, reviews, credentials, warranty, owner name | `src/config/site.ts` |
| GHL form and calendar IDs | `src/config/site.ts` → `ghl` |
| Book page, Privacy, Terms, thank-you pages | `src/content/pages/book.md`, `privacy.md`, `terms.md`, `thank-you.md`, `booked.md` |
| Home page (hero, why us, story teaser, section headings) | `src/content/pages/home.md` |
| Roof Replacement / Roof Repair / Free Roof Inspection / Solar-Ready Roofs | `src/content/services/*.md` |
| Town pages (Conshohocken, Blue Bell, Malvern, Paoli) | `src/content/towns/*.md` |
| Nearby towns listed without their own page | `src/config/site.ts` → `nearbyTowns` |
| Our Story, Financing, Contact, Service Areas | `src/content/pages/*.md` |
| Menu links, where "Book" buttons go | `src/config/site.ts` (`nav`, `bookHref`) |
| Colors and fonts | `src/styles/global.css` (`@theme` block) |

What the settings at the top of each file mean:

- `title`: the browser tab and Google headline. Aim for 50–60 characters, in the form *"Roof Repair in Malvern, PA \| Uncle Joe's Roofing"*.
- `description`: the Google snippet. Aim for 140–160 characters.
- `h1`: the main heading on the page. Use exactly one per page.
- `faqs`: question/answer pairs. They show on the page and also feed Google's FAQ data.
- `highlights` (services) and `housing` / `landmarks` (towns): short bullet lists.

**Adding a town:** copy one of the files in `src/content/towns/`, rename it (the file name becomes the URL), rewrite the copy, and set `order`. Then add an Open Graph image entry (see below). Keep every town page genuinely different. Google ignores pages that are the same text with a different town name.

> **Please check the local details.** The town pages mention landmarks, roads and typical housing. I wrote them from general knowledge of the area. Before launch, have someone local read each page and correct anything that's off.

---

## Placeholders

Every placeholder is in **`src/config/site.ts`**, and nowhere else. `npm run check:placeholders` lists any that are left.

| # | Placeholder | Config key | Where it shows | Notes |
| --- | --- | --- | --- | --- |
| 1 | `[PHONE — PENDING]` | `phone.display` | Header, mobile call bar, every Call button, footer, contact page | **Must match Google Business Profile exactly** |
| 2 | `+10000000000` | `phone.e164` | Every `tel:` link and the structured data for search engines | Same number in `+1XXXXXXXXXX` format |
| 3 | `[OFFICE STREET ADDRESS — PENDING]`, `[OFFICE CITY — PENDING]`, `[ZIP — PENDING]` | `address` | Footer, contact page, structured data | **Must match Google Business Profile exactly.** Also confirm `city`, `postalCode` |
| 4 | `[PA HIC # — PENDING]` | `hicNumber` | Footer on every page (required by PA law), credential badge | PA Home Improvement Contractor registration number |
| 5 | `[FINANCING PARTNER — PENDING]` | `financing.partner` | Financing page | Optionally set `financing.applyUrl` to show an "Apply" button |
| 6 | `PUBLIC_GA4_ID` | environment variable | Analytics | GA4 measurement ID, `G-XXXXXXXXXX` |
| 7 | `[REVIEW PLACEHOLDER]` / `[CUSTOMER NAME]` | `reviews` | Home page reviews | Real reviews only, with permission. Set `verified: true` on real ones |
| 8 | `[CERTIFICATION — PENDING]` | `credentials` | Badges on home and service pages | Replace with a real credential (e.g. a shingle manufacturer program), or delete it |
| 9 | `[INSURANCE DETAILS — PENDING]` | `credentials` | Same badges | e.g. "Fully insured" — only once that's confirmed |
| 10 | `[WARRANTY TERMS — PENDING]` | `warranty` | Roof Replacement page | Manufacturer and workmanship warranty terms |
| 11 | `[HOURS — PENDING]` | `hours` | Footer, contact page, structured data | The 8–5 / 9–1 times are stand-ins. **Match Google Business Profile** |
| 12 | `[EMAIL — PENDING]` | `email` | Contact page, structured data | |
| 13 | `[JOB PHOTO — PENDING]` | `gallery` | "Our work" before & after on the home and story pages | Only real jobs you have the right to show. Drop photos in `src/assets/photos/`, set `before`/`after` to the file names, fix the caption and town |
| — | Map coordinates | `geo` | Structured data | Currently empty (left out of the structured data). Add your Google Business Profile pin |
| — | Legal name | `legalName` | Structured data, footer | Confirm the exact registered name (e.g. "Fortress Siding LLC") |
| — | Review / social links | `reviewsUrl`, `social` | Reviews button, structured data | Optional. Empty values are hidden |
| — | Owner name, photo, bio, facts | `ownerName`, `owner` | "Meet the owner" (home, Our Story), story signature, structured data | Filled in. Photo is `src/assets/photos/owner-joe.jpg`; bio paragraphs and facts are in the owner's own words |

The site never invents reviews, review counts, years in business, job counts, certifications or awards. Keep it that way: only add claims you can back up.

---

## Pages

| URL | What it is |
| --- | --- |
| `/` | Home |
| `/book/` | GHL booking calendar. Every "Book" button links here, and so does **discovery.unclejoesroofing.com** |
| `/roof-replacement/`, `/roof-repair/`, `/free-roof-inspection/`, `/solar-ready-roofs/` | Service pages, each with the GHL form |
| `/pricing-and-warranties/` | Plain-English guide: what's in a quote, shingle types, manufacturer vs. workmanship warranty (prints `warranty` and `financing.partner` from the config) |
| `/what-to-expect/` | Install day start to finish, plus the "Leaking right now?" emergency section (`#leaking-right-now`) |
| `/financing/`, `/our-story/`, `/contact/` | |
| `/service-areas/` and `/service-areas/{conshohocken, blue-bell, malvern, paoli}/` | Town pages, each with the GHL form |
| `/privacy/` | Privacy policy, including SMS opt-in wording |
| `/terms/` | Terms & conditions, including SMS program terms |
| `/thank-you/`, `/thank-you/booked/` | Confirmation pages after a form or booking. Hidden from search |

URLs end in a slash. `/privacy` and `/terms` redirect to `/privacy/` and `/terms/` automatically.

## GoHighLevel form and calendar

The form and calendar IDs live in `src/config/site.ts` under `ghl`. To swap in a different form or calendar, change the ID there.

- **Lead form** (`Unc Joe's Main Site`): appears on the service pages, town pages, Free Roof Inspection and Contact. To keep pages fast, it loads only when a visitor scrolls near it. Its height is reserved ahead of time so the page doesn't jump.
- **Calendar**: on `/book/`, where it loads right away.

### Set these two redirects in GHL (required for conversion tracking)

GHL forms and calendars run inside an iframe, so the website can't see a submission happen. Instead, have GHL send the visitor to a thank-you page, and that page records the conversion:

1. **Form:** Sites → Forms → *Unc Joe's Main Site* → Options → **On Submit → Redirect to URL** → `https://unclejoesroofing.com/thank-you/`
2. **Calendar:** Calendars → your calendar → Confirmation / **Redirect URL** after booking → `https://unclejoesroofing.com/thank-you/booked/`

Until those are set, the form and calendar still work, but GA4 won't count conversions from them.

### SMS / A2P 10DLC

`/privacy/` and `/terms/` include the language carriers look for in A2P 10DLC registration:
- message types and frequency
- "Msg & data rates may apply"
- STOP and HELP instructions
- carriers aren't liable for delayed or undelivered messages
- "no mobile information will be shared with third parties or affiliates for marketing or promotional purposes"

Use those two URLs in your A2P brand and campaign registration. Make sure the GHL form has an SMS consent checkbox that links to both pages, and that the message types listed in the Terms match what you actually send.

## Analytics (GA4)

When `PUBLIC_GA4_ID` is set, the GA4 script loads after the page finishes loading, so it doesn't slow the page down. Three conversion events are sent:

| Event | When | Parameters |
| --- | --- | --- |
| `click_to_call` | Any phone link is tapped | `call_location` (e.g. `header`, `mobile_call_bar`, `home_hero`, `footer`), `page_path` |
| `generate_lead` | Visitor lands on `/thank-you/` (after the GHL form) | `method: website_form` |
| `book_appointment` | Visitor lands on `/thank-you/booked/` (after the GHL calendar) | `method: online_calendar` |

Each thank-you event fires once per visit, so refreshing the page doesn't double-count. In GA4, go to **Admin → Events** and mark all three as **Key events**.

## SEO

- Every page has its own title, description, H1 and canonical URL (all set in the Markdown files).
- RoofingContractor structured data (name, phone, address, hours, service areas, map location) is on every page, built from `src/config/site.ts`. Service pages also have Service data; pages with FAQs have FAQ data; inner pages have breadcrumbs.
- The sitemap is generated automatically at `/sitemap-index.xml` and listed in `public/robots.txt`.
- Open Graph images (the preview shown when a link is shared) are in `public/og/`, one per page.

**Name, address and phone (NAP):** what the site shows must match Google Business Profile, Facebook, Yelp and every directory listing *character for character*: "Suite 2" vs "Ste 2" counts as different. Edit them in one place (`site.ts`) and they update everywhere.

### Regenerating images

```bash
# Open Graph images (after changing a headline in scripts/make-og-images.py):
python3 scripts/make-og-images.py

# Logos and favicons (if the logo artwork changes):
python3 scripts/prepare-logos.py brand-originals
```

Both need Python 3 with Pillow (`pip install pillow`). The OG script also needs `npm install` first, for the font files. The original logo files are in `brand-originals/`.

### Site photos

Photos live in `src/assets/photos/` and are referenced by file name (without extension) — in Markdown front matter as `image:` / `imageAlt:`, and in `site.ts` for the gallery and owner photo. They're resized and converted to WebP at build time, so drop in full-size JPGs. The current photos were generated in Canva as stand-ins; replace them with real job photos as you get them (keep the same file names and nothing else needs to change).

To pull files from a URL into the repo without a local checkout, run the **Import assets** workflow in GitHub → Actions with a JSON manifest like `[{"url":"https://…/photo.jpg","path":"src/assets/photos/town-ambler.jpg"}]`.

### Design notes

- Colors, type and buttons are tokens in `src/styles/global.css` (`@theme`). Yellow is an accent (buttons, rules, highlights), navy is the dark color, white is the page.
- The moving backgrounds (drifting shingle pattern, sunlight glow, shore waves, fade-in on scroll) are CSS animations controlled by `src/scripts/motion.ts`. They only run while on screen, animate only transform/opacity, and switch off entirely for visitors with "reduce motion" turned on.

---

## Deploy to Vercel

The Vercel project is connected to this GitHub repository: every push to `main` builds and goes live on unclejoesroofing.com automatically (Vercel → uncle-joes-roofing → Deployments shows each build). Pushes to other branches get a preview URL. Note: Vercel only builds commits whose author is a member of the Vercel team, so commits made on the owner's behalf are authored as the LesherHoldings GitHub account, which is the account connected to Vercel.

The site lives in the `uncle-joes-roofing/` folder of this repository.

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project** → import the repository.
3. Set **Root Directory** to `uncle-joes-roofing`. Vercel detects **Astro** automatically; leave the build settings as they are.
4. Under **Environment Variables**, add:
   - `PUBLIC_GA4_ID` = your GA4 measurement ID
5. Click **Deploy**.
6. Add the domain: **Project → Settings → Domains → `unclejoesroofing.com`** (and `www.unclejoesroofing.com`, set to redirect to the main domain). Then follow Vercel's DNS instructions at your registrar.
7. Submit `https://unclejoesroofing.com/sitemap-index.xml` in Google Search Console.

After changing environment variables, redeploy (Deployments → ⋯ → Redeploy) so they take effect.

### Before launch

- [ ] `npm run check:placeholders -- --strict` passes
- [ ] Phone, address and hours match Google Business Profile exactly
- [ ] PA HIC number is in the footer
- [ ] GHL form redirects to `/thank-you/` and calendar to `/thank-you/booked/` (see above)
- [ ] A test form submission and a test booking both show up in GHL
- [ ] GA4 Realtime shows `click_to_call`, `generate_lead` and `book_appointment`, and all three are marked as Key events
- [ ] discovery.unclejoesroofing.com links to `https://unclejoesroofing.com/book/`
- [ ] Someone local has proofread the town pages
- [ ] Privacy policy and terms reviewed (they're plain-language templates, not legal advice)
- [ ] Real job photos added when you have them (none are used yet)

---

## Project layout

```
uncle-joes-roofing/
├─ src/
│  ├─ config/site.ts          ← business facts + ALL placeholders
│  ├─ content/                ← all page copy (Markdown)
│  │  ├─ pages/  services/  towns/
│  ├─ content.config.ts       ← which fields each Markdown file has
│  ├─ components/             ← header, footer, GHL form/calendar, cards, FAQ…
│  ├─ layouts/Layout.astro    ← <head>, SEO tags, structured data, analytics
│  ├─ lib/schema.ts           ← JSON-LD builders
│  ├─ pages/                  ← routes (one file per URL pattern)
│  ├─ assets/brand/           ← web-ready logos (optimized at build)
│  ├─ assets/photos/          ← site photos, referenced by file name
│  ├─ scripts/motion.ts       ← turns the background animations on/off as you scroll
│  └─ styles/global.css       ← colors, fonts, buttons, animations
├─ public/                    ← favicons, robots.txt, og/ images
├─ .github/workflows/         ← import-assets (pull files into the repo), upload-asset (send a file to a URL)
├─ scripts/                   ← placeholder checker, image generators
└─ brand-originals/           ← original logo files
```
