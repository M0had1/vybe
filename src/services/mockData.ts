import { v4 as uuid } from 'react-native-uuid';

// ============================================
// MOCK USERS
// ============================================
export const CURRENT_USER = {
  id: 'user-me',
  name: 'Alex',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Living in the moment ✨',
  mood: { emoji: '🟢', text: 'feeling good' },
  link: 'vybe.app/u/alex2026',
  createdAt: new Date('2026-01-15'),
};

export const USERS: Record<string, any> = {
  'user-anna': { id: 'user-anna', name: 'Anna', avatar: 'https://i.pravatar.cc/150?img=5', bio: 'photo dump queen 📸', mood: { emoji: '🟢', text: 'happy' } },
  'user-max': { id: 'user-max', name: 'Max', avatar: 'https://i.pravatar.cc/150?img=3', bio: 'just vibes', mood: { emoji: '🟠', text: 'energized' } },
  'user-kai': { id: 'user-kai', name: 'Kai', avatar: 'https://i.pravatar.cc/150?img=7', bio: 'music is life 🎵', mood: { emoji: '🔵', text: 'reflective' } },
  'user-sam': { id: 'user-sam', name: 'Sam', avatar: 'https://i.pravatar.cc/150?img=8', bio: 'adventure time 🏔', mood: { emoji: '🟢', text: 'excited' } },
  'user-riley': { id: 'user-riley', name: 'Riley', avatar: 'https://i.pravatar.cc/150?img=9', bio: 'coffee > everything ☕', mood: { emoji: '🟡', text: 'meh' } },
  'user-jordan': { id: 'user-jordan', name: 'Jordan', avatar: 'https://i.pravatar.cc/150?img=11', bio: 'making things', mood: { emoji: '🟠', text: 'focused' } },
  'user-taylor': { id: 'user-taylor', name: 'Taylor', avatar: 'https://i.pravatar.cc/150?img=12', bio: 'sunset chaser 🌅', mood: { emoji: '🟢', text: 'chill' } },
};

// ============================================
// FRIEND GRAPH (triangle mutual model)
// ============================================
// Who is directly friends with whom
export const FRIENDSHIPS: Record<string, string[]> = {
  'user-me': ['user-anna', 'user-max', 'user-kai', 'user-sam', 'user-riley'],
  'user-anna': ['user-me', 'user-max', 'user-sam'],  // Anna is friends with me, Max, Sam
  'user-max': ['user-me', 'user-anna', 'user-kai'],   // Max is friends with me, Anna, Kai
  'user-kai': ['user-me', 'user-max', 'user-riley'],  // Kai is friends with me, Max, Riley
  'user-sam': ['user-me', 'user-anna'],               // Sam is friends with me, Anna
  'user-riley': ['user-me', 'user-kai'],              // Riley is friends with me, Kai
  'user-jordan': ['user-taylor'],                      // Jordan not connected to us
  'user-taylor': ['user-jordan'],                      // Taylor not connected to us
};

// Check if two users are mutual (direct friends)
export function areMutual(userId1: string, userId2: string): boolean {
  return FRIENDSHIPS[userId1]?.includes(userId2) || false;
}

// Check if A and B are mutual through triangle with 'me'
export function areMutualViaMe(friendA: string, friendB: string): boolean {
  return areMutual(friendA, friendB);
}

// ============================================
// MOCK POSTS
// ============================================
export const POSTS = [
  {
    id: 'post-1',
    userId: 'user-anna',
    type: 'photo',
    content: 'Golden hour never disappoints 🌅',
    images: ['https://picsum.photos/seed/vybe1/600/800'],
    createdAt: new Date(Date.now() - 2 * 3600000),
    likes: ['user-me', 'user-max', 'user-sam'],
    comments: [
      { id: 'c1', userId: 'user-me', text: 'Absolutely stunning! 😍', createdAt: new Date(Date.now() - 1.5 * 3600000) },
      { id: 'c2', userId: 'user-max', text: 'Where is this??', createdAt: new Date(Date.now() - 1 * 3600000) },
      { id: 'c3', userId: 'user-sam', text: 'We need to go back!', createdAt: new Date(Date.now() - 0.5 * 3600000) },
    ],
  },
  {
    id: 'post-2',
    userId: 'user-max',
    type: 'photo',
    content: 'New setup who dis 💻',
    images: ['https://picsum.photos/seed/vybe2/600/600'],
    createdAt: new Date(Date.now() - 5 * 3600000),
    likes: ['user-me', 'user-anna', 'user-kai'],
    comments: [
      { id: 'c4', userId: 'user-me', text: 'Clean! 🔥', createdAt: new Date(Date.now() - 4.5 * 3600000) },
      { id: 'c5', userId: 'user-kai', text: 'Cable management on point', createdAt: new Date(Date.now() - 4 * 3600000) },
    ],
  },
  {
    id: 'post-3',
    userId: 'user-kai',
    type: 'mood',
    content: '🎧 Been listening to this album on repeat all day. Sometimes music just hits different.',
    emoji: '🔵',
    createdAt: new Date(Date.now() - 8 * 3600000),
    likes: ['user-me', 'user-max', 'user-riley'],
    comments: [
      { id: 'c6', userId: 'user-me', text: 'Share the album!', createdAt: new Date(Date.now() - 7 * 3600000) },
      { id: 'c7', userId: 'user-riley', text: 'Same honestly', createdAt: new Date(Date.now() - 6 * 3600000) },
    ],
  },
  {
    id: 'post-4',
    userId: 'user-sam',
    type: 'photo',
    content: 'Trail day with the crew 🏔',
    images: ['https://picsum.photos/seed/vybe4/600/900', 'https://picsum.photos/seed/vybe5/600/900'],
    createdAt: new Date(Date.now() - 12 * 3600000),
    likes: ['user-me', 'user-anna'],
    comments: [
      { id: 'c8', userId: 'user-anna', text: 'Take me next time!! 😭', createdAt: new Date(Date.now() - 11 * 3600000) },
    ],
  },
  {
    id: 'post-5',
    userId: 'user-me',
    type: 'photo',
    content: 'Sunday morning vibes ☕',
    images: ['https://picsum.photos/seed/vybe6/600/600'],
    createdAt: new Date(Date.now() - 24 * 3600000),
    likes: ['user-anna', 'user-max', 'user-kai', 'user-sam', 'user-riley'],
    comments: [
      { id: 'c9', userId: 'user-anna', text: 'Cozy!', createdAt: new Date(Date.now() - 23 * 3600000) },
      { id: 'c10', userId: 'user-max', text: 'Where\'s my invite?', createdAt: new Date(Date.now() - 22 * 3600000) },
      { id: 'c11', userId: 'user-kai', text: '☕☕☕', createdAt: new Date(Date.now() - 21 * 3600000) },
      { id: 'c12', userId: 'user-riley', text: 'This is the way', createdAt: new Date(Date.now() - 20 * 3600000) },
    ],
  },
];

// ============================================
// MOCK STORIES
// ============================================
export const STORIES: Record<string, any[]> = {
  'user-anna': [
    { id: 's1', type: 'photo', content: 'Morning walk 🌿', image: 'https://picsum.photos/seed/story1/400/700', createdAt: new Date(Date.now() - 1 * 3600000), viewers: ['user-me'] },
    { id: 's2', type: 'mood', content: 'Monday blues', emoji: '🟡', createdAt: new Date(Date.now() - 3 * 3600000), viewers: ['user-me', 'user-max'] },
  ],
  'user-max': [
    { id: 's3', type: 'photo', content: 'Late night coding session', image: 'https://picsum.photos/seed/story2/400/700', createdAt: new Date(Date.now() - 2 * 3600000), viewers: [] },
  ],
  'user-kai': [
    { id: 's4', type: 'song', content: 'On repeat 🎵', song: 'Midnight City - M83', createdAt: new Date(Date.now() - 4 * 3600000), viewers: ['user-me', 'user-max'] },
  ],
  'user-sam': [],
  'user-riley': [
    { id: 's5', type: 'photo', content: 'Best coffee in town ☕', image: 'https://picsum.photos/seed/story3/400/700', createdAt: new Date(Date.now() - 6 * 3600000), viewers: ['user-me'] },
  ],
};

// ============================================
// MOCK MESSAGES
// ============================================
export const CONVERSATIONS: Record<string, any[]> = {
  'user-anna': [
    { id: 'm1', from: 'user-anna', text: 'Hey! You free tonight?', time: new Date(Date.now() - 120000), read: false },
    { id: 'm2', from: 'user-me', text: 'Yeah! What\'s the plan?', time: new Date(Date.now() - 60000), read: true },
  ],
  'user-max': [
    { id: 'm3', from: 'user-max', text: 'That photo was 🔥', time: new Date(Date.now() - 3600000), read: true },
    { id: 'm4', from: 'user-me', text: 'Thanks bro!', time: new Date(Date.now() - 3500000), read: true },
  ],
  'user-kai': [
    { id: 'm5', from: 'user-kai', text: 'Listen to this', time: new Date(Date.now() - 7200000), read: true },
  ],
};

// ============================================
// HELPER: Get visible comments for a user
// ============================================
export function getVisibleComments(post: any, viewerId: string): any[] {
  // Post owner sees all
  if (post.userId === viewerId) return post.comments;

  // Others only see comments from mutuals + their own
  return post.comments.filter((c: any) =>
    c.userId === viewerId || areMutual(c.userId, viewerId)
  );
}

// HELPER: Get visible likes count (names hidden)
export function getLikesInfo(post: any, viewerId: string) {
  const count = post.likes.length;
  const hasLiked = post.likes.includes(viewerId);
  return { count, hasLiked, names: post.userId === viewerId ? post.likes.map((id: string) => USERS[id]?.name || 'Unknown') : [] };
}
