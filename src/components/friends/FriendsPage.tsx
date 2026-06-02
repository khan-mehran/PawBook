import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, MapPin, Bell } from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { useAuthStore } from '../../store/authStore';
import FriendCard from './FriendCard';

type Tab = 'friends' | 'requests' | 'suggestions' | 'nearby';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'friends', label: 'All Friends', icon: Users },
  { id: 'requests', label: 'Requests', icon: Bell },
  { id: 'suggestions', label: 'Suggestions', icon: UserPlus },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
];

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const { pets, friends, pendingRequests } = usePetStore();
  const { currentPet } = useAuthStore();

  const friendPets = pets.filter((p) => friends.includes(p.id));
  const requestPets = pets.filter((p) => pendingRequests.includes(p.id));
  const suggestionPets = pets.filter(
    (p) => p.id !== currentPet.id && !friends.includes(p.id) && !pendingRequests.includes(p.id)
  );
  const nearbyPets = pets.filter((p) => p.id !== currentPet.id).slice(0, 4);

  const displayPets = {
    friends: friendPets,
    requests: requestPets,
    suggestions: suggestionPets,
    nearby: nearbyPets,
  }[activeTab];

  const mode = activeTab === 'requests' ? 'request' : activeTab === 'friends' ? 'friend' : 'suggestion';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-[var(--pb-text)] mb-1">Friends</h1>
        <p className="text-[var(--pb-muted)] text-sm">Discover amazing pets from around the world</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--pb-card)] rounded-2xl p-1.5 mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0
              ${activeTab === id
                ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-lg'
                : 'text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:bg-[var(--pb-hover)]'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'requests' && requestPets.length > 0 && (
              <span className="bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {requestPets.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayPets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-[var(--pb-muted)]">No pets here yet!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayPets.map((pet, i) => (
            <FriendCard key={pet.id} pet={pet} mode={mode} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
