import React, { memo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Music } from 'lucide-react';
import type { Reel } from '../../data/dummyData';
import { usePetStore } from '../../store/petStore';
import { speciesEmoji } from '../../data/dummyData';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
}

const ReelCard: React.FC<ReelCardProps> = memo(({ reel, isActive, isMuted }) => {
  const { pets, toggleReelLike, toggleReelSave } = usePetStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showHeart, setShowHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const pet = pets.find((p) => p.id === reel.petId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      toggleReelLike(reel.id);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    setLastTap(now);
  };

  if (!pet) return null;

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
      onClick={handleDoubleTap}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnail}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
      />

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Right actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6">
        {/* Pet avatar */}
        <Link to={`/profile/${pet.id}`} onClick={(e) => e.stopPropagation()}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img src={pet.profileImage} alt={pet.name} className="w-full h-full object-cover" />
          </div>
        </Link>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); toggleReelLike(reel.id); }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          aria-label="Like"
        >
          <Heart className={`w-7 h-7 ${reel.liked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          <span className="text-white text-xs font-medium">{formatCount(reel.likes)}</span>
        </motion.button>

        <button
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Comment"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">{formatCount(reel.comments)}</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Share"
        >
          <Share2 className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">{formatCount(reel.shares)}</span>
        </button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); toggleReelSave(reel.id); }}
          className="flex flex-col items-center gap-1 cursor-pointer"
          aria-label="Save"
        >
          <Bookmark className={`w-7 h-7 ${reel.saved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
        </motion.button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-3 right-16 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/profile/${pet.id}`} onClick={(e) => e.stopPropagation()} className="pointer-events-auto">
            <span className="font-bold text-white text-sm hover:text-orange-400 transition-colors">
              {pet.name} {speciesEmoji[pet.species]}
            </span>
          </Link>
          <button
            className="text-xs border border-white/60 rounded-full px-3 py-0.5 text-white hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            Follow
          </button>
        </div>
        <p className="text-white/90 text-sm mb-2 line-clamp-2">{reel.caption}</p>
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Music className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <p className="text-white/80 text-xs truncate animate-marquee">{reel.audio}</p>
        </div>
      </div>

      {/* View count */}
      {reel.views && (
        <div className="absolute top-4 left-4 bg-black/40 rounded-full px-2.5 py-1">
          <span className="text-white text-xs">{formatCount(reel.views)} views</span>
        </div>
      )}
    </div>
  );
});

ReelCard.displayName = 'ReelCard';

export default ReelCard;
