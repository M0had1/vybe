import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Alert, Clipboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, useFriendsStore } from '../../store';
import { USERS, CURRENT_USER } from '../../services/mockData';

export default function FriendsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { friendships, requests, innerCircle, acceptRequest, removeFriend, addToInnerCircle } = useFriendsStore();
  const friends = useFriendsStore((s) => s.getFriends(user.id));

  const pendingRequests = requests.filter((r) => r.to === user.id);
  const innerFriends = friends.filter((f: any) => innerCircle.includes(f.id));
  const otherFriends = friends.filter((f: any) => !innerCircle.includes(f.id));

  const handleCopyLink = () => {
    Alert.alert('Link Copied!', `${user.link} copied to clipboard`);
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={s.header}>
        <Text style={s.headerTitle}>Friends</Text>
        <TouchableOpacity style={s.addBtn}><Text style={s.addIcon}>+</Text></TouchableOpacity>
      </View>

      {/* Profile link */}
      <View style={s.linkCard}>
        <Text style={s.linkLabel}>Your link</Text>
        <View style={s.linkRow}>
          <Text style={s.linkUrl}>{user.link}</Text>
          <TouchableOpacity onPress={handleCopyLink} style={s.copyBtn}><Text style={s.copyText}>Copy</Text></TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[
          ...(pendingRequests.length > 0 ? [{ type: 'pending', data: pendingRequests }] : []),
          { type: 'inner', data: innerFriends },
          { type: 'all', data: otherFriends },
        ].filter(Boolean)}
        keyExtractor={(item: any) => item.type}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => {
          if (item.type === 'pending') {
            return (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Pending Requests ({item.data.length})</Text>
                {item.data.map((req: any) => {
                  const from = USERS[req.from] || CURRENT_USER;
                  return (
                    <View key={req.from} style={s.requestCard}>
                      <Image source={{ uri: from.avatar }} style={s.avatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={s.friendName}>{from.name}</Text>
                        <Text style={s.friendBio}>{from.bio}</Text>
                      </View>
                      <TouchableOpacity onPress={() => acceptRequest(req.from, user.id)} style={s.acceptBtn}><Text style={s.acceptText}>Accept</Text></TouchableOpacity>
                      <TouchableOpacity style={s.declineBtn}><Text style={s.declineText}>✕</Text></TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          }

          if (item.type === 'inner') {
            return (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Inner Circle ⭐ ({item.data.length})</Text>
                {item.data.map((f: any) => (
                  <TouchableOpacity key={f.id} onPress={() => navigation.navigate('Chat', { friend: f })} style={s.friendCard}>
                    <Image source={{ uri: f.avatar }} style={s.avatar} />
                    <View style={s.friendInfo}>
                      <Text style={s.friendName}>{f.name}</Text>
                      <Text style={s.friendBio}>{f.mood?.emoji} {f.mood?.text}</Text>
                    </View>
                    <View style={s.innerBadge}><Text style={s.innerBadgeText}>⭐</Text></View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }

          return (
            <View style={s.section}>
              <Text style={s.sectionTitle}>All Friends ({item.data.length})</Text>
              {item.data.map((f: any) => (
                <TouchableOpacity key={f.id} onPress={() => navigation.navigate('Chat', { friend: f })} style={s.friendCard}>
                  <Image source={{ uri: f.avatar }} style={s.avatar} />
                  <View style={s.friendInfo}>
                    <Text style={s.friendName}>{f.name}</Text>
                    <Text style={s.friendBio}>{f.mood?.emoji} {f.mood?.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => addToInnerCircle(f.id)} style={s.starBtn}><Text style={s.starIcon}>☆</Text></TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: colors.text, fontSize: font.xxl, fontWeight: '900' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  addIcon: { color: '#FFF', fontSize: 24, fontWeight: '300' },
  linkCard: { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, marginBottom: 16 },
  linkLabel: { color: colors.textSecondary, fontSize: font.sm, marginBottom: 6 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkUrl: { flex: 1, color: colors.primary, fontSize: font.md, fontWeight: '600' },
  copyBtn: { backgroundColor: 'rgba(124,108,240,0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full },
  copyText: { color: colors.primary, fontSize: font.sm, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },
  requestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, padding: 14, marginBottom: 8, gap: 12 },
  friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, padding: 14, marginBottom: 8, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceElevated },
  friendInfo: { flex: 1 },
  friendName: { color: colors.text, fontSize: font.md, fontWeight: '700' },
  friendBio: { color: colors.textSecondary, fontSize: font.sm, marginTop: 2 },
  acceptBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full },
  acceptText: { color: '#FFF', fontSize: font.sm, fontWeight: '700' },
  declineBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  declineText: { color: colors.textTertiary, fontSize: 16 },
  innerBadge: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  innerBadgeText: { fontSize: 18 },
  starBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  starIcon: { fontSize: 20, color: colors.textTertiary },
});
