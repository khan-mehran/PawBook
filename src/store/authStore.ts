import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pet } from '../data/dummyData';
import { dummyPets } from '../data/dummyData';
import { signOutUser } from '../lib/firebaseAuth';
import type { FirebaseUser } from '../lib/firebaseAuth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  provider?: string;
}

interface AuthState {
  /* Firebase-driven (NOT persisted — Firebase restores these itself) */
  isLoggedIn: boolean;
  user: AuthUser | null;

  /* App-level (persisted to localStorage) */
  currentPet: Pet;
  hasPetSetup: boolean;

  /* Called by the onAuthStateChanged listener in App.tsx */
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;

  /* Called after the pet-setup wizard completes */
  setCurrentPet: (pet: Pet) => void;

  logout: () => Promise<void>;
}

const speciesDefaultImages: Record<string, string> = {
  Dog:     'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
  Cat:     'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
  Bird:    'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
  Rabbit:  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
  Hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
  Reptile: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=400',
  Other:   'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
};

export { speciesDefaultImages };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /* Not persisted — Firebase auth restores on refresh */
      isLoggedIn: false,
      user: null,

      /* Persisted */
      currentPet: dummyPets[0],
      hasPetSetup: false,

      setFirebaseUser: (fbUser) => {
        if (fbUser) {
          set({
            isLoggedIn: true,
            user: {
              id:       fbUser.uid,
              name:     fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'FurBook User',
              email:    fbUser.email ?? '',
              photoURL: fbUser.photoURL ?? undefined,
              provider: fbUser.providerData?.[0]?.providerId ?? 'email',
            },
          });
        } else {
          /* Firebase says no user → clear everything */
          set({ isLoggedIn: false, user: null, hasPetSetup: false, currentPet: dummyPets[0] });
        }
      },

      setCurrentPet: (pet) => set({ currentPet: pet, hasPetSetup: true }),

      logout: async () => {
        await signOutUser();
        /* setFirebaseUser(null) will fire via onAuthStateChanged automatically,
           but we clear state eagerly for instant UI response */
        set({ isLoggedIn: false, user: null, hasPetSetup: false, currentPet: dummyPets[0] });
      },
    }),
    {
      name: 'furbook-auth',
      /* Only persist pet data — NOT auth state (Firebase owns that) */
      partialize: (state) => ({
        currentPet:  state.currentPet,
        hasPetSetup: state.hasPetSetup,
      }),
    }
  )
);

/* Build a guest pet object from a Firebase user (used after social sign-in) */
export const buildGuestPet = (fbUser: FirebaseUser): Pet => ({
  id:           `pet_${fbUser.uid}`,
  name:         fbUser.displayName?.split(' ')[0] ?? 'My Pet',
  species:      'Dog',
  breed:        'Mixed',
  age:          'Puppy',
  owner:        fbUser.displayName ?? fbUser.email ?? '',
  location:     'Earth 🌍',
  bio:          `Hi, I just joined FurBook! 🐾`,
  profileImage: fbUser.photoURL ?? speciesDefaultImages.Dog,
  coverImage:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
  friends:      0,
  followers:    0,
  tags:         ['New here! 🌟'],
  verified:     false,
  gallery:      [],
});
