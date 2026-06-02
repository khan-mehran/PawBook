import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3x3, Film, Heart, Tag } from 'lucide-react';
import { usePetStore } from '../../store/petStore';
import { useFeedStore } from '../../store/feedStore';
import ProfileHeader from './ProfileHeader';
import PhotoGrid from './PhotoGrid';
import PostCard from '../feed/PostCard';

type Tab = 'posts' | 'photos' | 'reels' | 'tagged';

const TABS: { id: Tab; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'posts', icon: Grid3x3, label: 'Posts' },
  { id: 'photos', icon: Heart, label: 'Photos' },
  { id: 'reels', icon: Film, label: 'Reels' },
  { id: 'tagged', icon: Tag, label: 'Tagged' },
];

const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const { pets } = usePetStore();
  const { posts } = useFeedStore();
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return <Navigate to="/" />;

  const petPosts = posts.filter((p) => p.petId === pet.id);

  return (
    <div className="pb-10">
      <ProfileHeader pet={pet} />

      {/* Tab bar */}
      <div className="flex border-b border-[var(--pb-border-faint)] px-4 mt-4">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer
              ${activeTab === id ? 'text-orange-400' : 'text-[var(--pb-muted)] hover:text-[var(--pb-text)]'}
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
            {activeTab === id && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-violet-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pt-5">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-4">
            {petPosts.length > 0
              ? petPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
              : <div className="text-center py-16 text-[var(--pb-muted)]">No posts yet 🐾</div>
            }
          </div>
        )}

        {activeTab === 'photos' && <PhotoGrid pet={pet} />}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[9/16] bg-[var(--pb-surface)] rounded-lg overflow-hidden relative cursor-pointer group"
              >
                <img
                  src={pet.profileImage}
                  alt="Reel"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="text-center py-16 text-[var(--pb-muted)]">No tagged posts yet 🏷️</div>
        )}
      </div>
    </div>
  );
};

export default PetProfilePage;
