import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, usePostsStore } from '../../store';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { posts } = usePostsStore();
  const myPosts = posts.filter((p: any) => p.userId === user.id);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}><TouchableOpacity style={s.settingsBtn}><Text style={s.settingsIcon}>⚙️</Text></TouchableOpacity><TouchableOpacity style={s.editBtn}><Text style={s.editIcon}>✏️</Text></TouchableOpacity></View>
        <View style={s.profileSection}>
          <Image source={{ uri: user.avatar }} style={s.avatar} />
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.bio}>{user.bio}</Text>
          <Text style={s.moodText}>{user.mood.emoji} {user.mood.text}</Text>
        </View>
        <View style={s.statsRow}>
          <View style={s.statItem}><Text style={s.statValue}>{myPosts.length}</Text><Text style={s.statLabel}>Posts</Text></View>
          <View style={s.statDivider} />
          <View style={s.statItem}><Text style={s.statValue}>5</Text><Text style={s.statLabel}>Friends</Text></View>
          <View style={s.statDivider} />
          <View style={s.statItem}><Text style={s.statValue}>2</Text><Text style={s.statLabel}>Circles</Text></View>
        </View>
        <View style={s.postsGrid}>
          {myPosts.map((post: any) => (
            <View key={post.id} style={s.postThumb}>
              {post.images?.[0] ? <Image source={{ uri: post.images[0] }} style={s.postImage} resizeMode="cover" /> : <View style={[s.postImage, s.moodThumb]}><Text style={s.moodThumbEmoji}>{post.emoji}</Text></View>}
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={logout} style={s.signOutBtn}><Text style={s.signOutText}>Sign Out</Text></TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  settingsIcon: { fontSize: 18 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  editIcon: { fontSize: 18 },
  profileSection: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.primary, marginBottom: 16 },
  name: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  bio: { color: colors.textSecondary, fontSize: 15, marginBottom: 8 },
  moodText: { color: colors.textTertiary, fontSize: 13 },
  statsRow: { flexDirection: 'row', marginHorizontal: 40, backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  postsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4 },
  postThumb: { width: (SCREEN_W - 8) / 3, height: (SCREEN_W - 8) / 3, padding: 2 },
  postImage: { width: '100%', height: '100%', backgroundColor: colors.surface, borderRadius: 8 },
  moodThumb: { justifyContent: 'center', alignItems: 'center' },
  moodThumbEmoji: { fontSize: 32 },
  signOutBtn: { marginHorizontal: 16, marginTop: 24, paddingVertical: 14, alignItems: 'center', borderRadius: 20, backgroundColor: colors.surface },
  signOutText: { color: colors.error, fontSize: 15, fontWeight: '700' },
});
