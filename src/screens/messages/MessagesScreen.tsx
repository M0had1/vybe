import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, useMessagesStore, useFriendsStore } from '../../store';
import { USERS, CURRENT_USER } from '../../services/mockData';

export default function MessagesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { conversations } = useMessagesStore();
  const friends = useFriendsStore((s) => s.getFriends(user.id));
  const unreadCount = useMessagesStore((s) => s.getUnreadCount);

  // Build conversation list from friends
  const convList = friends.map((f: any) => {
    const msgs = conversations[f.id] || [];
    const last = msgs[msgs.length - 1];
    const unread = unreadCount(f.id);
    return { friend: f, lastMessage: last, unread };
  }).sort((a: any, b: any) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.time).getTime() - new Date(a.lastMessage.time).getTime();
  });

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={s.header}>
        <Text style={s.headerTitle}>Messages</Text>
        <TouchableOpacity style={s.newBtn}><Text style={s.newIcon}>✏️</Text></TouchableOpacity>
      </View>

      <FlatList
        data={convList}
        keyExtractor={(item) => item.friend.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { friend: item.friend })} style={s.convItem}>
            <Image source={{ uri: item.friend.avatar }} style={s.avatar} />
            {item.friend.mood && (
              <View style={[s.moodDot, { backgroundColor: item.friend.mood.emoji === '🟢' ? colors.moodGood : item.friend.mood.emoji === '🟡' ? colors.moodMeh : item.friend.mood.emoji === '🔵' ? colors.moodReflective : item.friend.mood.emoji === '🟠' ? colors.moodEnergized : colors.moodLow }]} />
            )}
            <View style={s.convInfo}>
              <View style={s.convHeader}>
                <Text style={s.convName}>{item.friend.name}</Text>
                {item.lastMessage && <Text style={s.convTime}>{getTimeAgo(item.lastMessage.time)}</Text>}
              </View>
              <Text style={[s.convPreview, item.unread > 0 && s.convPreviewUnread]} numberOfLines={1}>
                {item.lastMessage ? (item.lastMessage.from === user.id ? 'You: ' : '') + item.lastMessage.text : 'Start a conversation'}
              </Text>
            </View>
            {item.unread > 0 && <View style={s.unreadBadge}><Text style={s.unreadText}>{item.unread}</Text></View>}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>💬</Text>
            <Text style={s.emptyTitle}>No messages yet</Text>
            <Text style={s.emptySub}>Start a conversation with a friend</Text>
          </View>
        }
      />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: colors.text, fontSize: font.xxl, fontWeight: '900' },
  newBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  newIcon: { fontSize: 18 },
  convItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface },
  moodDot: { position: 'absolute', left: 56, top: 42, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.bg },
  convInfo: { flex: 1 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  convName: { color: colors.text, fontSize: font.md, fontWeight: '700' },
  convTime: { color: colors.textTertiary, fontSize: font.xs },
  convPreview: { color: colors.textSecondary, fontSize: font.sm },
  convPreviewUnread: { color: colors.text, fontWeight: '600' },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  separator: { height: 0.5, backgroundColor: colors.border, marginLeft: 86 },
  emptyState: { alignItems: 'center', paddingTop: 100, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: font.md },
});
