import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import FeedPage from './components/feed/FeedPage';
import ReelsPage from './components/reels/ReelsPage';
import PetProfilePage from './components/profile/PetProfilePage';
import CreatePetProfile from './components/profile/CreatePetProfile';
import FriendsPage from './components/friends/FriendsPage';

const ThemeInit: React.FC = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
};

const AppLayout: React.FC<{ children: React.ReactNode; showRightPanel?: boolean }> = ({
  children,
  showRightPanel = true,
}) => {
  return (
    <div className="min-h-screen bg-[var(--pb-bg)] transition-colors duration-300">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-64 xl:mr-0 min-w-0">
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
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  if (location.pathname === '/reels') {
    return <ReelsPage />;
  }

  return (
    <AppLayout showRightPanel={location.pathname === '/'}>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/profile/:petId" element={<PetProfilePage />} />
          <Route path="/create" element={<CreatePetProfile />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/explore" element={<FriendsPage />} />
          <Route path="/saved" element={
            <div className="text-center py-20 text-[#9999BB]">
              <div className="text-6xl mb-4">🔖</div>
              <p className="text-xl font-semibold text-[#F0F0FF] mb-2">Saved Posts</p>
              <p>Your bookmarked posts will appear here</p>
            </div>
          } />
          <Route path="/settings" element={
            <div className="text-center py-20 text-[#9999BB]">
              <div className="text-6xl mb-4">⚙️</div>
              <p className="text-xl font-semibold text-[#F0F0FF] mb-2">Settings</p>
              <p>Account settings coming soon</p>
            </div>
          } />
          <Route path="*" element={
            <div className="text-center py-20">
              <div className="text-8xl mb-4">🐾</div>
              <p className="text-2xl font-display font-black text-[#F0F0FF] mb-2">Page not found</p>
              <p className="text-[#9999BB]">This paw print leads nowhere!</p>
            </div>
          } />
        </Routes>
      </PageWrapper>
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeInit />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
