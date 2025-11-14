import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../utils/storage';

export const useTaxiStore = create((set, get) => ({
  isDayMode: true,
  activeRide: null,
  rideHistory: [],

  setDayMode: (isDayMode) => set({ isDayMode }),

  setActiveRide: (activeRide) => set({ activeRide }),

  addToHistory: (ride) => {
    const newHistory = [ride, ...get().rideHistory];
    set({ rideHistory: newHistory });
    storage.set(STORAGE_KEYS.RIDE_HISTORY, JSON.stringify(newHistory));
  },

  removeFromHistory: (id) => {
    const newHistory = get().rideHistory.filter((r) => r.id !== id);
    set({ rideHistory: newHistory });
    storage.set(STORAGE_KEYS.RIDE_HISTORY, JSON.stringify(newHistory));
  },

  loadHistory: async () => {
    const historyJson = await storage.getString(STORAGE_KEYS.RIDE_HISTORY);
    if (historyJson) {
      try {
        set({ rideHistory: JSON.parse(historyJson) });
      } catch (error) {
        console.error('Failed to parse ride history:', error);
        // Clear corrupted data
        storage.delete(STORAGE_KEYS.RIDE_HISTORY);
      }
    }
  },
}));
