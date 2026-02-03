import { create } from 'zustand';
import { Journey } from '@/types';
import { journeyService } from '@/services/journey.service';

interface JourneyState {
  journey: Journey | null;
  isLoading: boolean;
  fetchJourney: () => Promise<void>;
  completeActivity: (nodeId: string) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  journey: null,
  isLoading: false,
  fetchJourney: async () => {
    set({ isLoading: true });
    try {
      const journey = await journeyService.getJourney();
      set({ journey, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch journey', error);
    }
  },
  completeActivity: async (nodeId: string) => {
    // Optimistic update could go here, for now just call service
    await journeyService.completeNode(nodeId);
    // Refresh journey to get updated status (in a real app, backend would update)
    // For mock, we might need to manually update local state if we want interactivity without refresh
    // But for now let's just re-fetch or manual update
    const currentJourney = get().journey;
    if (currentJourney) {
        const updatedNodes = currentJourney.nodes.map(node => 
            node.id === nodeId ? { ...node, status: 'completed' as const } : node
        );
        set({ journey: { ...currentJourney, nodes: updatedNodes } });
    }
  },
}));
