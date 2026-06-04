import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './lib/firebase';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
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

/* ── Sync theme CSS var on mount ─── */
const ThemeInit: React.FC = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
};

/* ── Firebase auth state listener ─── */
const FirebaseAuthSync: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const { setFirebaseUser } = useAuthStore();
  useEffect(() => {
    if (!isFirebaseConfigured) {
      onReady();
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      onReady();
    });
    return unsub;
  }, []);          // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

/* ── Animated page wrapper ───────── */
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Authenticated layout ────────── */
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

/* ── Route dispatcher ────────────── */
const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/register');

  /* Public auth routes — redirect to feed if already logged in */
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

  /* All other routes require login */
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  /* Reels is full-screen — no chrome */
  if (location.pathname === '/reels') return <ReelsPage />;

  return (
    <AppLayout showRightPanel={location.pathname === '/'}>
      <PageWrapper>
        <Routes>
          <Route path="/"                  element={<FeedPage />} />
          <Route path="/profile/:petId"    element={<PetProfilePage />} />
          <Route path="/create"            element={<CreatePetProfile />} />
          <Route path="/friends"           element={<FriendsPage />} />
          <Route path="/explore"           element={<FriendsPage />} />
          <Route path="/settings"          element={<SettingsPage />} />
          <Route path="/saved"             element={
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
      </PageWrapper>
    </AppLayout>
  );
};

const App: React.FC = () => {
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);

  return (
    <BrowserRouter>
      <ThemeInit />
      <FirebaseAuthSync onReady={() => setAuthReady(true)} />
      {!authReady ? (
        /* Show spinner while Firebase resolves the persisted session */
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
