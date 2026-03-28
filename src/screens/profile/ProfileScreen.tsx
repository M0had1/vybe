import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, usePostsStore } from '../../store';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { posts } = usePostsStore();
  const myPosts = posts.filter((p) => p.userId === user.id);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.settingsBtn} onPress={() => Alert.alert('Settings', 'Coming soon')}>
            <Text style={s.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.editBtn}><Text style={s.editIcon}>✏️</Text></TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={s.profileSection}>
          <View style={s.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={s.avatar} />
            <View style={s.moodBadge}>
              <Text style={s.moodEmoji}>{user.mood.emoji}</Text>
            </View>
          </View>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.bio}>{user.bio}</Text>
          <Text style={s.moodText}>{user.mood.emoji} {user.mood.text}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statValue}>{myPosts.length}</Text>
            <Text style={s.statLabel}>Posts</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>5</Text>
            <Text style={s.statLabel}>Friends</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>2</Text>
            <Text style={s.statLabel}>Circles</Text>
          </View>
        </View>

        {/* Stories / Highlights tabs */}
        <View style={s.tabsRow}>
          <TouchableOpacity style={[s.tab, s.tabActive]}><Text style={[s.tabText, s.tabTextActive]}>Posts</Text></TouchableOpacity>
          <TouchableOpacity style={s.tab}><Text style={s.tabText}>Stories</Text></TouchableOpacity>
          <TouchableOpacity style={s.tab}><Text style={s.tabText}>Highlights</Text></TouchableOpacity>
        </View>

        {/* Posts grid */}
        <View style={s.postsGrid}>
          {myPosts.map((post) => (
            <View key={post.id} style={s.postThumb}>
              {post.images?.[0] ? (
                <Image source={{ uri: post.images[0] }} style={s.postImage} resizeMode="cover" />
              ) : (
                <View style={[s.postImage, s.moodThumb]}>
                  <Text style={s.moodThumbEmoji}>{post.emoji}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity onPress={logout} style={s.signOutBtn}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.primary },
  moodBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.bg },
  moodEmoji: { fontSize: 18 },
  name: { color: colors.text, fontSize: font.xxl, fontWeight: '800', marginBottom: 4 },
  bio: { color: colors.textSecondary, fontSize: font.md, marginBottom: 8 },
  moodText: { color: colors.textTertiary, fontSize: font.sm },
  statsRow: { flexDirection: 'row', marginHorizontal: 40, backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: font.xs, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  postsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4 },
  postThumb: { width: (SCREEN_W - 8) / 3, height: (SCREEN_W - 8) / 3, padding: 2 },
  postImage: { width: '100%', height: '100%', backgroundColor: colors.surface, borderRadius: radius.sm },
  moodThumb: { justifyContent: 'center', alignItems: 'center' },
  moodThumbEmoji: { fontSize: 32 },
  signOutBtn: { marginHorizontal: 16, marginTop: 24, paddingVertical: 14, alignItems: 'center', borderRadius: radius.xl, backgroundColor: colors.surface },
  signOutText: { color: colors.error, fontSize: font.md, fontWeight: '700' },
});
