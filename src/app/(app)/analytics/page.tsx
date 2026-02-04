'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AnalyticsPage() {
    const { user } = useAuthStore();

    if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold text-slate-800">Acceso Restringido</h1>
                <p className="text-slate-500">No tienes permisos para ver esta sección.</p>
                <Link href="/dashboard">
                    <Button>Volver al Inicio</Button>
                </Link>
            </div>
        );
    }

    // Mock Superset Dashboard URL - in a real app this would be signed or include auth token
    const supersetUrl = user.role === 'SuperAdmin' 
        ? "https://superset.example.com/superset/dashboard/p/overview/" 
        : `https://superset.example.com/superset/dashboard/p/org_overview/?org_id=${user.organizationId}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analítica Avanzada</h1>
            <p className="text-slate-500">
                {user.role === 'SuperAdmin' ? "Visión global del impacto de la Fundación." : "Métricas de tu organización."}
            </p>
        </div>
        {user.role === 'SuperAdmin' && (
             <Button variant="outline">Exportar Reporte General</Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[800px] relative">
          {/* Placeholder for Superset Iframe */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 z-0">
               <p className="mb-2 font-medium">Panel de Apache Superset</p>
               <p className="text-xs">Cargando dashboard desde: {supersetUrl}</p>
          </div>
          
          {/* Actual Iframe (commented out or mocked for now) */}
          <iframe 
            src="about:blank" 
            className="w-full h-full relative z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
            title="Superset Dashboard"
          /> 
          {/* 
              Note: In a real implementation, we would use the Superset Embedded SDK
              or a secure iframe with guest token.
          */}
      </div>
    </div>
  );
}
