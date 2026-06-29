// Archivo para manejar unificadamente las llamadas al backend Spring Boot

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const api = {
  users: {
    // Retraso artificial para que podamos apreciar los Skeletons
    getAll: async (): Promise<UserDto[]> => {
      // Configuracion para que Next.js no cachee esto agresivamente en desarrollo
      const res = await fetch(`${API_BASE_URL}/users`, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
      }

      // Simulamos retraso de red de 1.5s para apreciar la UX moderna
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json();
    }
  }
};
