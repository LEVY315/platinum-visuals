Read `CLAUDE.md` in the project root fully before doing anything. Follow it throughout this task.

# Task 1 — Build version 1 of the Platinum Visuals website

Build the complete single-page site described in CLAUDE.md, with placeholder images wired through the real image architecture. When finished, the developer should be able to replace placeholders with real photos by only adding files and editing `src/app/data/services.data.ts`.

## Step 1 — Scaffold

- This folder is an existing Git repository cloned from GitHub. It contains `CLAUDE.md`, this prompt and an `_incoming/` folder with the logo SVGs.
- Create the Angular app **in this folder** (not a subfolder) with the latest stable Angular CLI: SCSS styles, no SSR, routing not required. Use `--skip-git` since the repo already exists.
- If the CLI refuses because the folder isn't empty, scaffold into a temporary folder and move the files in, without overwriting `CLAUDE.md`, this prompt or `_incoming/`.
- Move the two SVGs from `_incoming/` into `public/brand/`, then delete `_incoming/`.
- Create the cropped `public/brand/logo-header.svg` as described in CLAUDE.md §4.
- Set `<html lang="en-ZA">`, the page title "Platinum Visuals | Photography & Videography", a meta description, Open Graph tags (title, description, type), and use the logo as the favicon.

## Step 2 — Design foundation

- Set up all color tokens, fonts, type scale, breakpoints and base styles from CLAUDE.md §3 in `src/styles.scss` (split into partials if it helps).
- Add a reusable visible focus style and a "skip to content" link.
- Add the `prefers-reduced-motion` handling globally.

## Step 3 — Header / nav

- Sticky header with `logo-header.svg` on the left (links to the top of the page) and links to About, Services, Contact on the right.
- Below `md`: a hamburger button (`aria-expanded`, `aria-controls`) that opens a menu panel. The menu closes when a link is chosen, on Esc, and when tapping outside it.
- Smooth scrolling to sections, respecting reduced motion.
- Highlight the link of the section currently in view (use `IntersectionObserver`).
- Header gets a subtle shadow or border once the page is scrolled.

## Step 4 — About section (`#about`)

Layout: on `lg` and up, text on the left and the large transparent logo on the right. Below `lg`, the logo sits above the text, smaller. Put this content in `src/app/data/about.data.ts` and render it from there:

- Eyebrow / small heading: About Platinum Visuals
- Headline: Capturing Moments. Creating Memories. Telling Stories.
- Paragraphs:
  1. Founded in 2021 by Njabulo Madonsela, Platinum Visuals (PTY) LTD is a professional photography and videography company dedicated to capturing the moments that matter most.
  2. We believe that every moment has a story worth preserving. From the excitement of a matric dance to the elegance of a wedding, the celebration of a birthday, the arrival of a new life, or the achievements of a corporate event, our purpose is to transform meaningful moments into premium, timeless visual memories.
  3. At Platinum Visuals, we combine creativity, professionalism, and attention to detail to deliver photography and videography that reflects the uniqueness of every client. We take the time to understand your vision and create images and films that you will be proud to look back on for years to come.
- Three short blocks below the main text (in a row on `lg`, stacked on mobile):
  - **Our Approach:** Every client and every occasion is different. That is why we focus on creating a personalised experience while maintaining the highest standards of quality and professionalism. Whether you are looking for a single portrait, documenting a major celebration, or creating professional visual content for your business, Platinum Visuals is committed to making every frame count.
  - **Our Vision:** To build a trusted and recognised visual media brand known for exceptional quality, creativity, professionalism, and authentic storytelling.
  - **Our Mission:** To preserve life's most valuable moments through premium photography and videography, creating visual stories that allow our clients to experience their memories again and again.

Do not repeat the list of services in About — a summary of them appears at the top of the Services section instead (Step 6).

## Step 5 — Placeholder images and data

- For each of the 11 categories in CLAUDE.md §6, create 6 placeholder images following the folder structure in CLAUDE.md §7 (`thumb/` and `full/` versions of each, as `.svg`).
- Mix aspect ratios within each category: some 3:2 landscape, some 2:3 portrait, at least one square.
- Placeholders should look intentional, not broken: a neutral tinted background, a simple camera or image glyph, and the category name plus image number in small text. Vary the tint slightly between images so they're distinguishable.
- Write a small Node script at `scripts/generate-placeholders.mjs` that creates these files, so they can be regenerated. No dependencies.
- Fill `src/app/data/services.data.ts` with all 11 categories using the exact interfaces from CLAUDE.md §7. Each category: cover = its first image, plus a short one-line description you write in a warm, professional tone (no clichés like "capturing your special day").

## Step 6 — Services section (`#services`)

- Full-width band with `--color-charcoal` background and light text.
- **Intro above the cards:** heading "Our Services", then this summary (store it in `src/app/data/services.data.ts` or a small content file, not in the template):
  > We offer a diverse range of professional photography and videography services — from studio and professional portraits to weddings, matric dances, corporate and sports events, outdoor shoots, maternity sessions, birthdays and one-year-old milestone shoots.
- **Service card:** cover image (`thumb`) cropped to a 4:5 ratio, title, optional description, and a clear affordance that it opens a gallery (e.g. "View gallery" + photo count). The whole card is one `<button>` (or contains one) — keyboard accessible.

### Slideshow — used on every screen size (no static grid)

- **Cards visible at once:**
  - below `md` (768px): 1 card, ~80% of the viewport width so the next card peeks in
  - `md` to below `lg`: 2 cards
  - `lg` to below `xl`: 3 cards
  - `xl` and up: 4 cards
- **Movement:** each step advances by **one card**, so with 3 visible the view goes [1,2,3] → [2,3,4] → [3,4,5]. When the last card is fully in view, the next step slides back to the start ([9,10,11] → [1,2,3]).
- Build it as a horizontal track using CSS scroll-snap (snap per card), so native swipe and trackpad scrolling work. Card width is calculated from the visible count and the gap, so cards fill the band exactly on larger screens.
- Switching visible count on resize must work without a reload (use `matchMedia`), keeping the current first card in view where possible.
- **Autoplay:** advances every 4 seconds on all screen sizes. It pauses while the user is touching/swiping, while the pointer hovers over the slideshow, while focus is inside it, while the gallery modal is open, and when the tab is hidden. It never starts when reduced motion is preferred. It resumes a few seconds after interaction ends and when the modal closes.
- **Controls:**
  - Previous/next arrow buttons on `md` and up (hidden on phones, where swiping is natural), with accessible labels. Previous on the first position wraps to the end; next on the last position wraps to the start.
  - Dot indicators below, one per possible starting position (11 − visible count + 1), synced with the current position, clickable, with accessible labels ("Show from Weddings").
- Expose it to assistive tech as a carousel (`aria-roledescription="carousel"`, each card labelled "1 of 11" etc.).
- Keep the slideshow logic in one reusable component or service so it isn't tied to the service cards' markup.

## Step 7 — Gallery modal

- Use the native `<dialog>` element with `showModal()`.
- Opens when a service card is chosen. Shows the category title, photo count and a close button.
- Body: all the category's `thumb` images in a masonry-style layout (CSS columns) that preserves each photo's aspect ratio — no cropping.
- Closes on: the close button, Esc, and clicking the backdrop. Page scroll is locked while open. Focus returns to the card that opened it.
- **Photo viewer:** choosing a photo in the gallery shows it large (`full` image) inside the modal, fitted to the screen without cropping, with previous/next buttons, arrow-key navigation, swipe on touch devices, a counter ("3 / 6") and a way back to the grid. Show a light loading state while the full image loads.
- Opening a category's modal, then closing it, then opening another must always show the correct photos (no stale state).

## Step 8 — Contact section (`#contact`)

- Heading "Get in Touch" and a short line inviting people to book or ask about a shoot.
- Four contact cards/buttons, data in `src/app/data/contact.data.ts`, links exactly as CLAUDE.md §5:
  - Call — 065 830 9526
  - WhatsApp — 065 830 9526 (prefill: "Hi Platinum Visuals, I'd like to enquire about a shoot.")
  - Email — platinumvisuals22@gmail.com
  - Instagram — @platinum.visuals_pty_ltd
- Icons: each contact entry in the data file has an optional `iconUrl` field (an image hosted online, to be filled in later). If `iconUrl` is set, render it as an `<img>` at a fixed icon size; if it's empty, fall back to a simple, generic inline SVG icon (phone, chat bubble, envelope, camera) — not brand logos. Leave every `iconUrl` empty for now. Every link has a clear text label, so icons are decorative (`alt=""` / `aria-hidden="true"`).
- 2×2 grid on `md` and up, stacked on mobile. Large, easy tap targets (at least 48px tall).

## Step 9 — Footer

- Closing line "Your moments deserve to be remembered beautifully.", small logo, and "© <current year> Platinum Visuals (PTY) LTD" (year computed, not hard-coded).

## Step 10 — Tests

Write focused unit tests for:
- Services data: every category has a cover, at least one image, and every image has non-empty `alt`, `thumb`, `full`, and positive `width`/`height`.
- Contact data: links match CLAUDE.md §5 exactly.
- Gallery modal: opens with the correct category, closes, and the viewer's next/previous wraps correctly.
- Slideshow: autoplay does not start when reduced motion is preferred; the number of starting positions is correct for each visible count (1, 2, 3, 4); next/previous wrap correctly at both ends.
- Contact icons: an entry with `iconUrl` renders an `<img>`, an entry without one renders the fallback SVG.

## Step 11 — Verify and report

- Run the production build, the tests, and lint (if configured). Fix what fails.
- Check the generated `public/images/` files are referenced correctly (no 404 paths in the data file).
- Review the layout at 375px, 768px, 1024px and 1440px widths in whatever way you can, and note in your report how you verified it and anything you couldn't verify.
- Commit your work locally in logical commits. Do not push.
- Finish by writing the report in the exact format from CLAUDE.md §10.
