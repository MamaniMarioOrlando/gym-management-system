'use client'

import { useState, useActionState, useEffect } from 'react';
import { createUserAction, renewMembershipAction } from '@/app/actions/adminActions';
import { Plus, CreditCard, X } from 'lucide-react';

export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createUserAction, { success: false, error: '' });

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
    }
  }, [state.success]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Plus className="w-4 h-4" /> Registrar Socio Nuevo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Dar de Alta a un Socio</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <p className="text-sm text-gray-500 mb-6">El sistema inyectará 30 días de acceso pagados automáticamente hacia el futuro partiendo desde hoy.</p>
              
              <form action={formAction} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">DNI / Documento</label>
                  <input required name="dni" type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-slate-900 bg-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="Ej: 45678912" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
                  <input required name="fullName" type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-slate-900 bg-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="Ej: Juan Perez" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Correo Electrónico</label>
                  <input required name="email" type="email" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-slate-900 bg-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm" placeholder="juan@ejemplo.com" />
                </div>
                
                {state.error && <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 p-3 rounded-lg">{state.error}</div>}

                <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" disabled={pending} className="bg-indigo-600 text-white px-5 py-2 font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">
                    {pending ? 'Generando...' : 'Confirmar Alta y Cobrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function RenewModal({ userId, userName }: { userId: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(renewMembershipAction, { success: false, error: '' });

  useEffect(() => {
    if (state.success) setIsOpen(false);
  }, [state.success]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-all shadow-sm">
        <CreditCard className="w-3.5 h-3.5" /> Cobrar Mes
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Renovar Mensualidad</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"><X className="w-4 h-4"/></button>
              </div>
              <p className="text-sm text-gray-600 mb-6 border-l-4 border-emerald-500 pl-3">
                Agregaremos 30 días de acceso continuo para <strong className="text-gray-900">{userName}</strong> y se generará registro en caja.
              </p>
              
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="userId" value={userId} />
                <div>
                  <label className="text-sm font-semibold text-gray-700">Monto del Pago (Tarifa Plana)</label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
                    <input required name="amount" type="number" step="0.01" defaultValue="15000" className="w-full font-mono text-lg text-slate-900 bg-white border border-gray-300 rounded-lg p-2 pl-8 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm" />
                  </div>
                </div>
                
                {state.error && <div className="text-red-600 text-sm bg-red-50 border border-red-100 font-medium p-3 rounded-lg">{state.error}</div>}

                <div className="pt-4 flex justify-end gap-3 border-t mt-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" disabled={pending} className="bg-emerald-600 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors">
                    {pending ? 'Procesando Tarjeta...' : '✅ Confirmar Pago'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
