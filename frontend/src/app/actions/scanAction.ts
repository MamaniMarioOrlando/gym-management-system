'use server'

import { API_BASE_URL } from '@/lib/api';

export type ScanState = {
  success: boolean | null;
  message: string | null;
  fullName?: string;
  error?: boolean;
};

export async function scanAction(prevState: ScanState, formData: FormData): Promise<ScanState> {
  // 1. Intentar obtener el identificador del formulario (PREPARACIÓN HARDWARE REAL)
  let identifier = formData.get('identifier')?.toString()?.trim();
  
  // 2. Si no viene del formulario (fallback), usar la variable de entorno
  if (!identifier) {
    identifier = process.env.NEXT_PUBLIC_TEST_DNI || 'TEMP_11111111-1111-1111-1111-111111111111';
  }
  
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
