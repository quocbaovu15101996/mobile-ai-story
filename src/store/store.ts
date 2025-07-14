import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// Custom storage object for expo-secure-store
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

// Define the store's state interface
interface StoreState {
  // Add your state properties here
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// Create the store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      count: 0,
      
      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'app-storage', // unique name for the storage key
      storage: createJSONStorage(() => secureStorage), // use our custom storage
      partialize: (state) => ({
        // Only persist specific parts of the state if needed
        count: state.count,
      }),
    }
  )
);

// Example of a selector hook
export const useCount = () => useStore((state) => state.count);

// Example of an action hook
export const useStoreActions = () => ({
  increment: useStore((state) => state.increment),
  decrement: useStore((state) => state.decrement),
  reset: useStore((state) => state.reset),
});
