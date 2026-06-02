import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePetStore } from '../../store/petStore';

interface StoryViewerProps {
  storyIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const STORY_DURATION = 5000;

const StoryViewer: React.FC<StoryViewerProps> = ({ storyIndex, onNext, onPrev, onClose }) => {
  const { stories, pets } = usePetStore();
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const story = stories[storyIndex];
  const pet = story ? pets.find((p) => p.id === story.petId) : null;

  useEffect(() => {
    setProgress(0);
  }, [storyIndex]);

  useEffect(() => {
    if (paused) return;
    const interval = 50;
    const step = (interval / STORY_DURATION) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [storyIndex, paused, onNext]);

  if (!story || !pet) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Story container */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-sm h-[85vh] rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < storyIndex ? '100%' : i === storyIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story image */}
        <img
          src={story.image}
          alt={pet.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

        {/* Header */}
        <div className="absolute top-8 left-3 right-3 z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
            <img src={pet.profileImage} alt={pet.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{pet.name}</p>
            <p className="text-white/60 text-xs">{story.expiresIn} left</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1 text-white/80 hover:text-white cursor-pointer"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tap areas */}
        <button
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous story"
        />
        <button
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next story"
        />

        {/* Navigation arrows */}
        {storyIndex > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {storyIndex < stories.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Reactions */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
          {['❤️', '🐾', '😂', '😮', '🔥'].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className="text-2xl cursor-pointer bg-transparent border-none"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryViewer;
