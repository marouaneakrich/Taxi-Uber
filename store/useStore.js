import { create } from 'zustand';
import { CASA_CENTER } from '../utils/constants';


export const useStore = create((set) => ({
  screen: 'map',
  isNightMode: false,
  currentLocation: CASA_CENTER,
  taxis: [],
  activeRide: null,
  rideHistory: [],
  
  setScreen: (screen) => set({ screen }),
  toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),
  setTaxis: (taxis) => set({ taxis }),
  setActiveRide: (ride) => set({ activeRide: ride }),
  addToHistory: (ride) => set((state) => ({ 
    rideHistory: [ride, ...state.rideHistory] 
  })),
  removeFromHistory: (rideId) => set((state) => ({
    rideHistory: state.rideHistory.filter(r => r.id !== rideId)
  })),
  loadHistory: (history) => set({ rideHistory: history })
}));