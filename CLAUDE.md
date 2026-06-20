# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for 福祉タクシーぬさまい (Welfare Taxi Nusamai), a private ambulance and welfare taxi service in Mashiko Town, Tochigi Prefecture. No build tool, no framework, no package manager — open HTML files directly in a browser.

## File Structure

```
index.html          ← トップ
guide.html          ← ご利用案内
price.html          ← 料金
about.html          ← 運営者紹介
faq.html            ← よくあるご質問
css/style.css       ← 単一スタイルシート
js/main.js          ← 単一スクリプト
img/logo.jpg        ← ロゴ (42×42px 表示)
img/line_icon.png   ← LINE アイコン画像
```

## CSS Architecture

CSS Custom Properties as the sole design token system (`css/style.css`):

```css
--serif:   'Noto Serif JP', serif      /* 見出し */
--sans:    'Noto Sans JP', sans-serif  /* 本文 */
--mono:    'Lato', sans-serif          /* ラベル・数字・バッジ（等幅ではない） */

--text:    #1a1a1a  /* 本文色 */
--ink:     #1a1a1a  /* ボタン背景・アクセント */
--bg:      #ffffff
--bg-soft: #f7f5f2
--border:  #d6d1cb
```

CDN 依存（各ページ `<head>` に記載）:
- Google Fonts: `Noto+Serif+JP`, `Noto+Sans+JP`, `Lato`
- Google Material Icons: `https://fonts.googleapis.com/icon?family=Material+Icons`

## JavaScript Patterns (`js/main.js`)

1. **Accordion** — `aria-expanded` toggle; 同グループの他アイテムを閉じる; ページロード時に最初のアイテムを開く
2. **Mobile menu** — `.menu-toggle` が `.header-nav` と `.header-cta` に `.open` を付与; nav リンククリックでメニューを閉じる
3. **Copyright year** — `document.getElementById('copyright-year')` に `new Date().getFullYear()` を代入

## Key Design Decisions

- **Logo**: `img/logo.jpg` — `.logo-mark` 内で `42×42px / object-fit: contain` 表示
- **LINE icon**: `img/line_icon.png` を `<img>` で使用（Material Icons ではない）
- **Phone icon**: Material Icons の `call` を `<span class="material-icons">call</span>` で使用
- **`--mono` は Lato**: 等幅ではなくラベル・バッジ・数字に使うアクセントフォントとして運用
- **Floating CTA overlap 対策**: `.site-footer { padding: 40px 0 160px }` — 固定 CTA（56px×2 + gap + margin ≒ 144px）との重なりを防ぐ
- **Accordion expanded border**: `box-shadow: inset 3px 0 0` を使用（`border-left` はレイアウトシフトを起こすため）
- **Copyright fallback**: `<span id="copyright-year">2026</span>` — JS 非対応環境のフォールバック
- **noindex**: 全ページに `<meta name="robots" content="noindex">` — クライアント確認用サイト

## Responsive Breakpoints

- `≤900px`: `grid-3` → 2カラム、`profile-grid` / `estimate-grid` / `footer-inner` → 1カラム
- `≤680px`: ヘッダーナビ・CTA 非表示、ハンバーガーメニュー表示; `grid-3` → 1カラム。モバイルの連絡先は `.floating-cta` が担う

## Page Template Pattern

全5ページは同一の header / footer / floating-cta を共有。ページ固有のナビリンクに `class="current"` を付ける。フッターの `footer-address` は index.html のみ E-mail を含む。
