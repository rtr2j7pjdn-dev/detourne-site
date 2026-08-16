import { config, collection, singleton, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

// markdoc.config.mjs の {% amazon %} タグに対応する編集ブロック。
// キー名(amazon)と属性名(url / label)はタグ定義と一致させること。
const amazonBlock = block({
  label: 'Amazon商品',
  description: '本文中にAmazon商品リンクを挿入。アソシエイトIDはサイト設定から自動付与',
  schema: {
    url: fields.url({ label: '商品URL', validation: { isRequired: true } }),
    label: fields.text({ label: '表示する商品名', validation: { isRequired: true } }),
  },
});

// 本文中に「/」で呼び出せる挿入ブロック。画像の保存先はコレクションごとに変わるので
// ディレクトリを引数で受け取る。markdoc.config.mjs のタグ定義と属性名を揃えること。
const contentBlocks = (directory: string, publicPath: string) => ({
  photo: block({
    label: '写真（キャプション付き）',
    description: '大きく1枚。下に小さな説明文を添えられる',
    schema: {
      src: fields.image({
        label: '写真',
        directory,
        publicPath,
        validation: { isRequired: true },
      }),
      alt: fields.text({ label: '画像の説明（目の不自由な方向け・任意）' }),
      caption: fields.text({ label: 'キャプション（任意）' }),
    },
  }),
  quote: block({
    label: '大きな引用',
    description: '発言を大きく見せる。話し手の名前も入れられる',
    schema: {
      text: fields.text({ label: '引用文', multiline: true, validation: { isRequired: true } }),
      cite: fields.text({ label: '話し手・出典（任意）' }),
    },
  }),
  youtube: block({
    label: 'YouTube動画',
    description: '動画を埋め込む',
    schema: {
      id: fields.text({ label: '動画ID（URLの v= 以降11文字）', validation: { isRequired: true } }),
      title: fields.text({ label: '動画タイトル（任意）' }),
    },
  }),
});

// エディタで使える書式。未指定の項目に依存しないよう明示的に列挙する。
const editorOptions = (directory: string, publicPath: string) => ({
  bold: true,
  italic: true,
  strikethrough: false,
  code: false,
  codeBlock: false,
  heading: [2, 3] as const,
  blockquote: true,
  orderedList: true,
  unorderedList: true,
  table: false,
  link: true,
  divider: true,
  image: { directory, publicPath },
});

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
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'スラッグ（URL用）' } }),
        epNumber: fields.integer({ label: 'EP番号', validation: { min: 1 } }),
        dancerJa: fields.text({ label: 'ダンサー名（日本語）' }),
        dancerEn: fields.text({ label: 'ダンサー名（英語）— 例: Madoka Sugai — Principal Dancer' }),
        youtubeId: fields.text({
          label: 'YouTube動画ID',
          description: '未入力の間はサムネイル（未設定ならCOMING SOON）を表示。URLのv=以降の11文字',
        }),
        thumbnail: fields.image({
          label: 'サムネイル画像（任意）',
          description: '動画IDを入れるまでの間、トップと詳細ページに大きく表示される。16:9推奨',
          directory: 'public/episodes',
          publicPath: '/episodes/',
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
        body: fields.markdoc({
          label: '記事本文',
          description: '「/」で写真・引用・動画を挿入。未入力ならページに本文セクションを表示しない',
          options: editorOptions('public/episodes', '/episodes/'),
          components: contentBlocks('public/episodes', '/episodes/'),
        }),
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
        coverImage: fields.image({
          label: 'カバー画像（任意）',
          description: '記事の一番上に大きく表示される。未設定なら表示しない',
          directory: 'public/journal',
          publicPath: '/journal/',
        }),
        body: fields.markdoc({
          label: '本文',
          description: '「/」で写真・引用・動画・Amazon商品を挿入',
          options: editorOptions('public/journal', '/journal/'),
          components: { ...contentBlocks('public/journal', '/journal/'), amazon: amazonBlock },
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
