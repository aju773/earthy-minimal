# 🌿 astro-tailwind-conservation-site

A wildlife conservation nonprofit landing site built with **Astro 7**, **Tailwind CSS v4**, and a 3-tier **OKLCH design token** architecture. Features dark/light theme switching, scroll-reveal animations, animated counters, glassmorphism cards, and a donation flow.

> **Note:** This is a frontend concept site — no backend or payment processing. Built as a portfolio piece to demonstrate modern web design patterns.

---

## Preview

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero with particle animations, stats counter, program cards, CTA |
| **About** | `/about` | Mission, values, team grid, milestone timeline |
| **Donate** | `/donate` | Donation form, impact cards, testimonials |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro 7](https://astro.build) — static site generation, zero JS by default |
| Styling | Tailwind CSS v4 — CSS-first config via `@theme`, no `tailwind.config.js` |
| Color System | OKLCH — perceptually uniform color space (Material Design 3 approach) |
| Fonts | Google Fonts (loaded via `@import`) |
| Package Manager | pnpm |

---

## Design Token Architecture

All visual values flow through a 3-tier token system. **Zero hardcoded colors, spacing, or timing in components.**

```
src/styles/
├── tokens/
│   ├── primitives.css     ← Tier 1: Raw OKLCH values, hue anchors (THE file to change)
│   ├── semantic.css       ← Tier 2: Maps primitives to roles (--color-primary, --color-surface)
│   ├── components.css     ← Tier 3: Per-component tokens (--button-bg, --card-shadow)
│   └── animation.css      ← Motion tokens + prefers-reduced-motion
├── base.css               ← Resets, typography, scroll-reveal, skeleton
└── global.css             ← Tailwind import + @theme bridge + token imports
```

### Re-skinning the entire site

Change 3 numbers in `primitives.css`:

```css
--hue-primary: 145;    /* Forest Green → try 250 for Ocean Blue */
--hue-secondary: 85;   /* Leafy yellow-green */
--hue-accent: 45;      /* Warm amber/gold */
```

Every button, card, hero gradient, and shadow transforms automatically.

---

## Features

- **Dark/Light Theme** — Toggle via `data-theme` attribute; semantic tokens remap colors
- **Scroll Reveal** — Intersection Observer-based entrance animations with stagger support
- **Animated Counters** — Stats count up when scrolled into view
- **Glassmorphism Cards** — Backdrop blur + translucent backgrounds via component tokens
- **Particle Hero** — Floating OKLCH-derived gradient orbs with keyframe animations
- **Responsive** — Mobile-first, fluid typography with `clamp()`
- **Reduced Motion** — All animations respect `prefers-reduced-motion` via global token override

---

## Project Structure

```
src/
├── components/
│   ├── Card.astro              ← Reusable card (glass/solid variants)
│   ├── DonationForm.astro      ← Multi-tier donation form
│   ├── Footer.astro
│   ├── Hero.astro              ← Gradient hero with particle orbs
│   ├── Nav.astro               ← Sticky nav with blur backdrop
│   ├── StatsCounter.astro      ← Animated number counters
│   ├── TeamGrid.astro          ← Team member cards
│   ├── Testimonials.astro      ← Donor testimonial carousel
│   ├── ThemeSwitcher.astro     ← Dark/light toggle
│   └── Timeline.astro          ← Milestone timeline
├── layouts/
│   └── Base.astro              ← Global layout, SEO meta, script loading
├── pages/
│   ├── index.astro
│   ├── about.astro
│   └── donate.astro
├── scripts/
│   ├── counter-animation.js
│   ├── scroll-reveal.js
│   └── theme-switcher.js
└── styles/
    └── tokens/                 ← Design token architecture (see above)
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
