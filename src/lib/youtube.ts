// YouTubeの「動画ID」欄には、IDだけでなくURLを丸ごと貼られることがある。
// どちらで入力されても埋め込みが壊れないよう、ここでIDに正規化する。
export function toYouTubeId(input: string | null | undefined): string {
  const raw = (input ?? '').trim();
  if (!raw) return '';
  if (!/^https?:\/\//i.test(raw)) return raw; // すでにID

  try {
    const u = new URL(raw);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1).split('/')[0];
    }
    const v = u.searchParams.get('v');
    if (v) return v;
    const m = u.pathname.match(/\/(embed|shorts|live|v)\/([^/?#]+)/);
    if (m) return m[2];
  } catch {
    // URLとして解釈できなければそのまま返す
  }
  return raw;
}
