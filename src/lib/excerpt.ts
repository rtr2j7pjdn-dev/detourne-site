// 記事本文(markdoc)から検索結果・SNS用の説明文をつくる。
// 挿入ブロックや見出し記法を落として、地の文だけを繋いで切り詰める。
export function toExcerpt(body: string | undefined, max = 110): string {
  if (!body) return '';
  const text = body
    .replace(/\{%[\s\S]*?%\}/g, ' ')   // {% photo %} などのブロック
    .replace(/^#{1,6}\s+.*$/gm, ' ')   // 見出し行
    .replace(/[*_`>|]/g, '')           // 強調・引用記号
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクは文字だけ残す
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[、。，,]$/, '') + '…';
}
