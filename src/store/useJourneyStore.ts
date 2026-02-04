import { create } from 'zustand';
import { Journey } from '@/types';
import { journeyService } from '@/services/journey.service';
import { useAuthStore } from './useAuthStore';

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
    
    // Add points for completion (Example: 5 points per activity)
    useAuthStore.getState().addPoints(5);

    // Refresh journey to get updated status (in a real app, backend would update)
    // For mock, we might need to manually update local state if we want interactivity without refresh
    const currentJourney = get().journey;
    if (currentJourney) {
        let nextNodeId: string | undefined;

        const updatedNodes = currentJourney.nodes.map(node => {
            if (node.id === nodeId) {
                // Determine next node logic (simple version: use connections[0])
                if (node.connections.length > 0) {
                    nextNodeId = node.connections[0];
                }
                return { ...node, status: 'completed' as const };
            }
            return node;
        });
        
        // Unlock next node if found
        const finalNodes = updatedNodes.map(node => {
            if (nextNodeId && node.id === nextNodeId && node.status === 'locked') {
                return { ...node, status: 'available' as const };
            }
            return node;
        });

        set({ journey: { ...currentJourney, nodes: finalNodes } });
    }
  },
}));
