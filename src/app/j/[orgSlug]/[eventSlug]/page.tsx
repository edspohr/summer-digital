'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { eventService } from '@/services/event.service';
import { journeyService } from '@/services/journey.service';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiLandingConfig, ApiPublicEvent } from '@/types/api.types';
import { EVENT_STATUS_CONFIG } from '@/lib/constants/crm-data';
import { SESSION_KEYS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Users } from 'lucide-react';
import React from 'react';

// Dark-mode variants for the public QR landing page
const STATUS_DARK_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  live:     'bg-green-500/20 text-green-300 border-green-500/30',
  past:     'bg-slate-500/20 text-slate-300 border-slate-500/30',
  cancelled:'bg-red-500/20 text-red-300 border-red-500/30',
};

function buildBackground(config: ApiLandingConfig): React.CSSProperties {
  if (config.background_image_url) {
    return {
      backgroundImage: `url(${config.background_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  if (config.background_end_color) {
    const dirMap: Record<string, string> = {
      'to-b':  'to bottom',
      'to-br': 'to bottom right',
      'to-r':  'to right',
      'to-bl': 'to bottom left',
    };
    const cssDir = dirMap[config.gradient_direction || 'to-b'] ?? 'to bottom';
    return { background: `linear-gradient(${cssDir}, ${config.background_color}, ${config.background_end_color})` };
  }
  return { backgroundColor: config.background_color };
}

export default function QRLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const orgSlug = params.orgSlug as string;
  const eventSlug = params.eventSlug as string;

  const [event, setEvent] = useState<ApiPublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

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

  const handleJoin = async (journeyId: string) => {
    if (!user) {
      sessionStorage.setItem(SESSION_KEYS.QR_RETURN_URL, currentPath);
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    setJoiningId(journeyId);
    setJoinMessage(null);
    try {
      const onboardingCheck = await journeyService.checkOnboarding();
      if (onboardingCheck.should_show) {
        sessionStorage.setItem(SESSION_KEYS.QR_RETURN_URL, currentPath);
        router.push('/dashboard');
        return;
      }

      const enrollment = await journeyService.enrollInJourneyWithEvent(
        journeyId,
        event!.id,
      );
      router.push(`/journey/${enrollment.id}`);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e?.status === 409 || (e?.message && e.message.includes('activa'))) {
        try {
          await journeyService.updateEnrollmentEvent(journeyId, event!.id);
        } catch {
          // Best-effort
        }
        setJoinMessage('Ya estás inscrito en este journey. Redirigiendo a tu progreso...');
        try {
          const enrollments = await journeyService.getMyEnrollments();
          const existing = enrollments.find((en) => en.journey_id === journeyId);
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
      setJoiningId(null);
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
  const primaryColor = config.primary_color || '#3B82F6';
  const textColor = config.text_color || '#FFFFFF';
  const hasJourneys = event.journey_ids.length > 0;
  const multiJourney = event.journey_ids.length > 1;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={buildBackground(config)}
    >
      {/* Logo */}
      {config.custom_logo_url && (
        <div className="flex justify-center pt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.custom_logo_url}
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">

          {/* Org name + status */}
          <div className="text-center mb-6 space-y-2">
            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: primaryColor }}>
              {event.org_name}
            </p>
            <Badge
              variant="outline"
              className={`${STATUS_DARK_COLORS[event.status] ?? ''} border text-xs`}
            >
              {EVENT_STATUS_CONFIG[event.status]?.label ?? event.status}
            </Badge>
          </div>

          {/* QR + event info grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            {/* Left: QR to share */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                {currentUrl ? (
                  <QRCode
                    value={currentUrl}
                    size={180}
                    fgColor={config.background_color || '#0F172A'}
                    bgColor="#FFFFFF"
                  />
                ) : (
                  <div className="w-[180px] h-[180px] bg-slate-100 rounded animate-pulse" />
                )}
              </div>
              <p className="text-xs opacity-60" style={{ color: textColor }}>
                Escanea para compartir este evento
              </p>
            </div>

            {/* Right: event details */}
            <div className="space-y-4">
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ color: textColor }}
              >
                {config.title || event.name}
              </h1>

              {config.welcome_message && (
                <p className="text-lg opacity-80" style={{ color: textColor }}>
                  {config.welcome_message}
                </p>
              )}
              {event.description && !config.welcome_message && (
                <p className="opacity-70" style={{ color: textColor }}>
                  {event.description}
                </p>
              )}

              {/* Meta info */}
              <div className="space-y-2 border border-white/10 rounded-xl p-4 bg-white/5">
                {event.start_date && (
                  <div className="flex items-center gap-3 text-sm opacity-80" style={{ color: textColor }}>
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
                  <div className="flex items-center gap-3 text-sm opacity-80" style={{ color: textColor }}>
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                    <span>{event.location}</span>
                  </div>
                )}
                {hasJourneys && (
                  <div className="flex items-center gap-3 text-sm opacity-80" style={{ color: textColor }}>
                    <Users className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                    <span>Al unirte, iniciarás tu journey en la plataforma</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-white/10 mb-8" />

          {/* Feedback message */}
          {joinMessage && (
            <p className="text-center text-sm mb-4 opacity-90" style={{ color: primaryColor }}>
              {joinMessage}
            </p>
          )}

          {/* CTA section */}
          {!hasJourneys ? (
            <p className="text-center opacity-50 text-sm" style={{ color: textColor }}>
              Este evento es solo informativo (sin journey asociado).
            </p>
          ) : multiJourney ? (
            /* Multiple journeys — show cards */
            <div className="space-y-3">
              <p className="text-center text-sm font-semibold mb-4 opacity-80" style={{ color: textColor }}>
                Elige tu programa:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {event.journey_summaries.map((journey) => (
                  <div
                    key={journey.id}
                    className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <p className="font-semibold text-sm" style={{ color: textColor }}>
                      {journey.title}
                    </p>
                    <Button
                      className="w-full h-10 text-sm font-semibold"
                      style={{ backgroundColor: primaryColor, color: '#fff', border: 'none' }}
                      onClick={() => handleJoin(journey.id)}
                      disabled={joiningId === journey.id}
                    >
                      {joiningId === journey.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : user ? (
                        'Unirme'
                      ) : (
                        'Iniciar sesión para unirme'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Single journey — big CTA */
            <Button
              className="w-full max-w-md mx-auto block h-12 text-base font-semibold"
              style={{ backgroundColor: primaryColor, color: '#fff', border: 'none' }}
              onClick={() => handleJoin(event.journey_ids[0])}
              disabled={joiningId === event.journey_ids[0]}
            >
              {joiningId === event.journey_ids[0] ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
