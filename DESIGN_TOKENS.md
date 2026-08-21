# OKLCH Design Tokens — The Complete Mental Model

> **One file. One number. Entire site transforms.**
> This guide explains the architecture you just built.

---

## What Are Design Tokens?

Design tokens are **named constants** for visual properties (colors, spacing, typography, motion). Instead of writing `background: #2d8f4e` in a button, you write `background: var(--button-bg)`.

**The difference?**
```css
/* ❌ WITHOUT TOKENS — Hardcoded chaos */
.button { background: #2d8f4e; }       /* some green? */
.card   { border: 1px solid #e0e0e0; } /* what gray? */
.hero   { background: #f0fdf4; }       /* hopefully matches... */

/* ✅ WITH TOKENS — Single source of truth */
.button { background: var(--button-bg); }
.card   { border: 1px solid var(--card-border); }
.hero   { background: var(--hero-gradient-start); }
```

Now change ONE variable and everything updates. No find-and-replace across 50 files.

---

## Why OKLCH Instead of HSL or Hex?

### The Perceptual Uniformity Problem

```
HSL:  hsl(120, 80%, 50%)  → BRIGHT GREEN (looks vivid)
HSL:  hsl(240, 80%, 50%)  → DARK BLUE (looks much darker!)
```
Same saturation and lightness, but they look completely different. HSL lies about brightness.

```
OKLCH: oklch(0.65 0.18 145) → Green (perceived brightness: 65%)  
OKLCH: oklch(0.65 0.18 250) → Blue  (perceived brightness: 65%)
```
These look the SAME brightness. That's perceptual uniformity.

### Why This Matters for Tokens

When you rotate the hue from 145 (green) to 250 (blue), every color on your site shifts — and they ALL maintain the same visual weight. No color looks "broken." This is impossible with HSL.

### OKLCH Channels

```
oklch(L C H)
       │ │ │
       │ │ └── HUE: 0–360 color wheel position
       │ └──── CHROMA: 0–0.4 how vivid (0 = gray)  
       └────── LIGHTNESS: 0–1 brightness (0 = black, 1 = white)
```

---

## The 3-Tier Architecture

```
┌─────────────────────────────────────────────┐
│  TIER 1: PRIMITIVES                         │
│  "What are the raw values?"                 │
│                                             │
│  --hue-primary: 145;                        │
│  --primary-40: oklch(0.50 0.18 145)         │
│                                             │
│  📁 tokens/primitives.css                   │
├─────────────────────────────────────────────┤
│  TIER 2: SEMANTIC                           │
│  "What does this color mean?"               │
│                                             │
│  --color-primary: var(--primary-40)         │
│  --color-surface: var(--neutral-100)        │
│                                             │
│  📁 tokens/semantic.css                     │
├─────────────────────────────────────────────┤
│  TIER 3: COMPONENT                          │
│  "What component uses this?"                │
│                                             │
│  --button-bg: var(--color-primary)          │
│  --card-surface: var(--color-surface)       │
│                                             │
│  📁 tokens/components.css                   │
└─────────────────────────────────────────────┘
         │
         ▼
  Components ONLY use var(--button-bg), etc.
  They NEVER reference oklch(), #hex, or rgb().
```

### Why 3 Tiers Instead of 1?

**Scenario:** You decide buttons should use the secondary color instead of primary.

- **With 1 tier:** Find every button in every component, change the color.
- **With 3 tiers:** Change one line in `components.css`:
  ```css
  --button-bg: var(--color-secondary); /* was var(--color-primary) */
  ```
  Done. Every button on every page updates.

---

## How Themes Work

### The Light/Dark Switch

Dark mode doesn't add new colors. It remaps WHICH lightness step each role uses:

```css
/* Light mode (default) */
:root {
  --color-primary: var(--primary-40);  /* Dark green on light bg */
  --color-surface: var(--neutral-100); /* White background */
}

/* Dark mode */
[data-theme="dark"] {
  --color-primary: var(--primary-80);  /* Light green on dark bg */
  --color-surface: var(--neutral-10);  /* Near-black background */
}
```

**The hue (145) never changes.** Only which lightness level gets used.

### High Contrast Mode

```css
[data-theme="high-contrast"] {
  --chroma-vivid: 0.24;  /* MORE vivid for visibility */
  /* Push extremes further apart */
  --color-surface: var(--neutral-100);
  --color-on-surface: var(--neutral-0);
}
```

### How the Theme Switcher Works

```js
// This is ALL the JS does:
document.documentElement.setAttribute('data-theme', 'dark');
```

That's it. The CSS selectors like `[data-theme="dark"]` in `primitives.css` and `semantic.css` automatically activate the right token overrides. No JavaScript color logic.

---

## The Hue Rotation Demo

This is the "wow" moment. In `primitives.css`:

```css
@property --hue-primary {
  syntax: "<number>";
  inherits: true;
  initial-value: 145;
}

[data-hue-shift="true"] {
  animation: hue-rotate 8s linear infinite;
}

@keyframes hue-rotate {
  0%   { --hue-primary: 145; } /* Green */
  25%  { --hue-primary: 200; } /* Blue */
  50%  { --hue-primary: 45;  } /* Gold */
  75%  { --hue-primary: 320; } /* Purple */
  100% { --hue-primary: 145; } /* Green */
}
```

Because EVERY color in the system references `var(--hue-primary)`:
```css
--primary-40: oklch(0.50 var(--chroma-vivid) var(--hue-primary));
```

When the hue animates, EVERY element that uses any primary color changes. Buttons, cards, gradients, avatars, nav links — all of it. Automatically. No per-component animation code.

---

## Animation Tokens

Motion is ALSO tokenized:

```css
/* In animation.css */
--duration-fast: 150ms;
--ease-standard: cubic-bezier(0.2, 0, 0, 1);

/* In a component */
.button {
  transition: background var(--duration-fast) var(--ease-standard);
}
```

### Reduced Motion — One Line Fix

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-scale: 0;
    --duration-fast: 0ms;
    --reveal-distance: 0px;
  }
}
```

Every animation on the entire site stops. No per-component media queries needed.

---

## Rules for Developers

### ✅ DO
- Always use `var(--token-name)` for colors, spacing, radii, shadows, and timing
- Add new component tokens to `components.css` when building new components
- Keep primitives in `primitives.css` — that's the ONE file to change the brand

### ❌ DON'T
- Never write `#hex`, `rgb()`, `oklch()`, or pixel values in components
- Never use `@media (prefers-reduced-motion)` in components — it's global
- Never reference Tier 1 tokens directly in components (use Tier 3)

### Quick Verification
```bash
# This should return ZERO results:
grep -rnE '(#[0-9a-f]{3,8}|rgb\(|oklch\()' src/components/ src/pages/
```

---

## Applying This to Your Projects

### Step 1: Audit existing colors
```bash
grep -rnE '#[0-9a-f]{3,8}|rgb\(' src/
```

### Step 2: Create the 3 token files
Copy the `tokens/` directory structure from this project.

### Step 3: Define your brand hue
```css
--hue-primary: 220; /* Your brand's hue angle */
```

### Step 4: Systematically replace hardcoded values
For each hardcoded color, create a semantic token, then a component token.

### Step 5: Verify
Build, switch themes, rotate hues. If anything breaks, something is still hardcoded.

---

## File Reference

| File | Role | Who Changes It |
|------|------|---------------|
| `tokens/primitives.css` | Raw OKLCH values, hues, chroma | Designer / Brand team |
| `tokens/semantic.css` | Meaning mapping | Design system team |
| `tokens/components.css` | Component roles | Component developers |
| `tokens/animation.css` | Motion tokens | UX/Motion designer |
| `base.css` | Resets, typography, utilities | Rarely changed |
| `global.css` | Import orchestration | Almost never changed |
| `*.astro` components | UI structure | Frontend developers |

---

*Built as a teaching project. The architecture scales from 3 pages to 300.*
