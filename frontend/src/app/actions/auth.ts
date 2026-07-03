'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: { error: string | null }, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios." };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      // Importante: No cachear este endpoint
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return { error: "Credenciales inválidas. Acceso Denegado." };
      }
      return { error: "Error de servidor. Intente más tarde." };
    }

    const data = await response.json();

    // SOLID: Guardamos el token de forma segura (HttpOnly por defecto en Next.js App Router cookies)
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'gym_session',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 día (Igual a la expiración en Java)
      path: '/',
    });

  } catch (error) {
    console.error("Login Server Error:", error);
    return { error: "Fallo de conexión crítico. ¿El backend está encendido?" };
  }

  // Redirigir siempre fuera del bloque try/catch
  redirect('/reception');
}
