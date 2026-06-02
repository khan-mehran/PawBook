import { create } from 'zustand';
import type { Post } from '../data/dummyData';
import { dummyPosts } from '../data/dummyData';

interface FeedState {
  posts: Post[];
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string, petId: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: dummyPosts,
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    })),
  toggleSave: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, saved: !p.saved } : p
      ),
    })),
  addComment: (postId, text, petId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments + 1,
              commentsList: [
                ...(p.commentsList || []),
                { id: `c_${Date.now()}`, petId, text, timestamp: 'just now', likes: 0 },
              ],
            }
          : p
      ),
    })),
}));
