import { api } from "@/lib/api";
import { logoutAction } from "@/app/actions/auth";
import DashboardClient from "./DashboardClient";
import { CreateUserModal, RenewModal } from "./ClientModals";
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
        <TableHeader className="bg-gray-100 border-b-2 border-gray-200">
          <TableRow>
            <TableHead className="w-[120px] font-bold text-slate-900 uppercase tracking-wider text-xs">Documento/DNI</TableHead>
            <TableHead className="font-bold text-slate-900 uppercase tracking-wider text-xs">Nombre Completo</TableHead>
            <TableHead className="font-bold text-slate-900 uppercase tracking-wider text-xs">Correo Electrónico</TableHead>
            <TableHead className="font-bold text-slate-900 uppercase tracking-wider text-xs">Vencimiento</TableHead>
            <TableHead className="text-center font-bold text-slate-900 uppercase tracking-wider text-xs">Estado</TableHead>
            <TableHead className="text-right font-bold text-slate-900 uppercase tracking-wider text-xs">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="font-medium text-gray-500">{user.dni}</TableCell>
              <TableCell className="font-bold text-gray-900">{user.name}</TableCell>
              <TableCell className="text-gray-500 text-sm">{user.email}</TableCell>
              <TableCell className="text-sm font-semibold text-gray-700">
                {user.membershipExpiryDate 
                  ? new Date(user.membershipExpiryDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) 
                  : '—'}
              </TableCell>
              <TableCell className="text-center">
                {user.role?.includes('ADMIN') ? (
                  <Badge variant="default" className="bg-indigo-600 hover:bg-indigo-700 mx-auto">
                    ADMIN
                  </Badge>
                ) : (
                  <Badge 
                    variant="secondary"
                    className={
                      (!user.membershipExpiryDate || new Date(user.membershipExpiryDate) < new Date())
                        ? 'bg-red-500 hover:bg-red-600 text-white mx-auto flex items-center justify-center w-20'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white mx-auto flex items-center justify-center w-20'
                    }
                  >
                    {(!user.membershipExpiryDate || new Date(user.membershipExpiryDate) < new Date()) ? 'VENCIDO' : 'ACTIVO'}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {user.role !== 'ADMIN' && (
                  <div className="flex justify-end">
                    <RenewModal userId={String(user.id)} userName={user.name} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
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
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 bg-white border border-gray-200 text-slate-800 px-4 py-2 rounded-md shadow-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all font-semibold text-sm">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DashboardClient>
          {/* Tabla Dinámica Server-Side con Skeletons */}
          <section className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Directorio de Usuarios</h2>
                <p className="text-sm text-gray-500 mt-1">Conectado en tiempo real con Spring Boot</p>
              </div>
              
              <CreateUserModal />
            </div>
            
            <Suspense fallback={<TableSkeleton />}>
              <UsersDataTable />
            </Suspense>
          </section>
        </DashboardClient>
      </main>
    </div>
  );
}
