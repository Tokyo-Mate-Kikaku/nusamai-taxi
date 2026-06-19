# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for 福祉タクシーぬさまい (Welfare Taxi Nusamai), a private ambulance and welfare taxi service in Mashiko Town, Tochigi Prefecture. No build tool, no framework, no package manager — open HTML files directly in a browser.

## Structure

```
/               ← original site (do not overwrite without explicit instruction)
css/style.css
js/main.js
index.html, about.html, guide.html, price.html, faq.html

claude-designed/ ← redesigned version with 柿渋 accent and Shippori Mincho B1
css/style.css
js/main.js
index.html, about.html, guide.html, price.html, faq.html
```

Design changes should go into `claude-designed/` unless the user explicitly asks to update the originals.

## CSS Architecture

Both versions use CSS Custom Properties as the entire design token system — no preprocessor. All color, type, spacing, and shadow values come from `:root` variables. Change a token once to affect the whole site.

**Original tokens** (`css/style.css`): `--bg: #ffffff`, `--ink: #1a1a1a`, serif font `Noto Serif JP`.

**Redesigned tokens** (`claude-designed/css/style.css`): `--bg: #FAFAF7`, `--accent: #B85422` (柿渋 persimmon), `--ink: #1A2233`, serif font `Shippori Mincho B1`.

## JavaScript Patterns

`js/main.js` handles three concerns:
1. **Accordion** — aria-expanded toggle; closes siblings in the same `.accordion` group; opens first item by default on page load.
2. **Mobile menu** — `.menu-toggle` toggles `.open` on `.header-nav` and `.header-cta`.
3. **Scroll reveals** (`claude-designed/` only) — `IntersectionObserver` adds `.visible` to `.reveal` elements. Gated under `.js` class added synchronously in `<head>` (`<script>document.documentElement.classList.add('js');</script>`) to prevent FOUC when JS is available.

CSS reveal pattern (in `claude-designed/css/style.css`):
```css
.js .reveal { opacity: 0; transform: translateY(20px); transition: … }
.js .reveal.visible { opacity: 1; transform: none; }
```

## Key Design Decisions

- **Mobile overlap fix**: `.header-cta { display: none !important; }` at 680px — the floating CTA buttons handle mobile contact, so the header CTA is hidden rather than attempting to stack below the nav.
- **`ぬ` watermark**: 460px serif character in `.hero-watermark`, absolutely positioned in `.hero-body`, opacity ~0.045, animated with `@keyframes fadeWatermark`. `aria-hidden="true"` on the element.
- **Accordion expanded border**: uses `box-shadow: inset 3px 0 0 var(--accent)` instead of `border-left` to avoid layout shift.
- **`@media (prefers-reduced-motion: reduce)`** disables all transitions and animations.
