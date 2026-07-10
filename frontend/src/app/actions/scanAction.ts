'use server'

import { API_BASE_URL } from '@/lib/api';

export type ScanState = {
  success: boolean | null;
  message: string | null;
  fullName?: string;
  error?: boolean;
};

export async function scanAction(prevState: ScanState, formData: FormData): Promise<ScanState> {
  // En un Totem real, este identifier vendría del lector USB/Serial
  // Extraemos el valor inyectado por nuestro Simulador en el Frontend
  const simulatorValue = formData.get('identifier')?.toString();
  const identifier = simulatorValue || process.env.NEXT_PUBLIC_TEST_DNI || 'TEMP_11111111';  
  
  try {
    const res = await fetch(`${API_BASE_URL}/access/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier }),
      cache: 'no-store'
    });

    // Fuerza Bruta - Intercepción Segura
    if (res.status === 429) {
      return { success: false, message: "SISTEMA PROTEGIDO CONTRA SPAM", error: true };
    }

    const data = await res.json();

    // 403 (Membresía Vencida) o 404 (Usuario No Existe)
    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "ACCESO DENEGADO", 
        error: true 
      };
    }

    // 200 OK - Acceso Concedido
    return { 
      success: true, 
      message: data.message, 
      fullName: data.fullName,
      error: false 
    };

  } catch (error) {
    console.error("Fallo de red en Tótem:", error);
    return { success: false, message: "MANTENIMIENTO DE RED", error: true };
  }
}
