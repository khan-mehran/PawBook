import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import type { Post } from '../../data/dummyData';
import { usePetStore } from '../../store/petStore';
import { useFeedStore } from '../../store/feedStore';
import { useAuthStore } from '../../store/authStore';
import { speciesEmoji } from '../../data/dummyData';
import AvatarRing from '../ui/AvatarRing';
import ReactionBar from '../ui/ReactionBar';

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard: React.FC<PostCardProps> = memo(({ post, index }) => {
  const { pets } = usePetStore();
  const { toggleLike, toggleSave } = useFeedStore();
  const { currentPet } = useAuthStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [justLiked, setJustLiked] = useState(false);

  const pet = pets.find((p) => p.id === post.petId);
  if (!pet) return null;

  const images = post.images || [];

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.liked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  const bgColors: Record<string, string> = {
    '#7C3AED': 'from-violet-600 to-violet-800',
    '#FF6B35': 'from-orange-500 to-orange-700',
    '#00D4AA': 'from-teal-500 to-teal-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-[var(--pb-card)] border border-[var(--pb-border-faint)] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Link to={`/profile/${pet.id}`}>
          <AvatarRing src={pet.profileImage} alt={pet.name} size="sm" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link to={`/profile/${pet.id}`} className="font-semibold text-sm text-[var(--pb-text)] hover:text-orange-400 transition-colors">
              {pet.name}
            </Link>
            {pet.verified && <span className="text-xs">✅</span>}
            <span className="text-base">{speciesEmoji[pet.species]}</span>
          </div>
          <p className="text-xs text-[var(--pb-muted)]">{post.timestamp} · {pet.location}</p>
        </div>
        <button className="p-1.5 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer" aria-label="More options">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {post.type === 'status' && (
        <div className={`mx-4 mb-3 rounded-2xl p-6 bg-gradient-to-br ${bgColors[post.bgColor || '#7C3AED'] || 'from-violet-600 to-violet-800'} flex items-center justify-center min-h-[120px]`}>
          <p className="text-white text-lg font-semibold text-center leading-relaxed">{post.caption}</p>
        </div>
      )}

      {post.type === 'achievement' && (
        <div className="mx-4 mb-3 rounded-2xl p-5 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">Achievement Unlocked!</span>
          </div>
          <p className="text-[var(--pb-text)] text-sm leading-relaxed">{post.caption}</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="relative aspect-square overflow-hidden">
          <img
            src={images[imageIndex]}
            alt="Post"
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex((prev) => Math.max(0, prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer disabled:opacity-30"
                disabled={imageIndex === 0}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageIndex((prev) => Math.min(images.length - 1, prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer disabled:opacity-30"
                disabled={imageIndex === images.length - 1}
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imageIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-black/50 rounded-full px-2 py-0.5 text-white text-xs">
                {imageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Caption */}
      {post.type !== 'status' && (
        <p className="px-4 pt-3 pb-1 text-sm text-[var(--pb-text)] leading-relaxed">
          {post.caption}
        </p>
      )}

      {/* Reactions summary */}
      <div className="px-4 py-2 flex items-center justify-between">
        <ReactionBar reactions={post.reactions} />
        <p className="text-xs text-[var(--pb-muted)]">{post.comments} comments · {post.shares} shares</p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--pb-hover)]" />

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">
        <motion.button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors cursor-pointer ${post.liked ? 'text-rose-500' : 'text-[var(--pb-muted)] hover:text-rose-500 hover:bg-rose-500/5'}`}
          aria-label="Like"
        >
          <motion.div animate={justLiked ? { scale: [1, 1.5, 1] } : {}}>
            <Heart className={`w-5 h-5 ${post.liked ? 'fill-rose-500' : ''}`} />
          </motion.div>
          <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
        </motion.button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--pb-muted)] hover:text-blue-400 hover:bg-blue-400/5 transition-colors cursor-pointer"
          aria-label="Comments"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[var(--pb-muted)] hover:text-green-400 hover:bg-green-400/5 transition-colors cursor-pointer"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
        </button>

        <button
          onClick={() => toggleSave(post.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors cursor-pointer ${post.saved ? 'text-yellow-400' : 'text-[var(--pb-muted)] hover:text-yellow-400 hover:bg-yellow-400/5'}`}
          aria-label="Save"
        >
          <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-yellow-400' : ''}`} />
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 border-t border-[var(--pb-border-faint)] pt-3 pb-4">
              {post.commentsList?.map((comment) => {
                const commenter = pets.find((p) => p.id === comment.petId);
                return (
                  <div key={comment.id} className="flex gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={commenter?.profileImage}
                        alt={commenter?.name || ''}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-[var(--pb-hover)] rounded-2xl px-3 py-2 flex-1">
                      <p className="text-xs font-semibold text-[var(--pb-text)]">{commenter?.name}</p>
                      <p className="text-xs text-[var(--pb-muted)] mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Add comment */}
              <div className="flex gap-2 mt-2">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  <img src={currentPet.profileImage} alt={currentPet.name} className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-full px-4 py-1.5 text-xs text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
