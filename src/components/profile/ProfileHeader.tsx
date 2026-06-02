import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit3, UserPlus, MessageCircle, CheckCircle } from 'lucide-react';
import type { Pet } from '../../data/dummyData';
import { speciesEmoji } from '../../data/dummyData';
import { usePetStore } from '../../store/petStore';
import { useAuthStore } from '../../store/authStore';
import AvatarRing from '../ui/AvatarRing';
import GradientButton from '../ui/GradientButton';

interface ProfileHeaderProps {
  pet: Pet;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ pet }) => {
  const { friends, pendingRequests, sendRequest, toggleFriend } = usePetStore();
  const { currentPet } = useAuthStore();

  const isOwn = pet.id === currentPet.id;
  const isFriend = friends.includes(pet.id);
  const isPending = pendingRequests.includes(pet.id);

  const stats = [
    { label: 'Posts', value: '48' },
    { label: 'Friends', value: pet.friends.toLocaleString() },
    { label: 'Followers', value: pet.followers.toLocaleString() },
  ];

  return (
    <div className="relative">
      {/* Cover photo */}
      <div className="h-48 sm:h-64 w-full overflow-hidden rounded-b-3xl relative">
        <img
          src={pet.coverImage}
          alt={`${pet.name}'s cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--pb-cover-fade)]/80" />
      </div>

      {/* Profile info */}
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 relative z-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <AvatarRing src={pet.profileImage} alt={pet.name} size="xl" />
          </div>

          {/* Name & actions */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-black text-2xl text-[var(--pb-text)]">{pet.name}</h1>
                  {pet.verified && (
                    <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400" />
                  )}
                  <span className="text-2xl">{speciesEmoji[pet.species]}</span>
                </div>
                <p className="text-sm text-[var(--pb-muted)]">{pet.breed} · {pet.age}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--pb-muted)]" />
                  <p className="text-xs text-[var(--pb-muted)]">{pet.location}</p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-2">
                {isOwn ? (
                  <GradientButton variant="outline" size="sm">
                    <span className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                    </span>
                  </GradientButton>
                ) : (
                  <>
                    <GradientButton
                      variant={isFriend ? 'ghost' : isPending ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() => isFriend ? toggleFriend(pet.id) : sendRequest(pet.id)}
                      disabled={isPending}
                    >
                      <span className="flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" />
                        {isFriend ? 'Friends' : isPending ? 'Pending' : 'Add Friend'}
                      </span>
                    </GradientButton>
                    <GradientButton variant="ghost" size="sm">
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> Message
                      </span>
                    </GradientButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm text-[var(--pb-muted)] leading-relaxed">{pet.bio}</p>

        {/* Personality tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {pet.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gradient-to-r from-orange-500/10 to-violet-600/10 border border-orange-500/20 rounded-full px-3 py-1 text-orange-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5 py-4 border-y border-[var(--pb-border-faint)]">
          {stats.map(({ label, value }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              className="text-center cursor-pointer"
            >
              <p className="font-display font-black text-xl text-[var(--pb-text)]">{value}</p>
              <p className="text-xs text-[var(--pb-muted)] mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
