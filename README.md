# DÉTOURNÉ Site

## セットアップ
```bash
npm install
npm run dev        # http://localhost:4321 / 管理画面 http://localhost:4321/keystatic
```

## コンテンツ管理（Keystatic）
- **Episodes**: EP番号・ダンサー名・YouTube ID・章立て。YouTube IDを入れると自動でCOMING SOON→埋め込みに切替
- **Journal**: 記事。本文中で `/` → 「amazon」でAmazon商品ブロック挿入
- **サイト設定**: 問い合わせメール・SNS・アソシエイトID

## 本番（Vercel + GitHub編集モード）
1. GitHubへpush、Vercelでインポート
2. スマホから編集する場合は keystatic.config.ts の storage を切替:
   `storage: { kind: 'github', repo: { owner: 'あなたのユーザー名', name: 'detourne-site' } }`
3. https://keystatic.com/docs/github-mode に従いKeystatic GitHub Appを設定
4. 以降、本番URL/keystatic からスマホで記事・動画を追加→自動デプロイ

## 注意
- viteは7系固定（package.jsonのoverrides参照）。理由はCLAUDE.md
- 公開前チェック: privacy追記 / contactEmail差替 / DETOURNE-intro-9x16.mp4をpublicへ
