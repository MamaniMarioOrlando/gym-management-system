// Archivo para manejar unificadamente las llamadas al backend Spring Boot
import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  dni?: string;
  role: string;
  membershipExpiryDate?: string | null;
}

export const api = {
  users: {
    // Retraso artificial para que podamos apreciar los Skeletons
    getAll: async (): Promise<UserDto[]> => {
      // Obtenemos las cookies en el servidor
      const cookieStore = await cookies();
      const token = cookieStore.get('gym_session')?.value;

      // DRY y Type Guard: Solo adjuntamos el header si realmente tenemos el token
      const headersConfig: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headersConfig['Authorization'] = `Bearer ${token}`;
      }

      // Configuracion para que Next.js no cachee esto agresivamente en desarrollo
      const res = await fetch(`${API_BASE_URL}/users`, { 
        cache: 'no-store',
        headers: headersConfig,
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
      }

      // Simulamos retraso de red de 1.5s para apreciar la UX moderna
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json();
    }
  }
};
