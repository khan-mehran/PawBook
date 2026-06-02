import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Users, Compass, Bookmark, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AvatarRing from '../ui/AvatarRing';

const navItems = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/reels', icon: Film, label: 'Reels' },
  { to: '/friends', icon: Users, label: 'Friends' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { currentPet } = useAuthStore();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-[var(--pb-bg)] border-r border-[var(--pb-border-faint)] py-6 px-3 overflow-y-auto">
      {/* Profile mini card */}
      <NavLink to={`/profile/${currentPet.id}`} className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-[var(--pb-hover)] transition-colors mb-4">
        <AvatarRing src={currentPet.profileImage} alt={currentPet.name} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[var(--pb-text)] truncate">{currentPet.name}</p>
          <p className="text-xs text-[var(--pb-muted)] truncate">{currentPet.species} · {currentPet.location.split(',')[0]}</p>
        </div>
      </NavLink>

      <div className="h-px bg-white/5 mx-3 mb-4" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-violet-600/20 text-orange-400 border border-orange-500/20'
                  : 'text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:bg-[var(--pb-hover)]'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Species filter quick nav */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider px-4 mb-2">Browse by Species</p>
        <div className="flex flex-wrap gap-2 px-4">
          {['🐶 Dogs', '🐱 Cats', '🦜 Birds', '🐰 Rabbits'].map((s) => (
            <button
              key={s}
              className="text-xs bg-white/5 border border-[var(--pb-border)] rounded-full px-3 py-1 text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:border-orange-500/30 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pt-4">
        <p className="text-xs text-[var(--pb-muted)]/60 text-center">
          Made with 🐾 for pets
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
