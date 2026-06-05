import { create } from 'zustand';

export type NotifType = 'like' | 'comment' | 'follow' | 'friend_request' | 'mention' | 'story' | 'achievement';

export interface Notification {
  id: string;
  type: NotifType;
  petName: string;
  petImage: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl: string;
}

const DUMMY: Notification[] = [
  {
    id: 'n1', type: 'like', read: false,
    petName: 'Luna',
    petImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=80',
    message: 'Luna ❤️ liked your post — "Golden hour hits different…"',
    timestamp: '2m ago', actionUrl: '/profile/pet_001',
  },
  {
    id: 'n2', type: 'comment', read: false,
    petName: 'Biscuit',
    petImage: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=80',
    message: 'Biscuit 💬 commented: "Goals! 🔥"',
    timestamp: '14m ago', actionUrl: '/profile/pet_001',
  },
  {
    id: 'n3', type: 'friend_request', read: false,
    petName: 'Rio',
    petImage: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=80',
    message: 'Rio 🤝 sent you a friend request',
    timestamp: '1h ago', actionUrl: '/friends',
  },
  {
    id: 'n4', type: 'follow', read: false,
    petName: 'Snowball',
    petImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=80',
    message: 'Snowball 🐰 started following you',
    timestamp: '2h ago', actionUrl: '/friends',
  },
  {
    id: 'n5', type: 'story', read: true,
    petName: 'Peanut',
    petImage: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=80',
    message: 'Peanut 👀 viewed your story',
    timestamp: '3h ago', actionUrl: '/',
  },
  {
    id: 'n6', type: 'like', read: true,
    petName: 'Zeus',
    petImage: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=80',
    message: 'Zeus 🐾 reacted to your post with a Paw',
    timestamp: '5h ago', actionUrl: '/profile/pet_001',
  },
  {
    id: 'n7', type: 'achievement', read: true,
    petName: 'FurBook',
    petImage: '',
    message: '🏆 You reached 100 followers! Keep sharing those moments.',
    timestamp: 'Yesterday', actionUrl: '/profile/pet_001',
  },
  {
    id: 'n8', type: 'mention', read: true,
    petName: 'Mittens',
    petImage: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=80',
    message: 'Mittens 📣 mentioned you in a post',
    timestamp: 'Yesterday', actionUrl: '/',
  },
];

interface NotifState {
  notifications: Notification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotifState>((set) => ({
  notifications: DUMMY,
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    })),
}));
