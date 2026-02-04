import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRank } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (role?: string) => Promise<void>;
  logout: () => Promise<void>;
  addPoints: (points: number) => void;
  awardMedal: (medalId: string) => void;
}

const calculateRank = (score: number): UserRank => {
  if (score >= 81) return "Oasis";
  if (score >= 61) return "Bosque";
  if (score >= 41) return "Árbol";
  if (score >= 21) return "Brote";
  return "Semilla";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      login: async (role?: string) => {
        set({ isLoading: true });
        try {
          const user = await authService.login(role);
          // Ensure rank is consistent with score on login
          const rank = calculateRank(user.oasisScore);
          set({ user: { ...user, rank }, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error('Login failed', error);
        }
      },
      logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({ user: null, isLoading: false });
      },
      addPoints: (points: number) => {
        const currentUser = get().user;
        if (currentUser) {
          const newScore = Math.min(currentUser.oasisScore + points, 100);
          const newRank = calculateRank(newScore);
          set({ 
            user: { 
              ...currentUser, 
              oasisScore: newScore,
              rank: newRank
            } 
          });
        }
      },
      awardMedal: (medalId: string) => {
        const currentUser = get().user;
        if (currentUser) {
           // Check if already has medal
           if (currentUser.medals.some(m => m.id === medalId)) return;

           // In a real app, fetch medal details from a service or constant
           const newMedal = {
               id: medalId,
               name: medalId === 'first_workshop' ? 'Primer Taller' : 'Logro Desbloqueado',
               description: 'Has completado una actividad importante.',
               dateEarned: new Date().toISOString()
           };

           set({
               user: {
                   ...currentUser,
                   medals: [...currentUser.medals, newMedal]
               }
           });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
