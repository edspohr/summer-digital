import { ApiEventStatus, ApiOrgType } from '@/types/api.types';

// Organization types — single source of truth
// Industry and company_size options are stored in crm.field_options
// (field_name = 'org_industry' / 'org_company_size') and loaded dynamically.
export const ORG_TYPES: { value: ApiOrgType; label: string }[] = [
  { value: 'community', label: 'Comunidad' },
  { value: 'provider', label: 'Proveedor' },
  { value: 'sponsor', label: 'Patrocinador' },
];

// Event status — single source of truth for labels and colors
export const EVENT_STATUS_CONFIG: Record<ApiEventStatus, { label: string; badgeColor: string }> = {
  upcoming: { label: 'Próximo',    badgeColor: 'bg-blue-100 text-blue-700' },
  live:     { label: 'En vivo',    badgeColor: 'bg-green-100 text-green-700' },
  past:     { label: 'Finalizado', badgeColor: 'bg-slate-100 text-slate-600' },
  cancelled:{ label: 'Cancelado',  badgeColor: 'bg-red-100 text-red-700' },
};
