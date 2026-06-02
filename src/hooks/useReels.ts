import { useState, useCallback } from 'react';
import { usePetStore } from '../store/petStore';

export const useReels = () => {
  const { reels, toggleReelLike, toggleReelSave } = usePetStore();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const goToNext = useCallback(() => {
    setActiveReelIndex((prev) => Math.min(prev + 1, reels.length - 1));
  }, [reels.length]);

  const goToPrev = useCallback(() => {
    setActiveReelIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    reels,
    activeReelIndex,
    isMuted,
    goToNext,
    goToPrev,
    toggleMute,
    toggleReelLike,
    toggleReelSave,
  };
};
