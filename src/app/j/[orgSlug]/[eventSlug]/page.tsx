'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eventService } from '@/services/event.service';
import { journeyService } from '@/services/journey.service';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiPublicEvent } from '@/types/api.types';
import { EVENT_STATUS_CONFIG } from '@/lib/constants/crm-data';
import { SESSION_KEYS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Users } from 'lucide-react';

// Dark-mode variants for the public QR landing page
const STATUS_DARK_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  live:     'bg-green-500/20 text-green-300 border-green-500/30',
  past:     'bg-slate-500/20 text-slate-300 border-slate-500/30',
  cancelled:'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function QRLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const orgSlug = params.orgSlug as string;
  const eventSlug = params.eventSlug as string;

  const [event, setEvent] = useState<ApiPublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getPublicEvent(orgSlug, eventSlug);
        setEvent(data);
      } catch {
        setError('Evento no encontrado o no disponible.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [orgSlug, eventSlug]);

  const currentPath = `/j/${orgSlug}/${eventSlug}`;

  const handleJoin = async () => {
    if (!event?.journey_id) {
      setJoinMessage('Este evento no tiene un journey asociado.');
      return;
    }

    // Not authenticated → save return URL and go to login
    if (!user) {
      sessionStorage.setItem(SESSION_KEYS.QR_RETURN_URL, currentPath);
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    setJoining(true);
    try {
      // Check onboarding first
      const onboardingCheck = await journeyService.checkOnboarding();
      if (onboardingCheck.should_show) {
        // User has pending onboarding → save QR URL and go to dashboard (gate will trigger)
        sessionStorage.setItem(SESSION_KEYS.QR_RETURN_URL, currentPath);
        router.push('/dashboard');
        return;
      }

      // Enroll in the journey with event_id for traceability
      const enrollment = await journeyService.enrollInJourneyWithEvent(
        event.journey_id,
        event.id,
      );
      router.push(`/journey/${enrollment.id}`);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e?.status === 409 || (e?.message && e.message.includes('activa'))) {
        // Already enrolled → find the enrollment and redirect
        setJoinMessage('Ya estás inscrito en este journey. Redirigiendo a tu progreso...');
        try {
          const enrollments = await journeyService.getMyEnrollments();
          const existing = enrollments.find((en) => en.journey_id === event.journey_id);
          if (existing) {
            setTimeout(() => router.push(`/journey/${existing.id}`), 1500);
          } else {
            router.push('/journey');
          }
        } catch {
          router.push('/journey');
        }
      } else {
        setJoinMessage(e?.message || 'Error al inscribirse. Intenta de nuevo.');
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center px-4">
        <div className="space-y-4">
          <p className="text-slate-400 text-lg">{error || 'Evento no disponible.'}</p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  const config = event.landing_config;
  const bgColor = config.background_color || '#0F172A';
  const primaryColor = config.primary_color || '#3B82F6';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Org + Status */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium" style={{ color: primaryColor }}>
            {event.org_name}
          </p>
          <Badge
            variant="outline"
            className={`${STATUS_DARK_COLORS[event.status] ?? ''} border text-xs`}
          >
            {EVENT_STATUS_CONFIG[event.status]?.label ?? event.status}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white leading-tight">
            {config.title || event.name}
          </h1>
          {config.welcome_message && (
            <p className="text-slate-400 text-lg">{config.welcome_message}</p>
          )}
          {event.description && !config.welcome_message && (
            <p className="text-slate-400">{event.description}</p>
          )}
        </div>

        {/* Event details */}
        <div className="space-y-3 border border-white/10 rounded-xl p-4 bg-white/5">
          {event.start_date && (
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Calendar className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span>
                {new Date(event.start_date).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span>{event.location}</span>
            </div>
          )}
          {event.journey_id && (
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Users className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span>Al unirte, iniciarás tu journey en la plataforma</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {joinMessage ? (
          <p className="text-center text-sm" style={{ color: primaryColor }}>
            {joinMessage}
          </p>
        ) : null}

        {event.journey_id ? (
          <Button
            className="w-full h-12 text-base font-semibold"
            style={{ backgroundColor: primaryColor, color: '#fff', border: 'none' }}
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : user ? (
              'Unirme al evento'
            ) : (
              'Iniciar sesión para unirme'
            )}
          </Button>
        ) : (
          <p className="text-center text-slate-500 text-sm">
            Este evento es solo informativo (sin journey asociado).
          </p>
        )}
      </div>
    </div>
  );
}
