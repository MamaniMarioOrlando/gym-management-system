// Archivo para manejar unificadamente las llamadas al backend Spring Boot

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  dni?: string;
  role: string;
  membershipExpiryDate?: string | null;
}

export interface DailyRevenueDto {
  date: string;
  amount: number;
}

export interface DashboardMetricsDto {
  activeMembers: number;
  expiredMembers: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  chartData: DailyRevenueDto[];
}

export const api = {
  users: {
    // Retraso artificial para que podamos apreciar los Skeletons
    getAll: async (): Promise<UserDto[]> => {
      // Obtenemos las cookies en el servidor (Import dinámico para no romper SSR vs CSR)
      const { cookies } = await import('next/headers');
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
  },
  dashboard: {
    getMetrics: async (): Promise<DashboardMetricsDto> => {
      let tokenValue = undefined;

      // Type Check to see if we are in Server (cookies()) or Client (document.cookie)
      if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        tokenValue = cookieStore.get('gym_session')?.value;
      } else {
        // Obtenemos la cookie del navegador (esto se asume simplificado o se relyea en fetch)
        // Pero dado que fetch es nativo y credential=include, podemos forzar el header
        const docCookies = document.cookie.split(';');
        const match = docCookies.find(c => c.trim().startsWith('gym_session='));
        if (match) {
           tokenValue = match.split('=')[1];
        }
      }

      const headersConfig: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (tokenValue) {
        headersConfig['Authorization'] = `Bearer ${tokenValue}`;
      }

      const res = await fetch(`${API_BASE_URL}/admin/dashboard/metrics`, { 
        cache: 'no-store',
        headers: headersConfig,
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard metrics: ${res.status}`);
      }

      return res.json();
    }
  }
};
