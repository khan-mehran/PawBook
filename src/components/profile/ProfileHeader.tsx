import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit3, UserPlus, MessageCircle, CheckCircle, Camera } from 'lucide-react';
import type { Pet } from '../../data/dummyData';
import { speciesEmoji } from '../../data/dummyData';
import { usePetStore } from '../../store/petStore';
import { useAuthStore } from '../../store/authStore';
import AvatarRing from '../ui/AvatarRing';
import GradientButton from '../ui/GradientButton';
import EditProfileSheet from './EditProfileSheet';

interface ProfileHeaderProps {
  pet: Pet;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ pet }) => {
  const { friends, pendingRequests, sendRequest, toggleFriend, updatePet } = usePetStore();
  const { currentPet, setCurrentPet } = useAuthStore();
  const [showEdit, setShowEdit] = useState(false);

  const isOwn    = pet.id === currentPet.id;
  const isFriend = friends.includes(pet.id);
  const isPending = pendingRequests.includes(pet.id);

  /* Use live currentPet data when viewing own profile so edits reflect instantly */
  const displayPet = isOwn ? currentPet : pet;

  const stats = [
    { label: 'Posts',     value: '48' },
    { label: 'Friends',   value: displayPet.friends.toLocaleString() },
    { label: 'Followers', value: displayPet.followers.toLocaleString() },
  ];

  const handleSaveProfile = (updates: Partial<Pet>) => {
    /* Update everywhere the pet appears */
    updatePet(displayPet.id, updates);
    if (isOwn) setCurrentPet({ ...displayPet, ...updates });
  };

  return (
    <div className="relative">
      {/* Cover photo */}
      <div className="h-48 sm:h-64 w-full overflow-hidden rounded-b-3xl relative">
        <img
          src={displayPet.coverImage}
          alt={`${displayPet.name}'s cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--pb-cover-fade)]/80" />

        {/* Edit cover hint (own profile only) */}
        {isOwn && (
          <button
            onClick={() => setShowEdit(true)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-full px-3 py-1.5 transition-colors cursor-pointer backdrop-blur-sm"
          >
            <Edit3 className="w-3 h-3" /> Edit cover
          </button>
        )}
      </div>

      {/* Profile info */}
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 relative z-10">
          {/* Avatar with edit overlay */}
          <div className="relative flex-shrink-0 group">
            <AvatarRing src={displayPet.profileImage} alt={displayPet.name} size="xl" />
            {isOwn && (
              <button
                onClick={() => setShowEdit(true)}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Edit profile photo"
              >
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {/* Name + action buttons */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-black text-2xl text-[var(--pb-text)]">{displayPet.name}</h1>
                  {displayPet.verified && (
                    <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400" />
                  )}
                  <span className="text-2xl">{speciesEmoji[displayPet.species]}</span>
                </div>
                <p className="text-sm text-[var(--pb-muted)]">{displayPet.breed} · {displayPet.age}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--pb-muted)]" />
                  <p className="text-xs text-[var(--pb-muted)]">{displayPet.location}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isOwn ? (
                  <GradientButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEdit(true)}
                  >
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
        <p className="mt-4 text-sm text-[var(--pb-muted)] leading-relaxed">{displayPet.bio}</p>

        {/* Personality tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {displayPet.tags.map((tag) => (
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

      {/* Edit profile sheet */}
      <AnimatePresence>
        {showEdit && (
          <EditProfileSheet
            pet={displayPet}
            onClose={() => setShowEdit(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileHeader;
