import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import type { Pet } from '../../data/dummyData';
import { speciesEmoji } from '../../data/dummyData';
import { usePetStore } from '../../store/petStore';
import { useAuthStore } from '../../store/authStore';
import AvatarRing from '../ui/AvatarRing';
import GradientButton from '../ui/GradientButton';

interface FriendCardProps {
  pet: Pet;
  mode?: 'suggestion' | 'friend' | 'request';
  index?: number;
}

const FriendCard: React.FC<FriendCardProps> = ({ pet, mode = 'suggestion', index = 0 }) => {
  const { friends, pendingRequests, sendRequest, acceptRequest, declineRequest, toggleFriend } = usePetStore();
  useAuthStore();

  const isFriend = friends.includes(pet.id);
  const isPending = pendingRequests.includes(pet.id);

  const mutualCount = Math.floor(Math.random() * 12) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 0 30px rgba(255,107,53,0.12)' }}
      className="bg-[var(--pb-card)] border border-[var(--pb-border-faint)] rounded-2xl p-5 hover:border-orange-500/20 transition-all duration-300 flex flex-col items-center text-center gap-3"
    >
      <Link to={`/profile/${pet.id}`} className="relative">
        <AvatarRing src={pet.profileImage} alt={pet.name} size="xl" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--pb-card)] border border-[var(--pb-border)] flex items-center justify-center text-base">
          {speciesEmoji[pet.species]}
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-center gap-1.5">
          <Link to={`/profile/${pet.id}`} className="font-display font-bold text-[var(--pb-text)] hover:text-orange-400 transition-colors">
            {pet.name}
          </Link>
          {pet.verified && <span className="text-xs">✅</span>}
        </div>
        <p className="text-xs text-[var(--pb-muted)] mt-0.5">{pet.breed}</p>
        <p className="text-xs text-[var(--pb-muted)]">{pet.location}</p>
        <p className="text-xs text-violet-400 mt-1">
          {mutualCount} mutual friends
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-1">
        {pet.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-full px-2 py-0.5 text-[var(--pb-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        {mode === 'request' ? (
          <>
            <GradientButton variant="primary" size="sm" className="flex-1" onClick={() => acceptRequest(pet.id)}>
              Accept
            </GradientButton>
            <GradientButton variant="outline" size="sm" className="flex-1" onClick={() => declineRequest(pet.id)}>
              Decline
            </GradientButton>
          </>
        ) : isFriend ? (
          <>
            <GradientButton variant="ghost" size="sm" className="flex-1">
              <span className="flex items-center gap-1 justify-center">
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </span>
            </GradientButton>
            <GradientButton variant="outline" size="sm" onClick={() => toggleFriend(pet.id)}>
              <UserCheck className="w-3.5 h-3.5" />
            </GradientButton>
          </>
        ) : isPending ? (
          <GradientButton variant="ghost" size="sm" className="flex-1" disabled>
            Pending
          </GradientButton>
        ) : (
          <>
            <GradientButton variant="primary" size="sm" className="flex-1" onClick={() => sendRequest(pet.id)}>
              <span className="flex items-center gap-1 justify-center">
                <UserPlus className="w-3.5 h-3.5" /> Add Friend
              </span>
            </GradientButton>
            <GradientButton variant="ghost" size="sm">
              <MessageCircle className="w-3.5 h-3.5" />
            </GradientButton>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FriendCard;
