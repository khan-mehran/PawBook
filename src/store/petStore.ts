import { create } from 'zustand';
import type { Pet, Story, Reel } from '../data/dummyData';
import { dummyPets, dummyStories, dummyReels } from '../data/dummyData';

interface PetState {
  pets: Pet[];
  stories: Story[];
  reels: Reel[];
  friends: string[];
  pendingRequests: string[];
  addPet: (pet: Pet) => void;
  updatePet: (petId: string, updates: Partial<Pet>) => void;
  toggleFriend: (petId: string) => void;
  sendRequest: (petId: string) => void;
  acceptRequest: (petId: string) => void;
  declineRequest: (petId: string) => void;
  markStoryViewed: (storyId: string) => void;
  toggleReelLike: (reelId: string) => void;
  toggleReelSave: (reelId: string) => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: dummyPets,
  stories: dummyStories,
  reels: dummyReels,
  friends: ['pet_002', 'pet_005'],
  pendingRequests: ['pet_004'],
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (petId, updates) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === petId ? { ...p, ...updates } : p)),
    })),
  toggleFriend: (petId) =>
    set((state) => ({
      friends: state.friends.includes(petId)
        ? state.friends.filter((id) => id !== petId)
        : [...state.friends, petId],
    })),
  sendRequest: (petId) =>
    set((state) => ({
      pendingRequests: [...state.pendingRequests, petId],
    })),
  acceptRequest: (petId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((id) => id !== petId),
      friends: [...state.friends, petId],
    })),
  declineRequest: (petId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((id) => id !== petId),
    })),
  markStoryViewed: (storyId) =>
    set((state) => ({
      stories: state.stories.map((s) =>
        s.id === storyId ? { ...s, viewed: true } : s
      ),
    })),
  toggleReelLike: (reelId) =>
    set((state) => ({
      reels: state.reels.map((r) =>
        r.id === reelId
          ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
          : r
      ),
    })),
  toggleReelSave: (reelId) =>
    set((state) => ({
      reels: state.reels.map((r) =>
        r.id === reelId ? { ...r, saved: !r.saved } : r
      ),
    })),
}));
