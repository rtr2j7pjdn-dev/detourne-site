import { config, collection, singleton, fields } from '@keystatic/core';

// GitHubモード切替: 環境変数 PUBLIC_KEYSTATIC_REPO に "owner/repo-name" を設定すると
// 自動でGitHubモードになる（未設定ならローカル編集モード）。
// 併せてKeystatic GitHub Appの設定が必要: https://keystatic.com/docs/github-mode
const githubRepo = import.meta.env.PUBLIC_KEYSTATIC_REPO as `${string}/${string}` | undefined;

export default config({
  storage: githubRepo
    ? { kind: 'github', repo: githubRepo }
    : { kind: 'local' },
  ui: {
    brand: { name: 'DÉTOURNÉ' },
  },
  collections: {
    episodes: collection({
      label: 'Episodes（動画）',
      slugField: 'slug',
      path: 'content/episodes/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'スラッグ（URL用）' } }),
        epNumber: fields.integer({ label: 'EP番号', validation: { min: 1 } }),
        dancerJa: fields.text({ label: 'ダンサー名（日本語）' }),
        dancerEn: fields.text({ label: 'ダンサー名（英語）— 例: Madoka Sugai — Principal Dancer' }),
        youtubeId: fields.text({
          label: 'YouTube動画ID',
          description: '未入力の間はCOMING SOON表示。URLのv=以降の11文字',
        }),
        publishDate: fields.date({ label: '公開日' }),
        status: fields.select({
          label: 'ステータス',
          options: [
            { label: '下書き', value: 'draft' },
            { label: '公開', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        chapters: fields.array(
          fields.object({
            numeral: fields.text({ label: 'ローマ数字（II, IIIなど）' }),
            title: fields.text({ label: '章タイトル' }),
          }),
          { label: '章立て', itemLabel: (p) => `${p.fields.numeral.value} ${p.fields.title.value}` }
        ),
      },
    }),
    journal: collection({
      label: 'Journal（記事）',
      slugField: 'slug',
      path: 'content/journal/*',
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'スラッグ（URL用）' } }),
        title: fields.text({ label: 'タイトル' }),
        category: fields.select({
          label: 'カテゴリ',
          options: [
            { label: 'Behind the Scenes', value: 'Behind the Scenes' },
            { label: 'Gear', value: 'Gear' },
            { label: "Dancer's Life", value: "Dancer's Life" },
            { label: 'News', value: 'News' },
          ],
          defaultValue: 'Behind the Scenes',
        }),
        date: fields.date({ label: '公開日' }),
        status: fields.select({
          label: 'ステータス',
          options: [
            { label: '下書き', value: 'draft' },
            { label: '公開', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        body: fields.markdoc({
          label: '本文',
          description: 'Amazon商品リンクは / を打って「Amazon商品」ブロックを挿入',
          options: { image: { directory: 'public/journal', publicPath: '/journal/' } },
          components: {},
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'サイト設定',
      path: 'content/settings/site',
      format: { data: 'yaml' },
      schema: {
        contactEmail: fields.text({ label: 'Partners問い合わせ先メール' }),
        instagram: fields.text({ label: 'Instagram URL' }),
        youtube: fields.text({ label: 'YouTube URL' }),
        x: fields.text({ label: 'X URL' }),
        amazonTag: fields.text({
          label: 'AmazonアソシエイトID（例: xxxx-22）',
          description: '審査合格後に入力。Journal内のAmazonリンクに自動付与',
        }),
      },
    }),
  },
});
