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
img/logo.jpg            ← ロゴ (42×42px)。赤を解析し --brand の起点に
img/LINE_Brand_icon.png ← LINE 公式アイコン（ヘッダー/フローティング用）
img/fv_pc_dummy.png     ← トップ FV（PC・横長／仮）
img/fv_sp_dummy.png     ← トップ FV（SP・縦長／仮）
img/profile_dummy.png   ← 代表写真（about カバー・プロフィール欄／仮・生成AI）
img/{medical_equips,strecher,wheelchair}.png ← 仮素材（未配置）
img/line_icon.png       ← 旧 LINE アイコン（現在は未使用）
```

実画像は profile_dummy / fv_*_dummy のみ配置済み。それ以外（車両・設備等）は CSS の斜線プレースホルダー（`.img-ph` 等）のまま。

## Previewing & verifying changes

ビルド/テスト/lint なし。ブラウザで HTML を直接開く。視覚確認は Chrome ヘッドレスでスクショ：

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=390,720 --screenshot=/tmp/out.png "file://$(pwd)/index.html"
sips -c <高さ> <幅> --cropOffset <y> <x> /tmp/out.png --out /tmp/crop.png   # 部分切り出し
```

- `sips --cropOffset 0 0` は**中央クロップ**扱いになる。上端を取るなら `--cropOffset 2 0` 等の微小オフセットを使う
- **モバイル幅のスクショは旧 `--headless` だと無効**。旧モードは `--window-size` の幅を**スクショ範囲にしか使わず**、レイアウト viewport は既定（約800px=PC判定）のまま → メディアクエリが効かずハンバーガー等が出ない。モバイル確認は **`--headless=new`** を使う
- **`--window-size` の幅は約 500px が下限**（それ未満を指定しても viewport は 500px に丸められる）。右端の要素（ハンバーガー等）まで写すには **幅を 500 以上**にする（390 等だと右端が画面外に切れる）。`≤680px` 判定の確認には `--window-size=500,<高さ>` が安全
- **モバイルメニュー展開状態**は JS 依存で素のスクショに出ない。一時プレビューを作って撮る（×印は `menu-toggle` の `aria-expanded="true"` で駆動するので、それも併せて書き換える）：
  `sed -e 's/class="header-nav"/class="header-nav open"/' -e 's/class="header-cta"/class="header-cta open"/' -e 's/aria-expanded="false"/aria-expanded="true"/' index.html > _menu_preview.html`（撮影後に削除）

## CSS Architecture

CSS Custom Properties as the sole design token system (`css/style.css`):

益子焼（Mashiko-yaki）の釉薬に接地したパレット。柿釉=brand赤、呉須=accent藍、黒釉=ink墨、糠白=bg-soft。

```css
--serif:      'Shippori Mincho', serif         /* 見出し：旧字系明朝 */
--sans:       'Zen Kaku Gothic New', sans-serif /* 本文：ヒューマニスト */
--mono:       'Lato', sans-serif                /* ラベル・数字・バッジ */

--text:       #2b2724  /* 本文色（暖色寄り墨） */
--ink:        #2e2a27  /* 構造色＝黒釉。フッター背景・ボタン土台 */
--bg:         #ffffff
--bg-soft:    #f4f0e8  /* 糠白釉（nuka）寄りの温白 */
--bg-alt:     #e9e3d8
--border:     #d6d1cb

--brand:      #b53d3f  /* 柿釉（ロゴの赤）＝電話CTA専用アクセント */
--brand-dark: #9a3135  /* 赤ボタン hover */
--accent:      #41497d /* 呉須（赤のトライアド藍）＝見出し署名・ラベル・リンク */
--accent-dark: #353c66
--line:        #06c755 /* LINE 公式グリーン */
--line-dark:   #05a647
```

配色の役割分担: **柿赤＝行動（電話CTA・見出し署名）／呉須藍＝情報（ラベル・リンク・タイムライン）／LINE緑＝LINE導線／墨＝構造**。

CDN 依存（各ページ `<head>` に記載）:
- Google Fonts: `Shippori+Mincho`, `Zen+Kaku+Gothic+New`, `Lato`
- Google Material Icons: `https://fonts.googleapis.com/icon?family=Material+Icons`

## JavaScript Patterns (`js/main.js`)

1. **Accordion** — `aria-expanded` toggle; 同グループの他アイテムを閉じる; ページロード時に最初のアイテムを開く
2. **Mobile menu** — `.menu-toggle` が `.header-nav` と `.header-cta` に `.open` を付与; nav リンククリックで閉じる。**見た目（overlay 化・縦積み）は CSS の `:has(.open)` が担う**（下記 Key Design Decisions 参照）
3. **Copyright year** — `document.getElementById('copyright-year')` に `new Date().getFullYear()` を代入

## Key Design Decisions

- **Logo**: `img/logo.jpg` — `.logo-mark` 内で `42×42px / object-fit: contain` 表示。ロゴの赤を解析し `--brand #b53d3f`（柿釉）として全配色の起点に
- **見出しの署名**: `.section-title::after` に柿釉ブラシのインライン SVG（data URI）を敷く。益子焼の釉がけを想起させる唯一の装飾署名。色は `--brand`
- **LINE icon**: `img/LINE_Brand_icon.png`（公式・緑角丸）を使用。ヘッダー `.header-line`＝緑ベタ＋白文字、フローティング `.floating-line`＝円形トリミングで緑丸ボタン化。**hero / footer-cta の LINE ボタン（`.btn-line`）のみ Material Icons の `chat_bubble`** を使い、電話の `call` とアイコンサイズ（24px）を揃える
- **Phone icon**: Material Icons の `call` を `<span class="material-icons">call</span>` で使用
- **Button system**: `.btn-dark`＝柿赤の主CTA（電話）/ `.btn-line`＝LINE緑 / `.btn-accent`＝呉須藍のゴースト（ナビ「→」リンク）。LINE と「→」リンクは色で峻別
- **Timeline**: 本当に順序のある経歴（about.html）のみ `<ol class="timeline">` で呉須ノード付きの年表に。並列の「3つの理由」は番号を廃し provenance ラベル（消防本部認定 / 建設現場仕込み / 重機操作仕込み）に
- **Mobile menu = overlay（レイアウトシフトなし）**: 展開時 `.header-inner:has(.open)` を `position: absolute` overlay にし、`.site-header { min-height: 68px }` でバー高を確保 → 下のコンテンツを押し下げない。`flex-wrap` + `order` で **CTA→ナビ**の順に縦積み。`.header-logo { min-height: 68px }` でロゴの縦シフトを防止。ナビ文字は PC 13px（横並び維持のため `white-space: nowrap`）／モバイル展開時のみ 16px
- **柔らかい曲線の区切り** (`.wave-down`): CSS mask の SVG 波で、soft↔白セクション境界に「ところどころ」適用。色は上セクションの地色（`--wave-color` で上書き可。faq は白→soft なので `var(--bg)`）。柿釉ブラシと同じ手仕事の揺らぎを非対称パスで
- **page-hero 呉須版** (`.page-hero-accent`): guide / price のみ。`--accent-dark` 背景＋斜めハッチ（白2.8%）＋右上 radial 光沢＋白文字で、続くセクションと色差。faq は通常の糠白 `.page-hero`
- **Hero FV / 写真**: トップ FV は `<picture>` で PC(`fv_pc_dummy`)/SP(`fv_sp_dummy`) を出し分け。about カバー・プロフィール欄は `profile_dummy` を `background-image: cover` で表示。service-icon は土色(`--bg-alt`)丸＋呉須グリフ
- **LINE link**: 全 LINE 導線（ヘッダー/ヒーロー/フッターCTA/フローティング・全16箇所）は `https://lin.ee/9xXF9nc`（`target="_blank" rel="noopener noreferrer"`）。電話は `tel:08047694071`
- **`--mono` は Lato**: 等幅ではなくラベル・バッジ・数字に使うアクセントフォントとして運用
- **Floating CTA overlap 対策**: `.site-footer { padding: 40px 0 160px }` — 固定 CTA（56px×2 + gap + margin ≒ 144px）との重なりを防ぐ
- **Accordion expanded border**: `box-shadow: inset 3px 0 0` を使用（`border-left` はレイアウトシフトを起こすため）
- **Copyright fallback**: `<span id="copyright-year">2026</span>` — JS 非対応環境のフォールバック
- **noindex**: 全ページに `<meta name="robots" content="noindex">` — クライアント確認用サイト

## Responsive Breakpoints

- `≤900px`: `grid-3` → 2カラム、`profile-grid` / `estimate-grid` / `footer-inner` → 1カラム
- `≤680px`: ヘッダーナビ・CTA は素では非表示、ハンバーガー展開で overlay（`:has(.open)`）表示; `grid-3` → 1カラム。常時表示の連絡先は `.floating-cta` が担う

## Page Template Pattern

全5ページは同一の header / footer / floating-cta を共有。ページ固有のナビリンクに `class="current"` を付ける。フッター `footer-address` は全ページ 郵便番号＋TEL のみ（E-mail は削除済み）。

- **FAQ ラベルの使い分け**: ヘッダー/フッターのナビリンクは「**よくある質問**」、faq ページ自身の `<title>`/`<h1>`/meta description は「**よくあるご質問**」（ナビは簡潔に、文書見出しは正式表記）
- **page-hero**: 中ページの見出し帯は `.page-hero`。guide / price は `.page-hero-accent` を併記して呉須ブルー化、about は `.about-cover`（大判写真）、faq は通常版
