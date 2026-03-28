import { create } from 'zustand';
import { CURRENT_USER, USERS, FRIENDSHIPS, POSTS, STORIES, CONVERSATIONS, getVisibleComments, getLikesInfo, areMutual } from '../services/mockData';

// ============================================
// AUTH STORE
// ============================================
interface AuthState {
  isLoggedIn: boolean;
  user: any;
  login: () => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: CURRENT_USER,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));

// ============================================
// POSTS STORE
// ============================================
interface PostsState {
  posts: any[];
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, text: string) => void;
  addPost: (post: any) => void;
  getVisiblePosts: (viewerId: string) => any[];
}
export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [...POSTS],
  likePost: (postId, userId) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id !== postId) return p;
      const likes = p.likes.includes(userId) ? p.likes.filter((id: string) => id !== userId) : [...p.likes, userId];
      return { ...p, likes };
    }),
  })),
  addComment: (postId, userId, text) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, { id: `c-${Date.now()}`, userId, text, createdAt: new Date() }] };
    }),
  })),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  getVisiblePosts: (viewerId) => get().posts,
}));

// ============================================
// STORIES STORE
// ============================================
interface StoriesState {
  stories: Record<string, any[]>;
  addStory: (userId: string, story: any) => void;
  viewStory: (userId: string, storyId: string, viewerId: string) => void;
}
export const useStoriesStore = create<StoriesState>((set) => ({
  stories: { ...STORIES },
  addStory: (userId, story) => set((state) => ({
    stories: { ...state.stories, [userId]: [story, ...(state.stories[userId] || [])] },
  })),
  viewStory: (userId, storyId, viewerId) => set((state) => ({
    stories: {
      ...state.stories,
      [userId]: (state.stories[userId] || []).map((s) =>
        s.id === storyId && !s.viewers.includes(viewerId)
          ? { ...s, viewers: [...s.viewers, viewerId] }
          : s
      ),
    },
  })),
}));

// ============================================
// FRIENDS STORE
// ============================================
interface FriendsState {
  friendships: Record<string, string[]>;
  requests: { from: string; to: string; status: string }[];
  innerCircle: string[];
  sendRequest: (from: string, to: string) => void;
  acceptRequest: (from: string, to: string) => void;
  removeFriend: (userId: string, friendId: string) => void;
  addToInnerCircle: (friendId: string) => void;
  areMutual: (a: string, b: string) => boolean;
  getFriends: (userId: string) => any[];
}
export const useFriendsStore = create<FriendsState>((set, get) => ({
  friendships: { ...FRIENDSHIPS },
  requests: [
    { from: 'user-jordan', to: 'user-me', status: 'pending' },
    { from: 'user-taylor', to: 'user-me', status: 'pending' },
  ],
  innerCircle: ['user-anna', 'user-max', 'user-kai'],
  sendRequest: (from, to) => set((state) => ({
    requests: [...state.requests, { from, to, status: 'pending' }],
  })),
  acceptRequest: (from, to) => set((state) => {
    const newFriendships = { ...state.friendships };
    newFriendships[to] = [...(newFriendships[to] || []), from];
    newFriendships[from] = [...(newFriendships[from] || []), to];
    return {
      friendships: newFriendships,
      requests: state.requests.filter((r) => !(r.from === from && r.to === to)),
    };
  }),
  removeFriend: (userId, friendId) => set((state) => {
    const newFriendships = { ...state.friendships };
    newFriendships[userId] = (newFriendships[userId] || []).filter((id) => id !== friendId);
    newFriendships[friendId] = (newFriendships[friendId] || []).filter((id) => id !== userId);
    return { friendships: newFriendships };
  }),
  addToInnerCircle: (friendId) => set((state) => ({
    innerCircle: state.innerCircle.includes(friendId) ? state.innerCircle : [...state.innerCircle, friendId],
  })),
  areMutual: (a, b) => get().friendships[a]?.includes(b) || false,
  getFriends: (userId) => (get().friendships[userId] || []).map((id) => USERS[id]).filter(Boolean),
}));

// ============================================
// MESSAGES STORE
// ============================================
interface MessagesState {
  conversations: Record<string, any[]>;
  sendMessage: (friendId: string, text: string) => void;
  markRead: (friendId: string) => void;
  getUnreadCount: (friendId: string) => number;
}
export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: { ...CONVERSATIONS },
  sendMessage: (friendId, text) => set((state) => ({
    conversations: {
      ...state.conversations,
      [friendId]: [...(state.conversations[friendId] || []), { id: `m-${Date.now()}`, from: 'user-me', text, time: new Date(), read: true }],
    },
  })),
  markRead: (friendId) => set((state) => ({
    conversations: {
      ...state.conversations,
      [friendId]: (state.conversations[friendId] || []).map((m) => ({ ...m, read: true })),
    },
  })),
  getUnreadCount: (friendId) => (get().conversations[friendId] || []).filter((m) => !m.read && m.from !== 'user-me').length,
}));
