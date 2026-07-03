'use client'

import { useActionState } from 'react';
import { loginAction } from '../../actions/auth';
import { Lock, User } from 'lucide-react';

const initialState = {
  error: null as string | null,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Elementos de Neón - Modern Web Design */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Cabecera del Login */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight mb-2">
            Gym Access
          </h1>
          <p className="text-neutral-400 font-medium">Terminal Administrativa Protegida</p>
        </div>

        {/* Tarjeta Glassmorphic */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          
          <form action={formAction} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input 
                  name="email"
                  type="email" 
                  placeholder="mario@admin.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Contraseña de Seguridad</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input 
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Manejo de Error */}
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
                {state.error}
              </div>
            )}

            {/* Botón de Submit Neón */}
            <button 
              disabled={isPending}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? 'Estableciendo Conexión...' : 'Desbloquear Terminal'}
              </span>
            </button>
            
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 space-x-4 text-xs text-neutral-600">
          <span>&copy; 2026 CodeKorneight</span>
          <span>•</span>
          <span>Acceso Restringido Nivel 1</span>
        </div>
      </div>
    </div>
  );
}
