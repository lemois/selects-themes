# Docomo テーマ ポート計画

## 概要

`selects-app-gift` の React ベース docomo テーマを、`selects-themes` の Alpine.js ベースの実装にポートする。

## ポート元

- リポジトリ: `../selects-app-gift`
- 主要ファイル:
  - `src/components/pages/s/DocomoIndex.tsx` (1,112行) - トップページ
  - `src/components/molecules/DocomoExtraComment.tsx` - エクストラコメント（2人分）
  - `src/assets/docomo/` - 画像アセット

## 成果物

```
themes/web/docomo/
├── index.html                    # トップページ
├── meta.json                     # テーマメタデータ
├── schema.json                   # 空（設定パラメータなし）
├── assets/
│   ├── style.css                 # スタイルシート
│   ├── theme.js                  # Alpine.js 初期化・アニメーション制御
│   ├── key-visual-bg-pc.jpg      # KV背景（PC）
│   ├── key-visual-bg-sp.jpg      # KV背景（SP）
│   ├── key-visual-pc-text-back.png
│   ├── key-visual-pc-text-front.png
│   ├── key-visual-sp-text-back.png
│   ├── key-visual-sp-text-front.png
│   ├── card-pc-1.jpg ~ card-pc-3.jpg
│   ├── card-sp-1.jpg ~ card-sp-3.jpg
│   ├── letter-pc-body.png
│   ├── letter-pc-text.png
│   ├── letter-sp-body.png
│   ├── letter-sp-text.png
│   ├── message-heading-pc.svg    # メッセージセクション見出し（PC）
│   ├── message-heading-sp.svg    # メッセージセクション見出し（SP）
│   ├── comment-photo.jpg         # エクストラコメント写真1
│   ├── comment-photo-2.jpg       # エクストラコメント写真2
│   └── bubble-tail.svg           # 吹き出しの尻尾
└── catalog-items/
    └── [id].html → ../../generic/catalog-items/[id].html  # シンボリックリンク
```

※ 以下のアセットは不要（enquete用 or 未使用）: `check.svg`, `enquete-header-logo.svg`, `enquete-logo.svg`, `comment-photo-3.jpg`

## SDK 統合パターン

generic テーマの実装に準拠:

```
// index.html での初期化
<main data-docomo-index-root>
  <div x-data="params" x-init="window.selectsInit($el.closest('[data-docomo-index-root]'), $data)">
    ...ヒーロー / カードセクション...
  </div>
  <div x-data="items" x-init="$watch('data', (v) => v && $nextTick(() => window.selectsInitItems($el.closest('[data-docomo-index-root]'), $data)))">
    ...商品一覧グリッド...
  </div>
</main>
<script>window.Alpine.start()</script>
```

- `params`: テーマ設定（今回は schema が空なのでほぼ空）
- `items`: カタログデータ（`loading`, `error`, `data`, `sections` を持つ）
- `utils`: ユーティリティ関数

## トップページ構成

### 1. キービジュアル（ヒーロー）

**共通:**
- テキストレイヤー2枚（back: `mix-blend-mode: multiply`, front: 通常）
- `slowPan` アニメーション: background-position を `left center` → `right center`, 30s linear

**SP（< 768px）:**
- 高さ: `100vh` / `100svh`
- 背景: `key-visual-bg-sp.jpg` cover
- テキストサイズ: 279px × 325px
- 下部テキスト: 「お好きな商品をひとつお選びください」14px, 白, 120px高
- スクロールインジケーター: シェブロン（45deg回転ボーダー）, `indicate` アニメーション 3.5s ease-in-out infinite

**PC（≥ 768px）:**
- 高さ: 900px, max-width: 1200px
- 背景: `key-visual-bg-pc.jpg` cover, center
- padding: 80px 20px 128px
- margin-bottom: 80px
- テキストサイズ: 389px × 465px, top: 184px
- 下部テキスト: 17px, 154px高

### 2. レターカード（3枚）

**SP:**
- フルビューポートセクション × 3（KV の後に続く）
- 各セクション: `height: 100vh/100dvh`, flex center, padding: 20px
- `scroll-snap-align: start`, `scroll-snap-stop: always`
- カード幅: `(window.innerHeight - 200) / 1.25` で計算
- カード背景: `card-sp-1/2/3.jpg`, contain, aspect-ratio ~1.25
- スクロールで表示されたときにレターアニメーション発火（IntersectionObserver で代替）

**PC:**
- 3カード横並び: flex, 各 `flex-grow: 1; width: 0`
- max-width: 1200px
- カード間マージン: 60px（最後のカード除く）
- カード背景: `card-pc-1/2/3.jpg`, contain, aspect-ratio ~1.25
- **ホバー**でレターアニメーション発火

**レター要素（封筒）:**
- SP: position absolute, bottom -72px, right 0, 186px × 111px, `letter-sp-body.png`
- PC: position absolute, bottom -68px, right -14px, 179px × 103px, `letter-pc-body.png`
- テキストレイヤー: `letter-sp-text.png` / `letter-pc-text.png`

### 3. レターアニメーション（統合キーフレーム）

```
@keyframes letterPopIn {
  /* Phase 1: ポップイン 0-400ms */
  0%   { transform: translate(120px, 80px) scale(0) rotate(0deg); opacity: 0 }
  30.77% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1 }
  /* cubic-bezier(0.34, 1.56, 0.64, 1) ← バウンスイージング */

  /* Phase 2: 待機 400-700ms */
  53.85% { transform: translate(0, 0) scale(1) rotate(0deg) }

  /* Phase 3: ウォブル 700-1100ms */
  61.54% { rotate: -8deg }
  69.23% { rotate: 8deg }
  76.92% { rotate: -4deg }
  84.62% { rotate: 4deg }

  /* 完了 */
  100% { transform: translate(0, 0) scale(1) rotate(0deg) }
}
/* duration: 1.3s */

@keyframes letterTextFadeIn {
  from { opacity: 0 } to { opacity: 1 }
}
/* duration: 0.3s, delay: 1.3s, ease-out */
```

### 4. モーダル

**SP:**
- フルスクリーン, `createPortal` の代わりに DOM 直接操作
- オーバーレイ: background #cc0033, `overlayFadeIn` 0.2s linear (opacity 0→0.2)
- コンテンツ: `modalSlideUp` 0.2s ease-out (translateY 100%→0)
- 閉じるボタン: 30px×30px 白X, margin-right 20px, margin-top 35px
- テキストコンテナ: background rgba(255,255,255,0.97), border-radius 12px, padding 25px
- フォントサイズ: 14px, line-height: 2, color: #333
- body スクロール制御: open時に `overflow: hidden; position: fixed; top: -scrollY`

**PC:**
- オーバーレイ: position absolute, top 140px, background rgba(204,0,51,0.5)
- コンテンツ: 中央配置 `transform: translate(-50%, -50%)`, width calc(100% - 160px)
- border-radius: 12px, padding: 30px 50px
- フォントサイズ: 17px, line-height: 2, color: #333
- 閉じるボタン: コンテンツから -60px 上方
- クリックアウェイで閉じる

### 5. スクロールスナップ制御（SP のみ）

```
html に scroll-snap-type: y mandatory を動的に付与
条件: isReady && !isNearEnd
- isReady: 初期化完了後に rAF で設定
- isNearEnd: 最後のカードセクションの top <= 0 で判定
→ カタロググリッドに到達したらスナップを解除し、自然スクロールに移行
```

### 6. 商品一覧グリッド

- generic テーマと同じパターン: `x-data="items"` + `selectsInitItems`
- 2カラムグリッド
- カテゴリナビゲーション: IntersectionObserver でアクティブセクション追跡
- セクション見出しに `message-heading-pc.svg` / `message-heading-sp.svg` を使用

### 7. エクストラコメント

`CatalogItemCellAccesory` として、特定商品（`alias === "comment-target"`）の隣に表示。

**コメント1:**
- 見出し: 「首都圏本部 ネットワーク運営事業部長 林直樹」
- 写真: `comment-photo.jpg`
- 本文: 「寒くなってきましたし、我が家では最近ヘルシーブームなので野菜が多く入った鍋を食べる機会が増えました。昨年壊れてしまったグリル鍋を先日新たに購入し、さっそく何度か試していますが、いろいろな鍋のなかでも家族が一番好きなすき焼きをぜひ楽しみたいと思います。皆さんもぜひ美味しいものを食べてリフレッシュして頂き、これからも益々頑張っていきましょう！」

**コメント2:**
- 見出し: 「山梨支店長 清水一郎」
- 写真: `comment-photo-2.jpg`
- 本文: 「山梨にきて早4ヶ月、週末はロードバイクでDSを横目に、河から山沿いまで駆け巡っています。帰宅し長風呂からの冷えたビールやワインを飲むのは、走っているときとはまた違う最高の時間です。凝った料理はできないので、焼くだけの和牛のすき焼きは、週末のちょっと贅沢なつまみです。」

### 8. レター内容（ハードコード）

**レター1:**
> 首都圏ブロック3周年おめでとうございます。
> 私は、2025年6月に着任なので、かかわらせていただいた期間は短期間ですが、皆さんのおかげで、毎日楽しく仕事ができております。そして、首都圏ブロックに在籍していることのありがたみを毎日実感しております。ありがとうございます。
> うちの会社はなんだか組織見直しが好きな会社ですね。私、個人の意見としては、こんなに組織を見直さなくてもいいのでは？と思うことがあります。そのような中で、大きな組織を0から立ち上げることの大変さ！立ち上げから今まで、携わっていただいたすべての、皆さまに感謝いたします。おかげ様でとても素敵な支社になりました。
> 今後についても、皆さんが楽しく仕事ができた上で、会社の業績があがるような支社を目指していきます。
> 引き続きたくさんのコミュニケーションを取っていきたいと思いますのでよろしくお願いします。

**レター2:**
> Congrats 3rd Anniversary!
> 「３」は、僕が何かに向き合うときに数えるマジックナンバーです。
> ３日坊主、３週の習慣化、３ヶ月の法則、そして３年はひとつの時代。
> 着任直後に発足した首都圏ブロックは、何もないところから始まりました。新しい仲間と、知らない場所で、なれないことに挑み、皆がもがいていた日々。
> #２年目のチャレンジ
> では、リソース不足ながら少数精鋭で運営が軌道に乗り、僕が去る頃には、皆が自分の足で歩けるようになっていました。その姿を誇らしく思います。
> 首都圏での日々は、僕のドコモ最終章であり、プロフェッショナル人生のクライマックスでした。あちこちの現場に皆と出かけて行った日々は、いまも大切な思い出です。関わってくれた皆さん、本当にありがとう！
> そして、僕たち首都圏は、いつまでもUp-Carrier。いまを超え続けていきましょう。

**レター3:**
> この度はドコモ首都圏ブロック設立3周年、おめでとうございます。変化が大変激しい時期でしたので、３年といってもあっという間だったのではないでしょうか。
> 首都圏支社設立直前に東京支店に在籍していた当時、オフィスを拡大することなく、いくつかの会議室を改造して首都圏支社を作り、同じフロアの反対側へ設立前夜に台車に荷物を乗せて運んだことをよく覚えています。
> 中央エリアへの支社新設、本社機能、権限の一定程度を支社へ移管ということで周囲からの期待も大きく、我々もその過程を楽しんでいましたね。設立後も思い切った施策を皆でいくつもやりましたし、今思い返しても当時のメンバーとやった仕事は印象深いです。ただ、残念ながら首都圏支社には1年しかいられず、飯田橋ライフがあまりに短かったことが唯一の心残りです。3年経った現在でも理由をつけて飯田橋で飲んでいますので、機会があればぜひお声がけください。

## 商品詳細ページ

generic テーマへのシンボリックリンクで対応。

## 対象外

- アンケート（Enquete）ページ: DB/GraphQL 依存のため除外
- 商品詳細の独自スタイル: generic をそのまま利用
- enquete 用アセット: `check.svg`, `enquete-header-logo.svg`, `enquete-logo.svg`

## 技術変換

| 元（selects-app-gift） | 先（selects-themes） |
|------------------------|---------------------|
| React / TypeScript | Alpine.js / vanilla JS |
| Emotion (css-in-js) | vanilla CSS |
| React Router | なし（単一ページ） |
| useState / useEffect | Alpine reactive data / x-init |
| createPortal（モーダル） | DOM 直接操作（appendChild） |
| react-lazy-load-image | IntersectionObserver |
| useClickAway | document click listener |
| MobX / URQL | SDK 提供の Alpine data objects |

## デザイントークン

```
Primary Red:    #cc0033  (NTT Docomo ブランドカラー)
Dark Red:       #a10025
Darker Red:     #8a001f
White:          #fff
Black:          #000
Text Secondary: #333
Overlay:        rgba(204, 0, 51, 0.5)
Modal BG:       rgba(255, 255, 255, 0.97)

Font Sans: "游ゴシック体", YuGothic, "游ゴシック Medium", "Yu Gothic Medium", "游ゴシック", "Yu Gothic", sans-serif
Font Serif: "游明朝体", "Yu Mincho", YuMincho, serif

Breakpoint: 768px
```

## 実装順序

1. ディレクトリ作成 + アセットコピー（不要ファイル除外）
2. `meta.json` + `schema.json` 作成
3. `catalog-items/[id].html` シンボリックリンク作成
4. `index.html` 実装（ヒーロー → カード → グリッド → エクストラコメント）
5. `assets/style.css` 実装（レスポンシブ、アニメーション keyframes）
6. `assets/theme.js` 実装（スクロールスナップ制御、モーダル、カテゴリナビ）
