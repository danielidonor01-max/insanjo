# Insanjo — Landing Page

A minimalistic, premium recreation of the insanjo.com landing page.
React + Vite + Tailwind v4, light editorial-minimal aesthetic (Fraunces + Inter).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

```
src/
  App.jsx                  page composition + scroll-reveal
  index.css                design tokens (@theme) + base styles
  hooks/useScrollReveal.js IntersectionObserver reveal-on-scroll
  components/
    Navbar.jsx  Hero.jsx  ProductPreview.jsx  Features.jsx
    HowItWorks.jsx  Audience.jsx  Pricing.jsx  WaitlistCTA.jsx
    Footer.jsx  Logo.jsx  SectionHeading.jsx
```

## Design system

- **Palette:** warm near-white canvas `#FCFBF9`, warm ink `#1A1815`, single violet accent `#6D28D9` (brand-aligned), warm hairline borders.
- **Type:** Fraunces (display serif) for headings, Inter for UI/body.
- **Motion:** subtle reveal-on-scroll, 150–300ms hover transitions; respects `prefers-reduced-motion`.

All copy is preserved from the live site (headings verbatim); body text was condensed for a cleaner read.
