import { Journey, JourneyNode } from '@/types';

class MockJourneyService {
  private static readonly LATENCY = 1000;

  private static readonly MOCK_JOURNEY: Journey = {
    id: 'j1',
    title: 'Mi Viaje de Transformación',
    description: 'Tu camino para convertirte en un agente de cambio.',
    nodes: [
      {
        id: 'n1',
        title: 'Bienvenida al Oasis',
        description: 'Conoce la misión de Fundación Summer y tu rol aquí.',
        type: 'video',
        status: 'completed',
        x: 10,
        y: 50,
        connections: ['n2'],
      },
      {
        id: 'n2',
        title: 'Descubriendo mi Propósito',
        description: 'Un breve cuestionario para entender tus motivaciones.',
        type: 'quiz',
        status: 'completed',
        x: 30,
        y: 20,
        connections: ['n3'],
      },
      {
        id: 'n3',
        title: 'Taller: Comunicación Empática',
        description: 'Aprende a escuchar y comunicar desde el corazón.',
        type: 'workshop',
        status: 'in-progress',
        x: 50,
        y: 50,
        connections: ['n4'],
      },
      {
        id: 'n4',
        title: 'Desafío Práctico #1',
        description: 'Aplica lo aprendido en tu entorno cercano.',
        type: 'challenge',
        status: 'locked',
        x: 70,
        y: 80,
        connections: ['n5'],
      },
      {
        id: 'n5',
        title: 'Evaluación de Medio Término',
        description: 'Mide tu progreso y consolida conocimientos.',
        type: 'quiz',
        status: 'locked',
        x: 90,
        y: 50,
        connections: [],
      },
    ],
  };

  async getJourney(): Promise<Journey> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MockJourneyService.MOCK_JOURNEY);
      }, MockJourneyService.LATENCY);
    });
  }

  async completeNode(nodeId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Node ${nodeId} completed`);
        resolve();
      }, 500);
    });
  }
}

export const journeyService = new MockJourneyService();
