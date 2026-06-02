import React from 'react';
import { AnimatePresence } from 'framer-motion';
import StoryBar from './StoryBar';
import PostCard from './PostCard';
import StoryViewer from './StoryViewer';
import { useFeedStore } from '../../store/feedStore';
import { useStories } from '../../hooks/useStories';
import GlassCard from '../ui/GlassCard';

const FeedPage: React.FC = () => {
  const { posts } = useFeedStore();
  const { isViewerOpen, activeStoryIndex, openStory, nextStory, prevStory, closeViewer } = useStories();

  return (
    <div className="flex flex-col gap-4">
      {/* Stories */}
      <GlassCard className="p-4" hover={false}>
        <StoryBar onOpenStory={openStory} />
      </GlassCard>

      {/* Posts */}
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}

      {/* Story Viewer */}
      <AnimatePresence>
        {isViewerOpen && activeStoryIndex !== null && (
          <StoryViewer
            storyIndex={activeStoryIndex}
            onNext={nextStory}
            onPrev={prevStory}
            onClose={closeViewer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedPage;
