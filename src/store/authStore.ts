import { create } from 'zustand';
import type { Pet } from '../data/dummyData';
import { dummyPets } from '../data/dummyData';

interface AuthState {
  currentPet: Pet;
  setCurrentPet: (pet: Pet) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentPet: dummyPets[0],
  setCurrentPet: (pet) => set({ currentPet: pet }),
}));
