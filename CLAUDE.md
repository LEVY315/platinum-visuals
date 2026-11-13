# CLAUDE.md — Platinum Visuals Portfolio

Read this file fully before doing any work. It is the source of truth for this project. If a task prompt conflicts with this file, follow the task prompt and mention the conflict in your report.

## 1. Project overview

A single-page portfolio website for **Platinum Visuals (PTY) LTD**, a South African photography and videography company founded in 2021 by Njabulo Madonsela.

The site has four parts, in this order, top to bottom:

1. **Header / nav bar** — logo on the left, menu on the right linking to About, Services and Contact (smooth scroll to each section). Collapses into a hamburger menu on small screens.
2. **About** — company text, with a large version of the logo beside it (desktop) or above it (mobile).
3. **Services** — a short summary of the services offered, followed by one card per service category, each showing that category's best photo. Clicking a card opens a modal gallery with all photos in that category. On **all** screen sizes the cards are an auto-playing slideshow: phones show one card at a time, larger screens show several at once and advance one card per step (e.g. [1,2,3] → [2,3,4]). There is no static grid.
4. **Contact** — each contact method opens the matching app (phone dialer, WhatsApp, email client, Instagram). Icons are generic for now and will later be replaced by image URLs hosted online.

Plus a small footer.

## 2. Tech stack

- **Angular** (latest stable), standalone components only, no NgModules.
- Signals for component state. New control flow (`@if`, `@for`, `@switch`).
- Plain SCSS with CSS custom properties. **No UI framework** (no Bootstrap, Material, Tailwind) and **no carousel/lightbox libraries** — the slideshow and modal are built by hand.
- Client-side rendered (no SSR) for v1.
- Hosting: **Firebase Hosting** (static). Version control: **GitHub**.
- Do **not** add npm dependencies without a strong reason. If you add one, justify it in your report.
- Do **not** set up Firebase, CI/CD, or deploy anything unless a task prompt asks you to. That is handled in a separate task.
- Do **not** push to GitHub. Commit locally with clear messages; the developer pushes.

## 3. Design system

### Colors (define as CSS custom properties in `src/styles.scss`)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F4F5F7` | Page background (a soft gray-white, never pure `#FFF`) |
| `--color-surface` | `#FFFFFF` | Cards, modal panels where contrast is needed |
| `--color-blue` | `#1766C5` | Brand blue from the logo: headings, links, buttons, accents |
| `--color-blue-dark` | `#11519E` | Hover/active state of blue |
| `--color-charcoal` | `#343F46` | Brand charcoal from the logo: body text, Services band background |
| `--color-muted` | `#5A6670` | Secondary text, captions |
| `--color-on-dark` | `#F4F5F7` | Text on the charcoal Services band |

Blue and charcoal may swap roles depending on context (e.g. charcoal headings on a blue button area), but text must always meet WCAG AA contrast.

### Typography

- Headings: **DM Serif Display** (echoes the heavy serif in the logo).
- Body and UI: **Figtree**.
- Load both from Google Fonts with `display=swap` and give each a sensible fallback stack.
- Use a clear type scale (e.g. based on 1.25 ratio). Body text at least 16px, line-height ~1.6, max line length ~70ch.

### Layout and feel

- Mobile-first. Breakpoints: `md` = 768px, `lg` = 1024px, `xl` = 1280px.
- Content max-width ~1200px, centered.
- The photos are the product: keep the UI calm and restrained so images stand out. No decorative gradients, no gimmicky animation.
- Rounded corners: small (6–10px) on cards and buttons.
- Respect `prefers-reduced-motion`: no autoplay, no smooth-scroll animation, no transitions beyond simple fades.

## 4. Brand assets

- Logo SVGs live in `public/brand/`.
  - `platinum-visuals-logo-transparent.svg` — main logo, for use on the light background.
  - `platinum-visuals-logo.svg` — version with black background (not used on the site for now).
- The original SVG has a tall `viewBox="0 0 1080 1350"` with a lot of empty space. For the header, use a cropped copy (`public/brand/logo-header.svg`) with the `viewBox` tightened to the artwork (roughly `0 390 1080 600`; verify visually).
- Always give the logo an accessible name: `alt="Platinum Visuals Photography"`.

## 5. Business facts (use exactly)

- Company: Platinum Visuals (PTY) LTD
- Tagline: "Capturing Moments. Creating Memories. Telling Stories."
- Closing line: "Your moments deserve to be remembered beautifully."
- Email: `platinumvisuals22@gmail.com` → `mailto:platinumvisuals22@gmail.com`
- Phone (calls): `065 830 9526` → `tel:+27658309526`
- WhatsApp: `065 830 9526` → `https://wa.me/27658309526` (may append `?text=` with a short URL-encoded greeting)
- Instagram: `@platinum.visuals_pty_ltd` → `https://www.instagram.com/platinum.visuals_pty_ltd/`
- External links open in a new tab with `rel="noopener noreferrer"`. `tel:` and `mailto:` links do not.
- Site language: `en-ZA`.

## 6. Service categories

Slugs and display titles (in this order):

| slug | title |
|---|---|
| `weddings` | Weddings |
| `matric-dances` | Matric Dances |
| `corporate-events` | Corporate Events |
| `studio-portraits` | Studio Portraits |
| `professional-portraits` | Professional Portraits |
| `maternity-shoots` | Maternity Shoots |
| `milestone-shoots` | One-Year-Old & Milestone Shoots |
| `birthday-shoots` | Birthday Shoots |
| `birthday-parties` | Birthday Parties |
| `sports-events` | Sports Events |
| `outdoor-shoots` | Outdoor Shoots |

## 7. Images architecture (important)

Real photos are **not** in the repo yet. Everything must be built so that adding real photos later only means dropping files into folders and updating one data file — no component changes.

### Folder structure

```
public/images/services/<slug>/thumb/<name>.<ext>   ← small version for cards and gallery grid
public/images/services/<slug>/full/<name>.<ext>    ← large version, loaded only in the photo viewer
```

### Data model

All gallery content comes from one typed data file: `src/app/data/services.data.ts`. Components never hard-code image paths.

```ts
export interface GalleryImage {
  thumb: string;   // path under /images/...
  full: string;    // path under /images/...
  alt: string;     // meaningful description
  width: number;   // intrinsic width of the full image
  height: number;  // intrinsic height of the full image
}

export interface ServiceCategory {
  slug: string;
  title: string;
  description?: string;  // optional one-liner shown on the card
  cover: GalleryImage;   // the "best photo" shown on the card
  images: GalleryImage[];
}
```

### Rules

- Every `<img>` has `width`, `height`, `alt`, `loading="lazy"` (except above-the-fold images) and `decoding="async"`.
- Cards and the gallery grid load **only `thumb`** images. The `full` image loads only when a single photo is opened in the viewer.
- Never crop photos inside the gallery grid or viewer — preserve aspect ratio. Cropping with `object-fit: cover` is allowed only on service cards.
- Until real photos exist, placeholders are SVG files at the same paths (`.svg` extension), with varied aspect ratios (portrait and landscape) so layouts are tested realistically.

## 8. Code conventions

- Folder layout: `src/app/components/<name>/` per component; `src/app/data/` for content; `src/app/services/` for shared logic.
- Components: `ChangeDetectionStrategy.OnPush`, signals for state, `input()` / `output()` functions.
- Content text (about copy, contacts) lives in data files, not hard-coded inside templates.
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>` with `id` and heading, `<footer>`.
- Accessibility is required, not optional: keyboard operable, visible focus styles, ARIA only where native HTML is not enough, focus returned to the triggering element when a modal closes.
- Section anchors (`#about`, `#services`, `#contact`) must account for the sticky header (`scroll-margin-top`).
- Keep files small and readable. No dead code, no commented-out blocks, no `console.log`.

## 9. Definition of done (every task)

1. `ng build` completes with no errors and no new warnings you could reasonably fix.
2. Unit tests pass with the project's default test runner.
3. Lint passes if a linter is configured.
4. Work is committed locally with clear commit messages.
5. You end with a report in the format below.

## 10. Report format (end every task with this)

```
## Report — <task name>

### Summary
2–4 sentences on what was built.

### Files created / changed
Grouped list with one line per file explaining its purpose.

### Commands run and results
Build, tests, lint — with pass/fail and any warnings.

### How each requirement was met
Go through the task's requirements one by one: done / partly done / not done, and how.

### Decisions and deviations
Anything you decided that the task or CLAUDE.md didn't specify, and anything you did differently, with reasons.

### Known issues / limitations

### What the developer needs to do or check manually
```
