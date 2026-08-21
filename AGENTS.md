# OKLCH Design Token Architecture — Astro + Tailwind v4

## Core Principle

**Zero hardcoded visual values in components/pages/layouts.** Every color, spacing, font size, radius, shadow, timing MUST reference CSS custom property (`var(--token-name)`). Only token files in `src/styles/tokens/` contain raw `oklch()`, px, or timing values.

Tailwind v4 `@theme` reads our CSS vars → auto-generates utility classes. **Token files = single source of truth** — Tailwind = utility layer on top.

---

## Mandatory Discovery Phase

**BEFORE writing any CSS for new project**, ask user:

1. **Brand Hue** — primary hue angle (0-360 OKLCH). Ref: 0=red, 30=orange, 60=yellow, 145=green, 200=cyan, 250=blue, 290=purple, 330=pink
2. **Secondary Hue** — complementary hue
3. **Accent Hue** — highlights/CTAs
4. **Chroma** — vivid/saturated or muted/earthy?
5. **Font Pairing** — display font (headings) + body font
6. **Motion Style** — snappy, smooth/elegant, or playful/bouncy?

Populate `primitives.css` with answers. No placeholders.

---

## Architecture: 3-Tier Tokens + Tailwind v4

### File Structure (Mandatory)

```
src/styles/
├── tokens/
│   ├── primitives.css       ← TIER 1: Raw OKLCH values (the ONE file to change)
│   ├── semantic.css         ← TIER 2: Maps primitives to meaning
│   ├── components.css       ← TIER 3: Maps semantics to component roles
│   └── animation.css        ← Motion tokens (durations, easings)
├── base.css                 ← Resets, typography classes, utilities
└── app.css                  ← Main entry: Tailwind import + @theme + token imports
```

### Main Entry: `app.css`

```css
/* 1. Import Tailwind */
@import "tailwindcss";

/* 2. Import token layers (order matters) */
@import './tokens/primitives.css';
@import './tokens/semantic.css';
@import './tokens/components.css';
@import './tokens/animation.css';
@import './base.css';

/* 3. Feed our tokens into Tailwind's @theme */
@theme {
  /* Colors — Tailwind auto-generates bg-primary, text-primary, border-primary, etc. */
  --color-primary: var(--color-primary);
  --color-on-primary: var(--color-on-primary);
  --color-primary-container: var(--color-primary-container);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
  --color-surface: var(--color-surface);
  --color-on-surface: var(--color-on-surface);
  --color-background: var(--color-background);
  --color-on-background: var(--color-on-background);
  --color-outline: var(--color-outline);
  --color-error: var(--color-error);

  /* Spacing — Tailwind auto-generates p-md, gap-lg, m-xl, etc. */
  --spacing-2xs: var(--space-2xs);
  --spacing-xs: var(--space-xs);
  --spacing-sm: var(--space-sm);
  --spacing-md: var(--space-md);
  --spacing-lg: var(--space-lg);
  --spacing-xl: var(--space-xl);
  --spacing-2xl: var(--space-2xl);
  --spacing-3xl: var(--space-3xl);
  --spacing-4xl: var(--space-4xl);
  --spacing-5xl: var(--space-5xl);

  /* Border radius */
  --radius-xs: var(--radius-xs);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
  --radius-full: var(--radius-full);

  /* Font families */
  --font-display: var(--font-family-display);
  --font-body: var(--font-family-body);

  /* Font sizes — fluid clamp() values */
  --text-xs: var(--font-size-xs);
  --text-sm: var(--font-size-sm);
  --text-base: var(--font-size-base);
  --text-md: var(--font-size-md);
  --text-lg: var(--font-size-lg);
  --text-xl: var(--font-size-xl);
  --text-2xl: var(--font-size-2xl);
  --text-3xl: var(--font-size-3xl);
  --text-hero: var(--font-size-hero);

  /* Shadows */
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
}
```

Usage:
```html
<!-- Tailwind utilities resolve to OKLCH tokens -->
<button class="bg-primary text-on-primary rounded-full px-lg py-sm font-display font-semibold shadow-md hover:bg-primary/80 transition-all">
  Donate Now
</button>
```

Change `--hue-primary: 145` in primitives → button + everything transforms.

### Dark Mode With Tokens

Tailwind v4 `dark:` variant works automatically. Our `semantic.css` remaps colors for `[data-theme="dark"]` — CSS vars resolve to dark values. Tailwind reads current var value.

Fonts: Start Google Fonts `@import` in dev. Self-host once finalized (download to `public/fonts/`, use `@font-face`).

---

## Tier 1: Primitives (`primitives.css`)

SINGLE SOURCE OF TRUTH. All raw values here only.

### Required Sections

```css
:root {
  /* HUE ANCHORS — primary control knobs */
  --hue-primary: <number>;
  --hue-secondary: <number>;
  --hue-accent: <number>;
  --hue-error: 25;

  /* CHROMA LEVELS */
  --chroma-vivid: 0.18;
  --chroma-moderate: 0.12;
  --chroma-muted: 0.06;
  --chroma-subtle: 0.03;
  --chroma-none: 0;

  /* PRIMARY COLOR SCALE — oklch(lightness chroma hue) */
  --primary-10: oklch(0.20 var(--chroma-vivid) var(--hue-primary));
  --primary-20: oklch(0.30 var(--chroma-vivid) var(--hue-primary));
  --primary-30: oklch(0.40 var(--chroma-vivid) var(--hue-primary));
  --primary-40: oklch(0.50 var(--chroma-vivid) var(--hue-primary));
  --primary-50: oklch(0.60 var(--chroma-vivid) var(--hue-primary));
  --primary-60: oklch(0.70 var(--chroma-vivid) var(--hue-primary));
  --primary-70: oklch(0.80 var(--chroma-vivid) var(--hue-primary));
  --primary-80: oklch(0.85 var(--chroma-moderate) var(--hue-primary));
  --primary-90: oklch(0.92 var(--chroma-muted) var(--hue-primary));
  --primary-95: oklch(0.96 var(--chroma-subtle) var(--hue-primary));
  --primary-99: oklch(0.99 var(--chroma-subtle) var(--hue-primary));

  /* SECONDARY, ACCENT, NEUTRAL, ERROR scales — same pattern */

  /* SPACING PRIMITIVES */
  --space-unit: 4px;

  /* TYPOGRAPHY PRIMITIVES */
  --font-family-display: '<display-font>', system-ui, sans-serif;
  --font-family-body: '<body-font>', system-ui, sans-serif;
  --font-size-base: 16px;

  /* BORDER RADIUS PRIMITIVES */
  --radius-unit: 4px;
}
```

### Neutral Scale

Neutrals MUST tint with `--hue-primary` for cohesion:

```css
--neutral-10: oklch(0.20 var(--chroma-subtle) var(--hue-primary));
```

### `@property` Registration

Register hue vars for animation:

```css
@property --hue-primary {
  syntax: "<number>";
  inherits: true;
  initial-value: <the-chosen-hue>;
}
```

### Dark Theme Override

Dark mode ONLY changes lightness + chroma. Hue stays same:

```css
[data-theme="dark"] {
  --chroma-vivid: 0.16;  /* slightly reduce */
  /* Override specific neutral steps for darker base */
}
```

---

## Tier 2: Semantic (`semantic.css`)

Maps primitives to roles. Material Design 3 naming.

### Required Token Groups

```css
:root {
  /* Color roles */
  --color-primary: var(--primary-40);
  --color-on-primary: var(--neutral-100);
  --color-primary-container: var(--primary-90);
  --color-on-primary-container: var(--primary-10);
  --color-secondary: var(--secondary-40);
  --color-accent: var(--accent-50);
  --color-surface: var(--neutral-100);
  --color-on-surface: var(--neutral-10);
  --color-background: var(--neutral-98);
  --color-on-background: var(--neutral-10);
  --color-outline: var(--neutral-50);
  --color-outline-variant: var(--neutral-80);
  --color-error: var(--error-40);

  /* Typography scale — fluid clamp() */
  --font-size-xs through --font-size-hero using clamp()

  /* Spacing scale — derived from --space-unit */
  --space-2xs through --space-5xl

  /* Border radius scale */
  --radius-xs through --radius-full

  /* Shadows — OKLCH-tinted */
  --shadow-sm/md/lg/xl using oklch() with var(--hue-primary)

  /* Layout */
  --max-width: 1200px;
}
```

### Dark Theme Semantic Swap

```css
[data-theme="dark"] {
  --color-primary: var(--primary-80);      /* Light on dark */
  --color-on-primary: var(--primary-20);
  --color-surface: var(--neutral-10);      /* Near-black */
  --color-on-surface: var(--neutral-90);
  --color-background: var(--neutral-5);
  /* Deeper shadows */
}
```

---

## Tier 3: Components (`components.css`)

Every component gets own token group. Components ONLY consume these.

### Required Token Groups

- **Button**: `--button-bg`, `--button-text`, `--button-hover-bg`, `--button-active-bg`, `--button-radius`, `--button-padding-x/y`, `--button-font-size`, `--button-font-weight`, `--button-shadow`, `--button-transition`
- **Card**: `--card-bg`, `--card-text`, `--card-border`, `--card-radius`, `--card-padding`, `--card-shadow`, `--card-hover-shadow`, `--card-hover-translate-y`
- **Glass**: `--glass-bg`, `--glass-blur`, `--glass-border`, `--glass-shadow`
- **Nav**: `--nav-bg`, `--nav-blur`, `--nav-border`, `--nav-text`, `--nav-height`, `--nav-link-hover`
- **Input**: `--input-bg`, `--input-text`, `--input-border`, `--input-border-focus`, `--input-radius`, `--input-padding-x/y`, `--input-focus-ring`
- **Footer**: `--footer-bg`, `--footer-text`, `--footer-heading`, `--footer-link-hover`
- **Badge**: `--badge-bg`, `--badge-text`, `--badge-radius`
- **Section**: `--section-bg-alt`, `--section-heading-color`, `--section-subheading-color`
- **Hero**: `--hero-gradient-start/mid/end`, `--hero-text`, `--hero-padding-y`, `--hero-min-height`

Building NEW component → create token group in `components.css` first, then use in component.

---

## Animation Tokens (`animation.css`)

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
  --duration-slowest: 1200ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --motion-scale: 1;
  --hover-scale: 1.02;
  --active-scale: 0.98;
  --hover-duration: var(--duration-fast);
  --hover-ease: var(--ease-standard);
  --reveal-distance: 30px;
  --reveal-duration: var(--duration-slow);
  --reveal-ease: var(--ease-decelerate);
  --reveal-stagger: 80ms;
}
```

### Reduced Motion (Required)

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-scale: 0;
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
    --duration-slowest: 0ms;
    --reveal-distance: 0px;
    --hover-scale: 1;
    --active-scale: 1;
  }
}
```

Components MUST NOT have own `@media (prefers-reduced-motion)`. Handled globally.

---

## Styling: Utility-First + Escape Hatches

### Utilities in templates for most styling:

```html
<!-- ✅ CORRECT: Utility classes in template -->
<div class="bg-primary text-on-primary rounded-xl p-lg shadow-md">
  <h2 class="font-display text-2xl font-bold">Title</h2>
  <p class="text-sm text-on-surface/70">Description</p>
</div>
```

### `@apply` ONLY for complex states (5+ properties):

```css
/* ✅ CORRECT: @apply for complex hover/focus/active */
.btn-primary {
  @apply bg-primary text-on-primary rounded-full px-lg py-sm font-display font-semibold shadow-md;
  transition: all var(--duration-fast) var(--ease-standard);
}
.btn-primary:hover {
  @apply shadow-lg;
  background: var(--button-hover-bg);
  transform: scale(var(--hover-scale));
}
.btn-primary:active {
  background: var(--button-active-bg);
  transform: scale(var(--active-scale));
}
```

### NEVER `@apply` for trivial styles:

```css
/* ❌ VIOLATION */
.title { @apply text-lg font-bold; }

/* ✅ Use utilities in template */
<h2 class="text-lg font-bold">Title</h2>
```

### When to use which:

| Scenario | Approach |
|----------|----------|
| Simple layout/color/spacing | Utility classes in template |
| 5+ interactive states | `@apply` in `<style>` |
| Glassmorphism/complex effects | `@apply` + `var()` in `<style>` |
| Keyframe animations | Raw CSS in `<style>` using animation tokens |
| One-off structural | Utility classes |

---

## Violations

### NEVER in components/pages/layouts:

```css
/* ❌ Hardcoded color */
.button { background: #2d8f4e; }
.button { @apply bg-[#2d8f4e]; }

/* ❌ Hardcoded spacing */
.card { padding: 24px; }
.card { @apply p-[24px]; }

/* ❌ Hardcoded timing */
.card { transition: all 0.3s ease; }

/* ❌ Hardcoded radius */
.card { border-radius: 12px; }

/* ❌ Hardcoded shadow */
.card { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

/* ❌ Tailwind arbitrary values for tokens */
<div class="bg-[oklch(0.5_0.18_145)]">  <!-- Use bg-primary instead -->
<div class="p-[24px]">                   <!-- Use p-lg instead -->
```

### ALWAYS:

```css
/* ✅ Tailwind utilities from @theme */
<div class="bg-primary p-lg rounded-xl shadow-md">

/* ✅ var() references in @apply or <style> */
.card { background: var(--card-bg); }
.card { @apply bg-surface rounded-xl shadow-md p-lg; }
```

### Allowed Exceptions (structural, not visual)

- `position`, `display`, `flex-direction`, `align-items`, `justify-content`
- `grid-template-columns` layout definitions
- `z-index` values
- `w-full`, `h-full`, `inset-0`, `opacity-0/100`
- `pointer-events`, `overflow`, `cursor`
- `1px` for borders (COLOR must still be token)
- Tailwind arbitrary for ONE-OFF structural: `w-[calc(100%-2rem)]`

---

## Astro Component Convention

### Layout

`src/layouts/Base.astro` — imports `app.css` via `<style is:global>`, includes scripts for theme-switcher/scroll-reveal/counter-animation, accepts `title`+`description` props for SEO.

### Components

1. Use Tailwind utilities in templates for simple styling
2. `<style>` with `@apply` only for complex multi-state interactions
3. `var(--token-name)` for values not available as Tailwind utility
4. NEVER import token CSS directly — flows from layout
5. JS reads animation values from CSS:
   ```js
   const duration = parseInt(getComputedStyle(document.documentElement)
     .getPropertyValue('--duration-slowest'));
   ```

### Theme Switching

```js
document.documentElement.setAttribute('data-theme', 'dark');
```
CSS selectors in token files handle rest. No JS color logic.

---

## Tailwind v4 Setup for Astro

### Install

```bash
npx astro add tailwind
```

### Astro Config

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

No `tailwind.config.js` needed. TW v4 = CSS-first. All config in `app.css` via `@theme`.

---

## Base CSS Patterns (base.css)

### Scroll Reveal (Required)

```css
.reveal {
  opacity: 0;
  transform: translateY(var(--reveal-distance));
  transition: 
    opacity var(--reveal-duration) var(--reveal-ease),
    transform var(--reveal-duration) var(--reveal-ease);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Skeleton Loading (Required)

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--color-surface-container) 0%,
    var(--color-surface-container-high) 50%,
    var(--color-surface-container) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer var(--duration-slowest) var(--ease-standard) infinite;
}
```

---

## Verification Checklist

After ANY styling change, run:

```bash
# Must return ZERO results — no hardcoded colors in components:
grep -rnE '(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|oklch\()' src/components/ src/pages/ src/layouts/

# Check for hardcoded pixel values in styling (spacing/radius/shadow):
grep -rnE '(padding|margin|gap|border-radius|box-shadow):\s*[0-9]+px' src/components/ src/pages/ src/layouts/

# Check for hardcoded timing:
grep -rnE 'transition:.*[0-9]+\.?[0-9]*(ms|s)\b' src/components/ src/pages/ src/layouts/

# Check for Tailwind arbitrary color values (should use token utilities instead):
grep -rnE 'bg-\[#|text-\[#|border-\[#|bg-\[oklch|text-\[oklch' src/components/ src/pages/ src/layouts/
```

Any results = VIOLATION. Fix with token-backed Tailwind utilities or `var()`.

Post-check:
- Theme switcher works (light → dark)
- No visual breakage on theme switch
- `prefers-reduced-motion` disables all animations

---

## Reference

| File | Purpose |
|------|---------|
| `tokens/primitives.css` | Raw OKLCH values, hue anchors, scales |
| `tokens/semantic.css` | MD3 role mapping |
| `tokens/components.css` | Per-component token groups |
| `tokens/animation.css` | Motion tokens + reduced motion |
| `base.css` | Reset, typography, reveal, skeleton |
| `app.css` | Tailwind import + @theme bridge + token imports |
| `*.astro` components | Utility-first + @apply escape hatches |
