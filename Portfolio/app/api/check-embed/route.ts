import { NextRequest, NextResponse } from 'next/server';

function frameAncestorsAllows(csp: string, requesterOrigin: string, targetOrigin: string): boolean {
  const match = csp.match(/frame-ancestors\s+([^;]+)/i);
  if (!match) return true;

  const values = match[1].trim().split(/\s+/);

  if (values.includes("'none'")) return false;
  if (values.includes('*')) return true;

  for (const v of values) {
    if (v === "'self'" && requesterOrigin === targetOrigin) return true;
    const normalized = v.replace(/\/$/, '');
    if (normalized === requesterOrigin) return true;
    if (normalized.startsWith('*.')) {
      const suffix = normalized.slice(1);
      if (requesterOrigin.endsWith(suffix)) return true;
    }
  }

  return false;
}

function originOf(url: string): string {
  try { return new URL(url).origin; } catch { return ''; }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const requesterOrigin = req.nextUrl.searchParams.get('from') ?? '';

  if (!url) return NextResponse.json({ embeddable: true });

  const targetOrigin = originOf(url);

  // Manual timeout compatible with all Node.js 18+ versions
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    clearTimeout(timer);

    const xfo = res.headers.get('x-frame-options')?.toUpperCase().trim() ?? '';
    const csp = res.headers.get('content-security-policy') ?? '';
    const hasFrameAncestors = /frame-ancestors/i.test(csp);

    let embeddable: boolean;
    if (hasFrameAncestors) {
      embeddable = frameAncestorsAllows(csp, requesterOrigin, targetOrigin);
    } else if (xfo === 'DENY') {
      embeddable = false;
    } else if (xfo === 'SAMEORIGIN') {
      embeddable = requesterOrigin === targetOrigin;
    } else {
      embeddable = true;
    }

    return NextResponse.json({ embeddable });
  } catch {
    clearTimeout(timer);
    // If we can't reach the URL or it times out, assume embeddable and let the browser decide
    return NextResponse.json({ embeddable: true });
  }
}
