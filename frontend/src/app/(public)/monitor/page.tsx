export default function MonitorPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
      <div className="text-center space-y-6">
        {/* Usamos un diseño Dynamic y Premium de alto contraste */}
        <h1 className="text-6xl font-extrabold tracking-tight text-emerald-400">
          Esperando Huella...
        </h1>
        <p className="text-xl text-zinc-400">
          Por favor, coloca tu dedo en el lector biométrico.
        </p>
      </div>
    </div>
  );
}
