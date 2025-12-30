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
