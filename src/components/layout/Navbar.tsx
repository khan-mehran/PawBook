import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import AvatarRing from '../ui/AvatarRing';

const Navbar: React.FC = () => {
  const { currentPet } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-[var(--pb-border-faint)] transition-colors duration-300" style={{ backgroundColor: 'var(--pb-nav-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🐾</span>
          <span className="font-display font-black text-xl bg-gradient-to-r from-orange-500 via-violet-500 to-teal-400 bg-clip-text text-transparent hidden sm:block">
            FurBook
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
            <input
              type="text"
              placeholder="Search pets, #hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-full pl-10 pr-4 py-2 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 rounded-full text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:bg-[var(--pb-hover)] transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/create"
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-violet-600 rounded-full px-3 py-1.5 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-shadow"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Create</span>
          </Link>

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:bg-[var(--pb-hover)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5" />
              : <Moon className="w-5 h-5" />
            }
          </motion.button>

          <button
            className="relative p-2 rounded-full text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:bg-[var(--pb-hover)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>

          <Link to={`/profile/${currentPet.id}`}>
            <AvatarRing src={currentPet.profileImage} alt={currentPet.name} size="sm" />
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pb-muted)]" />
                <input
                  type="text"
                  placeholder="Search pets, #hashtags..."
                  autoFocus
                  className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-full pl-10 pr-4 py-2 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
