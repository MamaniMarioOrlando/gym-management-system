import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Users, ShieldCheck, Activity, LogOut } from "lucide-react";

async function UsersDataTable() {
  // Fetch real data directly from the Spring Boot API!
  const users = await api.users.getAll();

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[100px] font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Nombre Completo</TableHead>
            <TableHead className="font-semibold">Correo Electrónico</TableHead>
            <TableHead className="text-right font-semibold">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="font-medium text-gray-500">#{user.id}</TableCell>
              <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
              <TableCell className="text-gray-500">{user.email}</TableCell>
              <TableCell className="text-right">
                <Badge 
                  variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  className={user.role === 'ADMIN' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                >
                  {user.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead><Skeleton className="h-4 w-10" /></TableHead>
            <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            <TableHead><Skeleton className="h-4 w-48" /></TableHead>
            <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-36" /></TableCell>
              <TableCell><Skeleton className="h-4 w-52" /></TableCell>
              <TableCell className="text-right flex justify-end"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ReceptionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans selection:bg-indigo-100">
      {/* Topbar moderna estilo Dashboard Premium */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Gym Access <span className="text-indigo-600">Control</span>
              </h1>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 hover:text-red-600 transition-all font-medium text-sm">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Metricas Rapidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group hover:border-indigo-100 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-16 h-16 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Miembros Activos</p>
            <p className="text-3xl font-bold text-gray-900">Cargando...</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-100 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-16 h-16 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ingresos Hoy</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
          </div>
        </div>

        {/* Tabla Dinámica Server-Side con Skeletons */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Directorio de Usuarios</h2>
              <p className="text-sm text-gray-500 mt-1">Conectado en tiempo real con Spring Boot</p>
            </div>
          </div>
          
          <Suspense fallback={<TableSkeleton />}>
            <UsersDataTable />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
