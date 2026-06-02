export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  owner: string;
  location: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  friends: number;
  followers: number;
  tags: string[];
  verified: boolean;
  gallery?: string[];
}

export interface Post {
  id: string;
  petId: string;
  type: 'photo' | 'video' | 'status' | 'achievement';
  images?: string[];
  videoUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  shares?: number;
  timestamp: string;
  reactions: { heart: number; paw: number; laugh: number; wow: number };
  bgColor?: string;
  liked?: boolean;
  saved?: boolean;
  commentsList?: Comment[];
}

export interface Comment {
  id: string;
  petId: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Story {
  id: string;
  petId: string;
  image: string;
  viewed: boolean;
  expiresIn: string;
  type?: 'image' | 'video';
  filter?: string;
}

export interface Reel {
  id: string;
  petId: string;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  audio: string;
  views?: number;
  liked?: boolean;
  saved?: boolean;
}

export const dummyPets: Pet[] = [
  {
    id: 'pet_001',
    name: 'Mango',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    owner: 'Sarah K.',
    location: 'New York, USA',
    bio: 'Professional ball chaser 🎾 | Nap enthusiast 😴 | Treat connoisseur 🦴',
    profileImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    friends: 284,
    followers: 1420,
    tags: ['Playful', 'Foodie', 'Outdoorsy'],
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
      'https://images.unsplash.com/photo-1508532566027-b2579a8b7db4?w=400',
    ],
  },
  {
    id: 'pet_002',
    name: 'Luna',
    species: 'Cat',
    breed: 'British Shorthair',
    age: '3 years',
    owner: 'Mike T.',
    location: 'London, UK',
    bio: 'Queen of the windowsill 👑 | Judging you silently since 2021 😒 | Sunbeam collector ☀️',
    profileImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
    coverImage: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800',
    friends: 156,
    followers: 3200,
    tags: ['Lazy', 'Independent', 'Elegant'],
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400',
      'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400',
    ],
  },
  {
    id: 'pet_003',
    name: 'Peanut',
    species: 'Hamster',
    breed: 'Syrian Hamster',
    age: '1 year',
    owner: 'Emily R.',
    location: 'Toronto, Canada',
    bio: 'Running 10km every night on my wheel 🏃 | Cheek pouches are my personality 🐹',
    profileImage: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    coverImage: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800',
    friends: 43,
    followers: 890,
    tags: ['Active', 'Curious', 'Foodie'],
    verified: false,
    gallery: [
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    ],
  },
  {
    id: 'pet_004',
    name: 'Rio',
    species: 'Bird',
    breed: 'Blue Macaw',
    age: '5 years',
    owner: 'Carlos M.',
    location: 'São Paulo, Brazil',
    bio: 'Polyglot 🌍 | Can say "Where\'s my snack?" in 4 languages 🦜 | Fan of dramatic entrances',
    profileImage: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
    coverImage: 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800',
    friends: 78,
    followers: 2100,
    tags: ['Talkative', 'Smart', 'Explorer'],
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
      'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400',
    ],
  },
  {
    id: 'pet_005',
    name: 'Biscuit',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '4 years',
    owner: 'Aisha P.',
    location: 'Dubai, UAE',
    bio: 'Snoring is a talent 😤 | Fashion icon 🕶️ | Will work for belly rubs',
    profileImage: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    friends: 312,
    followers: 5600,
    tags: ['Fashionable', 'Lazy', 'Social'],
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    ],
  },
  {
    id: 'pet_006',
    name: 'Snowball',
    species: 'Rabbit',
    breed: 'Angora',
    age: '2 years',
    owner: 'Yuki H.',
    location: 'Tokyo, Japan',
    bio: 'Fluffiest cloud alive ☁️ | Binky world champion 🏆 | Lettuce is life 🥬',
    profileImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    coverImage: 'https://images.unsplash.com/photo-1591871937631-2f64059d234f?w=800',
    friends: 95,
    followers: 1870,
    tags: ['Fluffy', 'Gentle', 'Playful'],
    verified: false,
    gallery: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
      'https://images.unsplash.com/photo-1591871937631-2f64059d234f?w=400',
    ],
  },
  {
    id: 'pet_007',
    name: 'Zeus',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '3 years',
    owner: 'Alex V.',
    location: 'Berlin, Germany',
    bio: 'Protector by day, cuddle monster by night 🐺 | Loves hiking & fetch',
    profileImage: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400',
    coverImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800',
    friends: 201,
    followers: 3400,
    tags: ['Loyal', 'Active', 'Smart'],
    verified: true,
    gallery: [
      'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400',
    ],
  },
  {
    id: 'pet_008',
    name: 'Mittens',
    species: 'Cat',
    breed: 'Maine Coon',
    age: '4 years',
    owner: 'Grace L.',
    location: 'Paris, France',
    bio: 'Larger than life 🦁 | Loves croissants (to knock off the table) 🥐',
    profileImage: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400',
    coverImage: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800',
    friends: 178,
    followers: 4100,
    tags: ['Fluffy', 'Majestic', 'Mischievous'],
    verified: false,
    gallery: [
      'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400',
      'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400',
    ],
  },
];

export const dummyPosts: Post[] = [
  {
    id: 'post_001',
    petId: 'pet_001',
    type: 'photo',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=600'],
    caption: 'Golden hour hits different when you\'re this golden 🌅✨ #GoldenRetriever #SunsetVibes',
    likes: 428,
    comments: 34,
    shares: 12,
    timestamp: '2 hours ago',
    reactions: { heart: 312, paw: 84, laugh: 22, wow: 10 },
    liked: false,
    saved: false,
    commentsList: [
      { id: 'c1', petId: 'pet_002', text: 'Absolutely gorgeous! 😍', timestamp: '1h ago', likes: 8 },
      { id: 'c2', petId: 'pet_005', text: 'Goals! 🔥', timestamp: '45m ago', likes: 5 },
    ],
  },
  {
    id: 'post_002',
    petId: 'pet_002',
    type: 'photo',
    images: ['https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600'],
    caption: 'Monday mood. Do not disturb. 😾 #CatLife #MondayMood #LeaveMe',
    likes: 892,
    comments: 67,
    shares: 45,
    timestamp: '5 hours ago',
    reactions: { heart: 654, paw: 120, laugh: 98, wow: 20 },
    liked: false,
    saved: false,
    commentsList: [
      { id: 'c3', petId: 'pet_001', text: 'Same, Luna. Same. 😂', timestamp: '4h ago', likes: 32 },
    ],
  },
  {
    id: 'post_003',
    petId: 'pet_005',
    type: 'photo',
    images: [
      'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=600',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600',
    ],
    caption: 'New fits just dropped. Yes I have a wardrobe. Yes it\'s bigger than yours. 🕶️👔 #FrenchBulldog #OOTD #FashionPet',
    likes: 1243,
    comments: 89,
    shares: 67,
    timestamp: '1 day ago',
    reactions: { heart: 890, paw: 250, laugh: 67, wow: 36 },
    liked: false,
    saved: false,
    commentsList: [
      { id: 'c4', petId: 'pet_004', text: 'Serving looks as always! 🔥', timestamp: '23h ago', likes: 45 },
    ],
  },
  {
    id: 'post_004',
    petId: 'pet_004',
    type: 'status',
    caption: 'Just learned to say "I love you" in Spanish. My owner is shook. 🦜🌟',
    likes: 567,
    comments: 42,
    shares: 23,
    timestamp: '3 hours ago',
    reactions: { heart: 412, paw: 98, laugh: 45, wow: 12 },
    bgColor: '#7C3AED',
    liked: false,
    saved: false,
  },
  {
    id: 'post_005',
    petId: 'pet_006',
    type: 'photo',
    images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'],
    caption: 'First time in the garden and I am SPEED 🌿🐰 #Binky #RabbitLife #FreedomFeels',
    likes: 334,
    comments: 28,
    shares: 15,
    timestamp: '6 hours ago',
    reactions: { heart: 234, paw: 78, laugh: 12, wow: 10 },
    liked: false,
    saved: false,
  },
  {
    id: 'post_006',
    petId: 'pet_003',
    type: 'achievement',
    caption: '🏆 FIRST TIME: Stuffed both cheek pouches with 47 sunflower seeds! New personal record! The crowd goes wild! 🐹🎉',
    likes: 198,
    comments: 56,
    shares: 34,
    timestamp: '8 hours ago',
    reactions: { heart: 134, paw: 42, laugh: 18, wow: 4 },
    liked: false,
    saved: false,
  },
  {
    id: 'post_007',
    petId: 'pet_007',
    type: 'photo',
    images: [
      'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=600',
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600',
    ],
    caption: 'Morning hike with dad ⛰️ 12km and still asking for more treats. No chill. #GermanShepherd #HikingDog #Adventure',
    likes: 723,
    comments: 51,
    shares: 29,
    timestamp: '12 hours ago',
    reactions: { heart: 534, paw: 134, laugh: 34, wow: 21 },
    liked: false,
    saved: false,
  },
];

export const dummyStories: Story[] = [
  { id: 'story_001', petId: 'pet_001', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', viewed: false, expiresIn: '18h' },
  { id: 'story_002', petId: 'pet_002', image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400', viewed: false, expiresIn: '22h' },
  { id: 'story_003', petId: 'pet_005', image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400', viewed: true, expiresIn: '6h' },
  { id: 'story_004', petId: 'pet_004', image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400', viewed: false, expiresIn: '14h' },
  { id: 'story_005', petId: 'pet_006', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400', viewed: false, expiresIn: '20h' },
  { id: 'story_006', petId: 'pet_007', image: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400', viewed: true, expiresIn: '3h' },
  { id: 'story_007', petId: 'pet_008', image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400', viewed: false, expiresIn: '11h' },
];

export const dummyReels: Reel[] = [
  {
    id: 'reel_001',
    petId: 'pet_001',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    caption: 'Fetch champion 🏆 Watch till the end! #DogReels #FetchLife #GoldenRetriever',
    likes: 12400,
    comments: 234,
    shares: 890,
    audio: 'Happy Paws — Original Audio',
    views: 89000,
    liked: false,
    saved: false,
  },
  {
    id: 'reel_002',
    petId: 'pet_002',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
    caption: 'Saturday morning routine ☀️ Don\'t talk to me until I\'ve had my sunbeam #CatVibes #MorningRoutine',
    likes: 34200,
    comments: 567,
    shares: 1200,
    audio: 'Lo-fi Meow Beats',
    views: 245000,
    liked: false,
    saved: false,
  },
  {
    id: 'reel_003',
    petId: 'pet_005',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
    caption: 'POV: It\'s Sunday and you\'re a Frenchie 😤 #FrenchBulldog #SundayVibes #Snoring',
    likes: 67800,
    comments: 1230,
    shares: 4500,
    audio: 'Snore Symphony No. 3',
    views: 512000,
    liked: false,
    saved: false,
  },
  {
    id: 'reel_004',
    petId: 'pet_004',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400',
    caption: 'Teaching myself a new word every day 🦜 Today: "snack attack" #ParrotLife #TalkingBird',
    likes: 23100,
    comments: 445,
    shares: 2100,
    audio: 'Tropical Vibes Mix',
    views: 178000,
    liked: false,
    saved: false,
  },
  {
    id: 'reel_005',
    petId: 'pet_006',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    caption: 'Binky time! 🐰💨 The zoomies have arrived #RabbitTok #BunnyLife #Zoomies',
    likes: 18900,
    comments: 312,
    shares: 780,
    audio: 'Cottagecore Spring Mix',
    views: 134000,
    liked: false,
    saved: false,
  },
];

export const speciesEmoji: Record<string, string> = {
  Dog: '🐶',
  Cat: '🐱',
  Bird: '🦜',
  Rabbit: '🐰',
  Hamster: '🐹',
  Reptile: '🦎',
  Other: '🐾',
};

export const trendingHashtags = [
  { tag: '#GoldenMoments', count: '24.5K posts' },
  { tag: '#CatLife', count: '18.2K posts' },
  { tag: '#PetPhotography', count: '15.8K posts' },
  { tag: '#FrenchBulldog', count: '12.4K posts' },
  { tag: '#BunnyLife', count: '9.7K posts' },
  { tag: '#ParrotTok', count: '7.3K posts' },
];

export const upcomingEvents = [
  { title: 'Bark in the Park NYC', date: 'Jun 8', icon: '🌳' },
  { title: 'Cat Show London', date: 'Jun 12', icon: '🏆' },
  { title: 'Pet Costume Contest', date: 'Jun 15', icon: '🎭' },
];
