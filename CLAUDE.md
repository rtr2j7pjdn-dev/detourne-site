# DÉTOURNÉ サイト — Claude Code 用メモ

## 構成
- Astro 6（**viteは7系にoverridesでピン留め。8に上げるとdevでreact-refreshが壊れる** → withastro/astro#16229 が解決するまで維持）
- Keystatic CMS（/keystatic）。コレクション: episodes（yaml）/ journal（mdoc）/ settings（singleton yaml）
- デプロイ: Vercel（@astrojs/vercel、output: static + Keystaticルートのみサーバー）
- デザイントークン: 黒#000 / 紙#f5f5f2 / 墨#111 / 灰#8a8a85。Bodoni Moda（EN・数字）+ Zen Old Mincho（JP）
- 運動言語: 左→右ワイプ統一（.wr クラス）。汎用フェードは使わない

## ルール
- 文字コピーの変更はレンダリング資産（イントロ/アウトロMP4）との整合を確認してから
- 和文の改行は .nb スパンで文節制御。生テキストを直接折り返させない
- Amazonリンクは journal本文の {% amazon %} タグ経由のみ。設定のamazonTagが自動付与される
- イントロ動画: public/DETOURNE-intro.mp4（16:9）+ DETOURNE-intro-9x16.mp4（縦・任意）。リロードで再生、サイト内遷移でスキップ

## 未完了
- privacy.astro に解析・Cookie記載を追記してから公開
- settings の contactEmail が仮値
- Amazonアソシエイト合格後に amazonTag 入力
