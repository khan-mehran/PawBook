import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './lib/firebase';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { usePetStore } from './store/petStore';
import PawLoader from './components/ui/PawLoader';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import FeedPage from './components/feed/FeedPage';
import ReelsPage from './components/reels/ReelsPage';
import PetProfilePage from './components/profile/PetProfilePage';
import CreatePetProfile from './components/profile/CreatePetProfile';
import FriendsPage from './components/friends/FriendsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import SettingsPage from './components/settings/SettingsPage';

/* ── Sync theme CSS var on mount ───────────────────── */
const ThemeInit: React.FC = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
};

/* ── Firebase auth + pet-store sync ─────────────────
   Called once on mount. After onAuthStateChanged fires
   we know the real session state — only then render routes.
   Also ensures the logged-in user's custom pet is in
   petStore so /profile/:id always resolves.
   ───────────────────────────────────────────────────── */
const FirebaseAuthSync: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const { setFirebaseUser, currentPet } = useAuthStore();
  const { pets, addPet }                = usePetStore();
  const readyFired                      = useRef(false);

  useEffect(() => {
    const syncCustomPet = () => {
      // If the logged-in user has a custom pet not yet in petStore, add it
      const inStore = pets.some((p) => p.id === currentPet.id);
      if (!inStore) addPet(currentPet);
    };

    if (!isFirebaseConfigured) {
      syncCustomPet();
      onReady();
      return;
    }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) syncCustomPet();
      if (!readyFired.current) {
        readyFired.current = true;
        onReady();
      }
    });
    return unsub;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

/* ── Page transition ─────────────────────────────────
   A simple fade-in on every route change.

   WHY no AnimatePresence / mode="wait":
   React Router updates <Routes> output immediately when
   the URL changes. AnimatePresence mode="wait" holds the
   old div alive during its exit animation — but by then
   <Routes> has already swapped to the new page content,
   so the old div shows the NEW page fading out, then
   there is a blank gap before the new div enters.
   Removing mode="wait" (and AnimatePresence entirely)
   prevents the gap while keeping the enter animation.
   ───────────────────────────────────────────────────── */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

/* ── App shell (navbar + sidebar + content area) ─── */
const AppLayout: React.FC<{ children: React.ReactNode; showRightPanel?: boolean }> = ({
  children,
  showRightPanel = false,
}) => (
  <div className="min-h-screen bg-[var(--pb-bg)] transition-colors duration-300">
    <Navbar />
    <div className="flex pt-16">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-w-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <div className={`flex gap-6 ${showRightPanel ? 'justify-center xl:justify-start' : 'justify-center'}`}>
            <div className="flex-1 max-w-[680px]">{children}</div>
            {showRightPanel && <RightPanel />}
          </div>
        </div>
      </main>
    </div>
  </div>
);

/* ── Route guard + dispatcher ───────────────────── */
const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const location       = useLocation();

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname.startsWith('/register');

  /* Auth pages: redirect to feed if already logged in */
  if (isAuthRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return (
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  /* All other pages require login */
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  /* Reels is full-screen — no chrome */
  if (location.pathname === '/reels') return <ReelsPage />;

  return (
    <AppLayout showRightPanel={location.pathname === '/'}>
      {/*
        PageTransition key changes on every navigation → triggers a new
        fade-in for each page. No AnimatePresence needed, no blank gap.
      */}
      <PageTransition>
        <Routes>
          <Route path="/"               element={<FeedPage />} />
          <Route path="/profile/:petId" element={<PetProfilePage />} />
          <Route path="/create"         element={<CreatePetProfile />} />
          <Route path="/friends"        element={<FriendsPage />} />
          <Route path="/explore"        element={<FriendsPage />} />
          <Route path="/settings"       element={<SettingsPage />} />
          <Route path="/saved"          element={
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔖</div>
              <p className="text-xl font-semibold text-[var(--pb-text)] mb-2">Saved Posts</p>
              <p className="text-[var(--pb-muted)]">Your bookmarked posts will appear here.</p>
            </div>
          } />
          <Route path="*" element={
            <div className="text-center py-20">
              <div className="text-8xl mb-4">🐾</div>
              <p className="text-2xl font-display font-black text-[var(--pb-text)] mb-2">Page not found</p>
              <p className="text-[var(--pb-muted)]">This paw print leads nowhere!</p>
            </div>
          } />
        </Routes>
      </PageTransition>
    </AppLayout>
  );
};

/* ── Root ───────────────────────────────────────── */
const App: React.FC = () => {
  // authReady starts true when Firebase is not configured (demo mode)
  // so the app renders immediately without waiting for a Firebase callback
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);

  return (
    <BrowserRouter>
      <ThemeInit />
      <FirebaseAuthSync onReady={() => setAuthReady(true)} />
      {!authReady ? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--pb-bg)]">
          <div className="text-center">
            <div className="text-6xl mb-4">🐾</div>
            <PawLoader />
          </div>
        </div>
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  );
};

export default App;
