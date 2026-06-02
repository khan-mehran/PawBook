import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePetStore } from '../../store/petStore';
import AvatarRing from '../ui/AvatarRing';

interface StoryBarProps {
  onOpenStory: (index: number) => void;
}

const StoryBar: React.FC<StoryBarProps> = ({ onOpenStory }) => {
  const { currentPet } = useAuthStore();
  const { stories, pets } = usePetStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
      {/* Your story */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
      >
        <div className="relative">
          <AvatarRing src={currentPet.profileImage} alt={currentPet.name} size="lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-orange-500 to-violet-600 rounded-full flex items-center justify-center border-2 border-[var(--pb-ring-border)]">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xs text-[var(--pb-muted)] font-medium text-center w-16 truncate">Your Story</p>
      </motion.div>

      {/* Friend stories */}
      {stories.map((story, index) => {
        const pet = pets.find((p) => p.id === story.petId);
        if (!pet) return null;
        return (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
            onClick={() => onOpenStory(index)}
          >
            <div className="relative">
              <AvatarRing
                src={pet.profileImage}
                alt={pet.name}
                size="lg"
                viewed={story.viewed}
              />
              {!story.viewed && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-[var(--pb-ring-border)]" />
              )}
            </div>
            <div className="text-center w-16">
              <p className="text-xs text-[var(--pb-text)] font-medium truncate">{pet.name}</p>
              <p className="text-[10px] text-[var(--pb-muted)]">{story.expiresIn}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StoryBar;
