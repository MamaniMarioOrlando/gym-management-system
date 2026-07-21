'use client';

import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardMetricsDto } from '@/lib/api';
import { getDashboardMetricsAction } from '@/app/actions/adminActions';
import { Users, Activity } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<DashboardMetricsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetricsAction();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading || !metrics) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        {children}
        <div className="mt-12">
          <Skeleton className="h-64 rounded-xl w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group hover:border-indigo-100 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-16 h-16 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Miembros Activos</p>
          <div className="text-4xl font-bold text-gray-900">
            <CountUp end={metrics.activeMembers} duration={2} separator="," />
          </div>
          <p className="text-xs text-red-500 mt-2 font-medium">{metrics.expiredMembers} miembros vencidos</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-100 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-16 h-16 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Ingresos de Hoy</p>
          <div className="text-4xl font-bold text-gray-900">
             $<CountUp end={metrics.dailyRevenue} duration={2} separator="," decimals={0} />
          </div>
          <p className="text-xs text-emerald-500 mt-2 font-medium">Actualizado en tiempo real</p>
        </div>

        <div className="bg-white rounded-xl border border-indigo-50 shadow-sm bg-indigo-50/30 p-6 flex flex-col justify-center relative overflow-hidden">
          <p className="text-sm font-medium text-indigo-600/70 mb-1">Total del Mes</p>
          <div className="text-3xl font-bold text-indigo-900">
             $<CountUp end={metrics.monthlyRevenue} duration={2.5} separator="," decimals={0} />
          </div>
        </div>
      </div>

      {children}

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Tendencia de Ingresos (Últimos 7 días)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `$${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip 
                formatter={(value: any) => [`$${value}`, "Ingresos"]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
