import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Agregar pathname a headers para canonical URL
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  
  // Extraer slug de la ruta (remover / inicial)
  const slug = pathname.replace(/^\/+/, '');
  
  if (slug && slug.length > 0) {
    try {
      // Verificar si existe redirección para este slug
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/portfolio/redirects/${encodeURIComponent(slug)}`, {
        next: { revalidate: 3600 }, // Cache 1 hora
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.redirectTo) {
          // Redirección 301 permanente para SEO
          const redirectTarget = data.data.redirectTo;
          const targetPath = redirectTarget.startsWith('/')
            ? redirectTarget
            : `/${redirectTarget}`;
          const redirectUrl = new URL(targetPath, request.url);
          
          console.log('[SEO Redirect] 301:', pathname, '->', redirectUrl.pathname);
          
          return NextResponse.redirect(redirectUrl, { status: 301 });
        }
      }
    } catch (error) {
      // Si falla la verificación de redirect, continuar normalmente
      console.error('[Redirect Check Error]:', error);
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
