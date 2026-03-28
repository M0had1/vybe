import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font, spacing } from '../../theme';
import { useAuthStore, usePostsStore, useStoriesStore, useFriendsStore } from '../../store';
import { USERS, CURRENT_USER, getVisibleComments, getLikesInfo, areMutualViaMe } from '../../services/mockData';

const { width: SCREEN_W } = Dimensions.get('window');

// ============================================
// STORIES BAR
// ============================================
function StoriesBar({ navigation }: any) {
  const { user } = useAuthStore();
  const { stories } = useStoriesStore();
  const friends = useFriendsStore((s) => s.getFriends(user.id));
  const myStories = stories[user.id] || [];

  const storyUsers = [
    { id: user.id, name: 'You', avatar: user.avatar, hasStory: myStories.length > 0, isYou: true },
    ...friends.filter((f: any) => (stories[f.id] || []).length > 0).map((f: any) => ({
      id: f.id, name: f.name, avatar: f.avatar, hasStory: true,
    })),
  ];

  return (
    <FlatList
      data={storyUsers}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.storiesBar}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (item.isYou) return;
            if (item.hasStory) navigation.navigate('StoryViewer', { userId: item.id });
          }}
          style={s.storyItem}
        >
          <View style={[s.storyRing, item.hasStory && s.storyRingActive, item.isYou && s.storyRingYou]}>
            <Image source={{ uri: item.avatar }} style={s.storyAvatar} />
            {item.isYou && <View style={s.addStoryBtn}><Text style={s.addStoryIcon}>+</Text></View>}
          </View>
          <Text style={s.storyName} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

// ============================================
// POST CARD
// ============================================
function PostCard({ post, onPressComment, onLike, navigation }: any) {
  const { user } = useAuthStore();
  const visibleComments = getVisibleComments(post, user.id);
  const likesInfo = getLikesInfo(post, user.id);
  const author = post.userId === user.id ? user : USERS[post.userId];
  const isMood = post.type === 'mood';
  const isOwner = post.userId === user.id;

  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <View style={s.postCard}>
      {/* Header */}
      <View style={s.postHeader}>
        <Image source={{ uri: author?.avatar }} style={s.postAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.postName}>{author?.name}</Text>
          <Text style={s.postTime}>{timeAgo}</Text>
        </View>
        <TouchableOpacity style={s.moreBtn}><Text style={s.moreIcon}>•••</Text></TouchableOpacity>
      </View>

      {/* Content */}
      {isMood ? (
        <View style={s.moodPost}>
          <Text style={s.moodPostEmoji}>{post.emoji}</Text>
          <Text style={s.moodPostText}>{post.content}</Text>
        </View>
      ) : (
        <>
          {post.content ? <Text style={s.postText}>{post.content}</Text> : null}
          {post.images?.map((img: string, i: number) => (
            <Image key={i} source={{ uri: img }} style={[s.postImage, { height: Math.min(400, SCREEN_W * 1.2) }]} resizeMode="cover" />
          ))}
        </>
      )}

      {/* Reactions bar */}
      <View style={s.reactionsBar}>
        <TouchableOpacity onPress={() => onLike(post.id)} style={s.reactionBtn}>
          <Text style={s.reactionEmoji}>{likesInfo.hasLiked ? '❤️' : '🤍'}</Text>
          <Text style={s.reactionCount}>{likesInfo.count}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressComment(post)} style={s.reactionBtn}>
          <Text style={s.reactionEmoji}>💬</Text>
          <Text style={s.reactionCount}>{visibleComments.length}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <Text style={s.privacyLabel}>
          {isOwner ? `${post.comments.length} comments` : `${visibleComments.length} visible`}
        </Text>
      </View>

      {/* Preview comments */}
      {visibleComments.length > 0 && (
        <TouchableOpacity onPress={() => onPressComment(post)} style={s.commentPreview}>
          {visibleComments.slice(-2).map((c: any) => {
            const commenter = USERS[c.userId] || CURRENT_USER;
            return (
              <View key={c.id} style={s.commentRow}>
                <Text style={s.commentAuthor}>{commenter.name}</Text>
                <Text style={s.commentText}> {c.text}</Text>
              </View>
            );
          })}
          {post.comments.length > visibleComments.length && (
            <Text style={s.hiddenComments}>+ {post.comments.length - visibleComments.length} more comments (mutuals only)</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================
// MAIN HOME SCREEN
// ============================================
export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { posts, likePost } = usePostsStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleLike = useCallback((postId: string) => {
    likePost(postId, user.id);
  }, [user.id]);

  const handleComment = useCallback((post: any) => {
    navigation.navigate('Comments', { post });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Vybe</Text>
        <TouchableOpacity style={s.notifBtn}>
          <Text style={s.notifIcon}>🔔</Text>
          <View style={s.notifBadge}><Text style={s.notifBadgeText}>3</Text></View>
        </TouchableOpacity>
      </View>

      {/* Stories */}
      <StoriesBar navigation={navigation} />

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <PostCard post={item} onPressComment={handleComment} onLike={handleLike} navigation={navigation} />
        )}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>✨</Text>
            <Text style={s.emptyTitle}>Your space is empty</Text>
            <Text style={s.emptySub}>Add friends to see their moments</Text>
          </View>
        }
      />
    </View>
  );
}

// Helper
function getTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ============================================
// STYLES
// ============================================
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: font.xxxl, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  notifIcon: { fontSize: 20 },
  notifBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.like, justifyContent: 'center', alignItems: 'center' },
  notifBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  storiesBar: { paddingHorizontal: 12, gap: 12, marginBottom: 8 },
  storyItem: { alignItems: 'center', width: 64 },
  storyRing: { width: 60, height: 60, borderRadius: 30, padding: 2, backgroundColor: colors.surface },
  storyRingActive: { backgroundColor: colors.primary },
  storyRingYou: { borderWidth: 0 },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 28, backgroundColor: colors.surfaceElevated },
  addStoryBtn: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.bg },
  addStoryIcon: { color: '#FFF', fontSize: 14, fontWeight: '700', marginTop: -1 },
  storyName: { color: colors.textSecondary, fontSize: 10, marginTop: 4, fontWeight: '500', textAlign: 'center' },
  postCard: { backgroundColor: colors.surface, marginHorizontal: 12, marginBottom: 12, borderRadius: radius.xl, overflow: 'hidden' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceElevated },
  postName: { color: colors.text, fontSize: font.md, fontWeight: '700' },
  postTime: { color: colors.textTertiary, fontSize: font.xs },
  moreBtn: { padding: 8 },
  moreIcon: { color: colors.textTertiary, fontSize: 16 },
  postText: { color: colors.text, fontSize: font.md, paddingHorizontal: 14, marginBottom: 12, lineHeight: 22 },
  postImage: { width: '100%', backgroundColor: colors.surfaceElevated },
  moodPost: { padding: 24, alignItems: 'center', backgroundColor: colors.surfaceElevated, marginHorizontal: 14, borderRadius: radius.xl, marginBottom: 12 },
  moodPostEmoji: { fontSize: 48, marginBottom: 12 },
  moodPostText: { color: colors.text, fontSize: font.lg, textAlign: 'center', lineHeight: 26, fontWeight: '500' },
  reactionsBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 16 },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reactionEmoji: { fontSize: 20 },
  reactionCount: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '600' },
  privacyLabel: { color: colors.textTertiary, fontSize: font.xs, fontStyle: 'italic' },
  commentPreview: { paddingHorizontal: 14, paddingBottom: 14, gap: 4 },
  commentRow: { flexDirection: 'row' },
  commentAuthor: { color: colors.text, fontSize: font.sm, fontWeight: '700' },
  commentText: { color: colors.textSecondary, fontSize: font.sm, flex: 1 },
  hiddenComments: { color: colors.textTertiary, fontSize: font.xs, fontStyle: 'italic', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 8 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  emptySub: { color: colors.textSecondary, fontSize: font.md },
});
