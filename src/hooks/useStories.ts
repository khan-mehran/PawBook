import { useState, useCallback } from 'react';
import { usePetStore } from '../store/petStore';

export const useStories = () => {
  const { stories, markStoryViewed } = usePetStore();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openStory = useCallback((index: number) => {
    setActiveStoryIndex(index);
    setIsViewerOpen(true);
    markStoryViewed(stories[index].id);
  }, [stories, markStoryViewed]);

  const nextStory = useCallback(() => {
    setActiveStoryIndex((prev) => {
      if (prev === null) return null;
      const next = prev + 1;
      if (next >= stories.length) {
        setIsViewerOpen(false);
        return null;
      }
      markStoryViewed(stories[next].id);
      return next;
    });
  }, [stories, markStoryViewed]);

  const prevStory = useCallback(() => {
    setActiveStoryIndex((prev) => {
      if (prev === null || prev === 0) return prev;
      return prev - 1;
    });
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setActiveStoryIndex(null);
  }, []);

  return {
    stories,
    activeStoryIndex,
    isViewerOpen,
    openStory,
    nextStory,
    prevStory,
    closeViewer,
  };
};
