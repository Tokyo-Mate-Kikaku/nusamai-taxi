# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for 福祉タクシーぬさまい (Welfare Taxi Nusamai), a private ambulance and welfare taxi service in Mashiko Town, Tochigi Prefecture. No build tool, no framework, no package manager — open HTML files directly in a browser.

## Two Versions

```
/                   ← original site
css/style.css
js/main.js
index.html, about.html, guide.html, price.html, faq.html

claude-designed/    ← redesigned version (柿渋 accent, Shippori Mincho B1)
css/style.css
js/main.js
index.html, about.html, guide.html, price.html, faq.html
```

Design changes go into `claude-designed/` unless the user explicitly asks to update the originals.

## CSS Architecture

Both versions use CSS Custom Properties as the sole design token system — no preprocessor.

**Original tokens** (`css/style.css`): `--bg: #ffffff`, `--ink: #1a1a1a`, fonts: Noto Serif JP / Noto Sans JP.

**Redesigned tokens** (`claude-designed/css/style.css`): `--bg: #FAFAF7`, `--accent: #B85422` (柿渋 persimmon), `--ink: #1A2233`, font: Shippori Mincho B1.

## JavaScript Patterns

`js/main.js` handles two concerns (root version):

1. **Accordion** — `aria-expanded` toggle; closes siblings in the same `.accordion` group; opens first item by default on page load.
2. **Mobile menu** — `.menu-toggle` toggles `.open` on `.header-nav` and `.header-cta`; nav links also close the menu on click.

`claude-designed/js/main.js` adds a third concern:

3. **Scroll reveals** — `IntersectionObserver` adds `.visible` to `.reveal` elements. Gated under `.js` class added synchronously in `<head>` to prevent FOUC.

CSS reveal pattern (claude-designed only):
```css
.js .reveal { opacity: 0; transform: translateY(20px); transition: … }
.js .reveal.visible { opacity: 1; transform: none; }
```

## Key Design Decisions

- **Logo**: `img/logo.jpg` (60×60px) displayed in `.logo-mark` at 42×42px via `object-fit: contain`. Root version uses path `img/logo.jpg`; `claude-designed/` uses `../img/logo.jpg`.
- **Mobile overlap fix**: `.header-cta { display: none !important; }` at 680px — floating CTA buttons handle mobile contact.
- **`ぬ` watermark** (`claude-designed/` only): 460px serif character in `.hero-watermark`, opacity ~0.045, animated with `@keyframes fadeWatermark`. `aria-hidden="true"`.
- **Accordion expanded border**: `box-shadow: inset 3px 0 0 var(--accent)` instead of `border-left` to avoid layout shift.
- **`@media (prefers-reduced-motion: reduce)`** disables all transitions and animations.
- **noindex**: All root HTML files have `<meta name="robots" content="noindex">` — site is for client review only.
