'use client'

import { useActionState, useEffect, useState } from 'react';
import { scanAction, ScanState } from './actions/scanAction';
import { Fingerprint, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const initialState: ScanState = {
  success: null,
  message: null
};

export default function KioskPage() {
  const [state, formAction, isPending] = useActionState(scanAction, initialState);
  const [displayState, setDisplayState] = useState<'IDLE' | 'SCANNING' | 'GRANTED' | 'DENIED'>('IDLE');

  // Lógica de Reactividad y Hardware de Voz
  useEffect(() => {
    if (isPending) {
      setDisplayState('SCANNING');
      return;
    }

    if (state.success === true) {
      setDisplayState('GRANTED');
      
      // Buena Práctica: Web Speech API nativa para feedback sonoro
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
         const msg = new SpeechSynthesisUtterance(`Bienvenido, ${state.fullName || ''}`);
         msg.lang = 'es-ES';
         msg.rate = 1.0;
         window.speechSynthesis.speak(msg);
      }
      
      // Auto-reseteo del Kiosco tras 5 segundos
      const timer = setTimeout(() => setDisplayState('IDLE'), 5000);
      return () => clearTimeout(timer);
    } 
    
    if (state.error === true || state.success === false) {
      setDisplayState('DENIED');
      
      // Feedback auditivo contundente para el caso rojo
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
         const msg = new SpeechSynthesisUtterance(`Acceso denegado. ${state.message || 'Comunícate con recepción.'}`);
         msg.lang = 'es-ES';
         msg.rate = 1.0;
         msg.pitch = 0.8; // Tono ligeramente más grave
         window.speechSynthesis.speak(msg);
      }

      const timer = setTimeout(() => setDisplayState('IDLE'), 3500);
      return () => clearTimeout(timer);
    }
  }, [state, isPending]);

  // Colores dinámicos del Tótem
  const getBackgroundColor = () => {
    if (displayState === 'GRANTED') return 'bg-green-500';
    if (displayState === 'DENIED') return 'bg-red-600';
    return 'bg-[#0A0A0F]';
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ease-in-out relative ${getBackgroundColor()}`}>
      
      <form action={formAction} className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* DEV TOOLBAR (Oculto a la vista, visible al pasar el mouse por la esquina superior izquierda) */}
        <div className="absolute -top-32 md:-top-48 -left-32 md:-left-48 z-50 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 opacity-10 hover:opacity-100 transition-all duration-300">
          <p className="text-white/70 text-[10px] uppercase font-bold mb-1 tracking-wider">Dev_Simulador_Hardware</p>
          <select 
            name="identifier" 
            defaultValue="TEMP_11111111" 
            className="bg-black/50 text-white border border-white/20 text-xs rounded p-2 outline-none cursor-pointer"
          >
            <option value="TEMP_11111111">Mario Admin (Acceso OK)</option>
            <option value="TEMP_22222222">Cliente Activo (Acceso OK)</option>
            <option value="TEMP_33333333">Cliente Vencido (Denegado 403)</option>
            <option value="99999999">Desconocido (Denegado 404)</option>
          </select>
        </div>

        {/* ESTADO IDLE */}
        {displayState === 'IDLE' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <button 
              type="submit" 
              className="p-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:scale-105 hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-all ease-out duration-300 group cursor-pointer"
            >
              <Fingerprint className="w-32 h-32 text-indigo-400 group-hover:text-indigo-300 animate-pulse" />
            </button>
            <h1 className="mt-12 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 tracking-widest text-center">
              APOYA TU PULGAR<br/>PARA INGRESAR
            </h1>
          </div>
        )}

        {/* ESTADO SCANNING */}
        {displayState === 'SCANNING' && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <Loader2 className="w-24 h-24 text-white animate-spin mb-8" />
            <h2 className="text-2xl font-bold text-white tracking-widest animate-pulse">
              VERIFICANDO IDENTIDAD...
            </h2>
          </div>
        )}

        {/* ESTADO GRANTED */}
        {displayState === 'GRANTED' && (
          <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-24 duration-700">
            <CheckCircle2 className="w-48 h-48 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)] mb-8" />
            <h1 className="text-5xl md:text-7xl font-black text-white text-center tracking-tighter uppercase drop-shadow-2xl">
              ¡BIENVENIDO!
            </h1>
            <p className="text-3xl font-bold text-green-100 mt-4 tracking-widest">
              {state.fullName}
            </p>
          </div>
        )}

        {/* ESTADO DENIED */}
        {displayState === 'DENIED' && (
          <div className="flex flex-col items-center animate-in slide-in-from-top-12 fade-in duration-300">
            <XCircle className="w-48 h-48 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-8" />
            <h1 className="text-5xl md:text-7xl font-black text-white text-center tracking-tighter drop-shadow-2xl">
              ACCESO DENEGADO
            </h1>
            <p className="text-2xl font-bold text-red-100 mt-6 tracking-widest uppercase bg-black/20 p-4 rounded-xl">
              {state.message}
            </p>
          </div>
        )}

      </form>

      {/* Efecto visual de Hardware (Puerta magnética simulada) */}
      <div 
        className={`absolute bottom-0 left-0 w-full bg-neutral-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-all duration-[1500ms] ease-out z-0
        ${displayState === 'GRANTED' ? 'h-0 opacity-0' : 'h-16 opacity-100'}`} 
      />
    </div>
  );
}
