import { CRMTable } from '@/features/crm/CRMTable';

export default function CRMPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión CRM</h1>
        <p className="text-slate-500">Administración de usuarios y seguimiento.</p>
      </div>
      <CRMTable />
    </div>
  );
}
