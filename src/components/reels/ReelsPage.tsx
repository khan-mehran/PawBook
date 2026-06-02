import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReelCard from './ReelCard';
import { useReels } from '../../hooks/useReels';

const ReelsPage: React.FC = () => {
  const { reels, activeReelIndex, isMuted, goToNext, goToPrev, toggleMute } = useReels();

  const handleScroll = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaY > 0) goToNext();
      else goToPrev();
    },
    [goToNext, goToPrev]
  );

  return (
    <div
      className="fixed inset-0 bg-black z-40 flex items-center justify-center"
      onWheel={handleScroll}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-display font-bold text-white text-lg">Reels</h2>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Reels */}
      <div className="w-full max-w-sm h-full relative">
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            animate={{ y: `${(index - activeReelIndex) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <ReelCard
              reel={reel}
              isActive={index === activeReelIndex}
              isMuted={isMuted}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {reels.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeReelIndex ? 'w-1.5 h-6 bg-white' : 'w-1.5 h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <button
          onClick={goToPrev}
          disabled={activeReelIndex === 0}
          className="p-2 rounded-full bg-black/30 text-white disabled:opacity-30 hover:bg-black/50 transition-all cursor-pointer"
          aria-label="Previous reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          disabled={activeReelIndex === reels.length - 1}
          className="p-2 rounded-full bg-black/30 text-white disabled:opacity-30 hover:bg-black/50 transition-all cursor-pointer"
          aria-label="Next reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-violet-600"
          animate={{ width: `${((activeReelIndex + 1) / reels.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ReelsPage;
