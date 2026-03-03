'use client';

import { useState, useEffect } from 'react';
import { crmService } from '@/services/crm.service';
import { ApiCrmStats } from '@/types/api.types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ClipboardList,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ActivityTab({ orgId }: { orgId?: string }) {
  const [stats, setStats] = useState<ApiCrmStats | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, [orgId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await crmService.getStats(orgId);
      setStats(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Resumen general</h3>
        <Button variant="ghost" size="sm" onClick={loadData} className="h-8 text-slate-500 hover:text-fuchsia-600">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Actualizar
        </Button>
      </div>

      {/* Hero — Total Contactos */}
      <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-fuchsia-50 to-purple-50">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-fuchsia-600 uppercase tracking-wide mb-1">
                Total Contactos
              </p>
              <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600 leading-none">
                {stats?.total_contacts ?? 0}
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-fuchsia-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-fuchsia-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fila 1 — Estado de contactos */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Activos',
            value: stats?.active_contacts ?? 0,
            icon: UserCheck,
            iconCls: 'text-emerald-600',
            iconBg: 'bg-emerald-100',
            valueCls: 'text-emerald-600',
          },
          {
            label: 'En Riesgo',
            value: stats?.risk_contacts ?? 0,
            icon: AlertTriangle,
            iconCls: 'text-amber-500',
            iconBg: 'bg-amber-100',
            valueCls: 'text-amber-500',
          },
          {
            label: 'Inactivos',
            value: stats?.inactive_contacts ?? 0,
            icon: UserX,
            iconCls: 'text-slate-500',
            iconBg: 'bg-slate-100',
            valueCls: 'text-slate-600',
          },
        ].map(({ label, value, icon: Icon, iconCls, iconBg, valueCls }) => (
          <Card key={label} className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${valueCls}`}>{value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconCls}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fila 2 — Actividad del CRM (tareas y notas) */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Tareas pend.',
            value: stats?.pending_tasks ?? 0,
            icon: ClipboardList,
            iconCls: 'text-orange-400',
            valueCls: 'text-orange-500',
          },
          {
            label: 'En progreso',
            value: stats?.in_progress_tasks ?? 0,
            icon: Clock,
            iconCls: 'text-blue-400',
            valueCls: 'text-blue-500',
          },
          {
            label: 'Notas total',
            value: stats?.total_notes ?? 0,
            icon: FileText,
            iconCls: 'text-slate-400',
            valueCls: 'text-slate-600',
          },
        ].map(({ label, value, icon: Icon, iconCls, valueCls }) => (
          <Card key={label} className="rounded-2xl shadow-sm border border-slate-100 bg-white/60">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${iconCls}`} />
                <div>
                  <p className="text-xs text-slate-400 font-medium leading-none">{label}</p>
                  <p className={`text-xl font-bold mt-0.5 ${valueCls}`}>{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
