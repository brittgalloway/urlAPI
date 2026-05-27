# Shortly — URL Shortening Landing Page

A [Frontend Mentor](https://www.frontendmentor.io/challenges/url-shortening-api-landing-page-2ce3ob-G) challenge, built as a practice project to sharpen frontend fundamentals — semantic HTML, modern CSS, and vanilla JS.

> **[Live demo](https://brittgalloway.github.io/urlAPI/)**

---

## The Challenge

Build a responsive URL shortening landing page that integrates a third-party API to shorten links in real time. Users should be able to:

- Shorten any valid URL using the input form
- See a list of shortened links from their current session
- Copy a shortened link to their clipboard in one click
- See error states when submitting an empty or invalid URL
- View an optimal layout on any screen size
- See hover and focus states on all interactive elements

---

## Built With

- **Semantic HTML5** — landmark elements, proper heading hierarchy, ARIA attributes throughout
- **Modern CSS** — no preprocessor; native custom properties, nesting, `clamp()`, `min()`, `calc()`, and `@media` range syntax
- **Vanilla JavaScript** — no frameworks or libraries
- **[URLVanish API](https://urlvanish.com)** — free URL shortening, no API key required

---

## What I Focused On

### Accessibility first
Every decision started with accessibility rather than bolting it on at the end:

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) so screen reader users can jump between regions
- Logical heading hierarchy — `h1` → `h2` → `h3` with no skipped levels
- The mobile hamburger `<button>` manages `aria-expanded` and `aria-controls`, and the nav is connected via `id`
- The URL input uses `aria-describedby` wired to the error message paragraph (`role="alert"`, `aria-live="polite"`), so validation errors announce automatically without focus moving
- Decorative images carry `alt=""` and `aria-hidden="true"` so they're fully skipped by assistive technology
- Social links carry descriptive `aria-label` text since their icon images are hidden
- Copy buttons include the full short URL in their `aria-label` so each one is distinguishable when there are multiple results

### Modern CSS without a preprocessor
SCSS has been the default for years, but modern CSS handles everything this project needs natively:

- **Custom properties** for the full design token system (colors, spacing, radii, transitions) — one place to change anything
- **Native nesting** for BEM block/element relationships without a build step
- **`clamp()`** for fluid typography that scales between breakpoints without extra media queries
- **`min()`** for the container width (`width: min(69.375rem, 100% - 3rem)`) replacing the old max-width + padding pattern
- **`@media (width >= 768px)`** — modern range syntax instead of `min-width`
- **Mobile-first** — base styles are mobile, desktop is additive

### Hamburger animation
The open/close animation is CSS-only, driven entirely by the `[aria-expanded="true"]` attribute selector — no extra JS class toggling needed. The nav fade uses `opacity` + `visibility` rather than `display: none` → `display: flex`, which allows a proper CSS transition on both open and close.

### API integration
The original challenge suggested [cleanuri.com](https://cleanuri.com), but it doesn't send CORS headers so browser `fetch()` calls are blocked. After researching alternatives, URLVanish was the best fit — free, no key needed, and genuinely CORS-friendly.

---

## Running Locally

No build step required — this is plain HTML, CSS, and JS.

```bash
git clone https://github.com/brittgalloway/urlAPI.git
cd urlAPI
```

Then open `index.html` in your browser directly, or use a local dev server:

```bash
# VS Code Live Server extension (recommended)
# or with npx:
npx serve .
```

---

## Project Structure

```
urlAPI/
├── images/
│   ├── bg-boost-desktop.svg
│   ├── bg-boost-mobile.svg
│   ├── bg-shorten-desktop.svg
│   ├── bg-shorten-mobile.svg
│   ├── icon-brand-recognition.svg
│   ├── icon-detailed-records.svg
│   ├── icon-fully-customizable.svg
│   ├── icon-facebook.svg
│   ├── icon-twitter.svg
│   ├── icon-pinterest.svg
│   ├── icon-instagram.svg
│   ├── illustration-working.svg
│   ├── favicon-32x32.png
│   └── logo.svg
├── index.html
├── style.css
├── index.js
└── README.md
```

---

## Acknowledgements

- Challenge by [Frontend Mentor](https://www.frontendmentor.io)
- Coded by [Brittney Galloway](https://github.com/brittgalloway)