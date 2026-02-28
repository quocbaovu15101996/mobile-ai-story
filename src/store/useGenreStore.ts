import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getGenres } from '../services/api/thread';

interface Genre {
  type: string;
  image: string;
  name: string;
}

interface GenreState {
  genres: Genre[];
  isLoading: boolean;
  lastFetched: number | null;
}

interface GenreActions {
  setGenres: (genres: Genre[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchGenres: () => Promise<void>;
}

type GenreStore = GenreState & GenreActions;

export const useGenreStore = create<GenreStore>()(
  persist(
    (set, get) => ({
      genres: [],
      isLoading: false,
      lastFetched: null,

      setGenres: (genres: Genre[]) =>
        set({ genres, lastFetched: Date.now() }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      fetchGenres: async () => {
        set({ isLoading: true });
        try {
          const response = await getGenres();
          if (response.status === 200 && response.data) {
            set({ genres: response.data, lastFetched: Date.now() });
          }
        } catch (error) {
          console.error('Failed to fetch genres', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'genre-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        genres: state.genres,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Selector hooks
export const useGenres = () => useGenreStore((state) => state.genres);
export const useGenresLoading = () => useGenreStore((state) => state.isLoading);
export const useFetchGenres = () => useGenreStore((state) => state.fetchGenres);
