export default function ReceptionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Recepción Administrador</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
          Cerrar Sesión
        </button>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Accesos Recientes</h2>
          <div className="text-gray-500 italic">Cargando datos seguros...</div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Miembros Activos</h2>
          <div className="text-gray-500 italic">Cargando datos seguros...</div>
        </section>
      </main>
    </div>
  );
}
