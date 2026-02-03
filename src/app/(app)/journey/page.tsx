'use client';

import { JourneyMap } from '@/features/journey/components/JourneyMap';

export default function JourneyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Viaje</h1>
        <p className="text-slate-500">Explora tu mapa de progreso y completa actividades.</p>
      </div>
      
      <JourneyMap />
    </div>
  );
}
