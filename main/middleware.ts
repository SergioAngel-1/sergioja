import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas de modales que deben reescribirse a la página principal
  const modalRoutes = ['/navigation', '/identity', '/purpose', '/connection'];
  
  // Si la ruta es un modal, reescribir a la página principal manteniendo la URL
  if (modalRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }
  
  // Verificar redirects compartidos (misma DB que Portfolio)
  const slug = pathname.replace(/^\/+/, '').replace(/\/$/, '');
  
  if (slug && slug.length > 0) {
    try {
      // Consultar mismo endpoint de redirects que Portfolio
      const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/portfolio/redirects/${encodeURIComponent(slug)}`, {
        next: { revalidate: 3600 }, // Cache 1 hora
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.redirectTo) {
          const redirectTarget = data.data.redirectTo;
          
          // Determinar si es URL externa o ruta interna
          const isExternalUrl = redirectTarget.startsWith('http://') || redirectTarget.startsWith('https://');
          
          if (isExternalUrl) {
            // Redirección a URL externa
            console.log('[Main Redirect] 301 (external):', pathname, '->', redirectTarget);
            return NextResponse.redirect(redirectTarget, { status: 301 });
          } else {
            // Redirección interna
            const targetPath = redirectTarget.startsWith('/') 
              ? redirectTarget 
              : `/${redirectTarget}`;
            const redirectUrl = new URL(targetPath, request.url);
            
            console.log('[Main Redirect] 301 (internal):', pathname, '->', redirectUrl.pathname);
            
            return NextResponse.redirect(redirectUrl, { status: 301 });
          }
        }
      }
    } catch (error) {
      // Si falla la verificación de redirect, continuar normalmente
      console.error('[Main Redirect Check Error]:', error);
    }
  }
  
  // Agregar pathname a headers para canonical URL
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
