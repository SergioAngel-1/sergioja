import { NextRequest, NextResponse } from 'next/server';

/**
 * Returns true if the given origin is allowed by a frame-ancestors directive.
 * Handles: '*', 'none', 'self' (resolved against targetOrigin), and explicit origins.
 */
function frameAncestorsAllows(csp: string, requesterOrigin: string, targetOrigin: string): boolean {
  const match = csp.match(/frame-ancestors\s+([^;]+)/i);
  if (!match) return true; // no directive = unrestricted

  const values = match[1].trim().split(/\s+/);

  if (values.includes("'none'")) return false;
  if (values.includes('*')) return true;

  for (const v of values) {
    if (v === "'self'" && requesterOrigin === targetOrigin) return true;
    // Normalize: strip trailing slash, compare origins
    const normalized = v.replace(/\/$/, '');
    if (normalized === requesterOrigin) return true;
    // Wildcard subdomain: *.example.com
    if (normalized.startsWith('*.')) {
      const suffix = normalized.slice(1); // .example.com
      if (requesterOrigin.endsWith(suffix)) return true;
    }
  }

  return false;
}

function originOf(url: string): string {
  try {
    const { origin } = new URL(url);
    return origin;
  } catch {
    return '';
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  // The browser passes its own origin so we can check frame-ancestors accurately
  const requesterOrigin = req.nextUrl.searchParams.get('from') ?? req.headers.get('origin') ?? '';

  if (!url) {
    return NextResponse.json({ embeddable: false }, { status: 400 });
  }

  const targetOrigin = originOf(url);

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        ...(requesterOrigin ? { 'Referer': requesterOrigin + '/' } : {}),
      },
    });

    const xfo = res.headers.get('x-frame-options')?.toUpperCase().trim() ?? '';
    const csp = res.headers.get('content-security-policy') ?? '';
    const hasFrameAncestors = /frame-ancestors/i.test(csp);

    let embeddable: boolean;
    if (hasFrameAncestors) {
      // Per spec, browsers ignore X-Frame-Options when frame-ancestors is present
      embeddable = frameAncestorsAllows(csp, requesterOrigin, targetOrigin);
    } else {
      // Fall back to X-Frame-Options
      if (xfo === 'DENY') {
        embeddable = false;
      } else if (xfo === 'SAMEORIGIN') {
        embeddable = requesterOrigin === targetOrigin;
      } else {
        embeddable = true;
      }
    }

    return NextResponse.json({ embeddable });
  } catch {
    return NextResponse.json({ embeddable: false });
  }
}
