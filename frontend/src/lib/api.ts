// lib/api.ts
// Este archivo actúa como puente de conexión entre el Frontend (Next.js) y el Backend (Spring Boot)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Aquí podemos inyectar el JWT en el futuro usando cookies de Next.js o localStorage
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
