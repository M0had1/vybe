import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, usePostsStore, useFriendsStore } from '../../store';
import { USERS, CURRENT_USER, getVisibleComments, areMutualViaMe } from '../../services/mockData';

export default function CommentScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { post } = route.params;
  const { user } = useAuthStore();
  const { addComment } = usePostsStore();
  const friendships = useFriendsStore((s) => s.friendships);
  const [text, setText] = useState('');

  const isOwner = post.userId === user.id;
  const visibleComments = getVisibleComments(post, user.id);

  const handleSend = () => {
    if (!text.trim()) return;
    addComment(post.id, user.id, text.trim());
    setText('');
  };

  const getMutualLabel = (commentUserId: string) => {
    if (isOwner) {
      // Post owner sees relationship info
      const commentUser = USERS[commentUserId] || CURRENT_USER;
      const mutualWithPostOwner = friendships[post.userId]?.includes(commentUserId);
      return mutualWithPostOwner ? '' : ' (not mutual with you)';
    }
    return '';
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Comments</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Privacy notice */}
      <View style={s.privacyNotice}>
        <Text style={s.privacyIcon}>🔒</Text>
        <Text style={s.privacyText}>
          {isOwner
            ? `You see all ${post.comments.length} comments. Others only see comments from their mutuals.`
            : `You see comments from people you're friends with. ${visibleComments.length} of ${post.comments.length} visible.`
          }
        </Text>
      </View>

      {/* Comments list */}
      <FlatList
        data={isOwner ? post.comments : visibleComments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const commenter = USERS[item.userId] || CURRENT_USER;
          const isMe = item.userId === user.id;
          const isMutual = areMutualViaMe(item.userId, post.userId !== user.id ? post.userId : user.id);

          return (
            <View style={s.commentCard}>
              <Image source={{ uri: commenter.avatar }} style={s.avatar} />
              <View style={s.commentContent}>
                <View style={s.commentHeader}>
                  <Text style={s.commentName}>{isMe ? 'You' : commenter.name}</Text>
                  {isOwner && !friendships[post.userId]?.includes(item.userId) && item.userId !== post.userId && (
                    <View style={s.notMutualBadge}><Text style={s.notMutualText}>not mutual</Text></View>
                  )}
                </View>
                <Text style={s.commentBody}>{item.text}</Text>
                <Text style={s.commentTime}>{getTimeAgo(item.createdAt)}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={s.emptyComments}>
            <Text style={s.emptyEmoji}>💬</Text>
            <Text style={s.emptyText}>No comments yet</Text>
          </View>
        }
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <Image source={{ uri: user.avatar }} style={s.inputAvatar} />
          <TextInput
            style={s.input}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          {text.length > 0 && (
            <TouchableOpacity onPress={handleSend} style={s.sendBtn}><Text style={s.sendIcon}>➤</Text></TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  backText: { color: colors.text, fontSize: 20 },
  headerTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  privacyNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(124,108,240,0.08)', marginHorizontal: 16, padding: 12, borderRadius: radius.lg, marginBottom: 8 },
  privacyIcon: { fontSize: 16 },
  privacyText: { color: colors.textSecondary, fontSize: font.xs, flex: 1, lineHeight: 18 },
  commentCard: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentName: { color: colors.text, fontSize: font.sm, fontWeight: '700' },
  notMutualBadge: { backgroundColor: 'rgba(255,107,107,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.full },
  notMutualText: { color: colors.error, fontSize: 9, fontWeight: '600' },
  commentBody: { color: colors.text, fontSize: font.md, marginTop: 2, lineHeight: 22 },
  commentTime: { color: colors.textTertiary, fontSize: font.xs, marginTop: 4 },
  emptyComments: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: colors.textSecondary, fontSize: font.md },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 10, borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.bg },
  inputAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 10, color: colors.text, fontSize: font.md },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontSize: 16 },
});
