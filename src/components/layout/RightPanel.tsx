import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { useAuthStore } from '../../store/authStore';
import { trendingHashtags, upcomingEvents, speciesEmoji } from '../../data/dummyData';
import GlassCard from '../ui/GlassCard';
import AvatarRing from '../ui/AvatarRing';
import GradientButton from '../ui/GradientButton';

const RightPanel: React.FC = () => {
  const { pets, friends, sendRequest, pendingRequests } = usePetStore();
  const { currentPet } = useAuthStore();

  const suggestions = pets
    .filter((p) => p.id !== currentPet.id && !friends.includes(p.id))
    .slice(0, 3);

  return (
    <aside className="hidden xl:flex flex-col w-72 gap-4">
      {/* Pets You May Know */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-sm text-[var(--pb-text)]">Pets You May Know</h3>
        </div>
        <div className="flex flex-col gap-3">
          {suggestions.map((pet, i) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <Link to={`/profile/${pet.id}`}>
                <AvatarRing src={pet.profileImage} alt={pet.name} size="sm" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${pet.id}`} className="hover:text-orange-400 transition-colors">
                  <p className="font-semibold text-sm text-[var(--pb-text)] truncate">{pet.name}</p>
                </Link>
                <p className="text-xs text-[var(--pb-muted)] truncate">
                  {speciesEmoji[pet.species]} {pet.breed}
                </p>
              </div>
              <GradientButton
                size="sm"
                variant={pendingRequests.includes(pet.id) ? 'ghost' : 'primary'}
                onClick={() => sendRequest(pet.id)}
                disabled={pendingRequests.includes(pet.id)}
              >
                {pendingRequests.includes(pet.id) ? 'Sent' : 'Add'}
              </GradientButton>
            </motion.div>
          ))}
        </div>
        <Link to="/friends" className="block mt-3 text-center text-xs text-orange-400 hover:text-orange-300 transition-colors">
          See all suggestions →
        </Link>
      </GlassCard>

      {/* Trending Hashtags */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-sm text-[var(--pb-text)]">Trending</h3>
        </div>
        <div className="flex flex-col gap-2">
          {trendingHashtags.map((h, i) => (
            <motion.div
              key={h.tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between hover:bg-[var(--pb-hover)] rounded-xl px-2 py-1.5 cursor-pointer transition-colors group"
            >
              <span className="text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                {h.tag}
              </span>
              <span className="text-xs text-[var(--pb-muted)]">{h.count}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Upcoming Events */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-teal-400" />
          <h3 className="font-semibold text-sm text-[var(--pb-text)]">Upcoming Events</h3>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 cursor-pointer hover:bg-[var(--pb-hover)] rounded-xl p-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-violet-600/20 flex items-center justify-center text-xl flex-shrink-0">
                {event.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--pb-text)]">{event.title}</p>
                <p className="text-xs text-teal-400">{event.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </aside>
  );
};

export default RightPanel;
