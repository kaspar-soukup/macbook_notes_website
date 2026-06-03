// Vercel serverless function: logs the download click and 302s to the DMG.
// Mounted at /api/download. The query param `source` lets us see which CTA was used.

type Req = {
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
};
type Res = {
  setHeader: (name: string, value: string) => void;
  redirect: (status: number, url: string) => void;
};

const ALLOWED_SOURCES = new Set(['hero', 'footer', 'nav-cta', 'nav-menu', 'modal-retry', 'unknown']);

export default function handler(req: Req, res: Res) {
  const raw = Array.isArray(req.query.source) ? req.query.source[0] : req.query.source;
  const source = ALLOWED_SOURCES.has(String(raw)) ? String(raw) : 'unknown';

  const ua = String(req.headers['user-agent'] ?? '').slice(0, 256);
  const country = String(req.headers['x-vercel-ip-country'] ?? '');
  const referer = String(req.headers['referer'] ?? '');

  console.log(JSON.stringify({
    evt: 'download',
    ts: new Date().toISOString(),
    source,
    country,
    ua,
    referer,
  }));

  res.setHeader('Cache-Control', 'no-store');
  res.redirect(302, '/downloads/KaosNotes-beta.dmg');
}
