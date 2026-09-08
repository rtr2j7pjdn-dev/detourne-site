// Instagram投稿URLを埋め込み用のパスに正規化する。
// 投稿(/p/)・リール(/reel/)・IGTV(/tv/) に対応し、末尾のクエリや
// 共有時に付く ?igsh= などのパラメータは落とす。
// 埋め込めるのは公開アカウントの投稿のみ。
export function toInstagramEmbed(input: string | null | undefined): string | null {
  const raw = (input ?? '').trim();
  if (!raw) return null;

  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    if (!u.hostname.includes('instagram.com')) return null;

    const m = u.pathname.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) return null;

    const kind = m[1] === 'reels' ? 'reel' : m[1];
    return `https://www.instagram.com/${kind}/${m[2]}/embed`;
  } catch {
    return null;
  }
}
