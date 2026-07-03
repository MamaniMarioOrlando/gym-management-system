import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Buscar la cookie del token JWT
  const token = request.cookies.get('gym_session')?.value;

  // Si la ruta comienza con /reception (rutas protegidas)
  if (request.nextUrl.pathname.startsWith('/reception')) {
    // Si no hay token, redirigir implacablemente al login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevenir que usuarios ya logueados vean el login innecesariamente
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/reception', request.url));
  }

  // Si tiene token, o está navegando a páginas públicas, dejarlo pasar
  return NextResponse.next();
}

export const config = {
  // Configuro el matcher para que solo ejecute el middleware en las rutas clave
  matcher: ['/reception/:path*', '/login'],
};
