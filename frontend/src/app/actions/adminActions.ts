'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('gym_session')?.value;
}

export async function createUserAction(prevState: any, formData: FormData) {
  const token = await getToken();
  if (!token) return { error: "No autenticado" };

  const dni = formData.get('dni');
  const fullName = formData.get('fullName');
  const email = formData.get('email');

  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ dni, fullName, email })
    });

    if (!res.ok) {
       const text = await res.text();
       return { error: `Error de servidor: ${res.status}` };
    }
    
    revalidatePath('/reception');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function renewMembershipAction(prevState: any, formData: FormData) {
  const token = await getToken();
  if (!token) return { error: "No autenticado" };

  const userId = formData.get('userId');
  const amount = formData.get('amount');

  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    if (!res.ok) {
       const text = await res.text();
       return { error: `Fallo la renovación: ${res.status}` };
    }
    
    revalidatePath('/reception');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
