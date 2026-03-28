import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, useFriendsStore } from '../../store';
import { USERS, CURRENT_USER } from '../../services/mockData';

export default function FriendsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { requests, innerCircle, acceptRequest, addToInnerCircle } = useFriendsStore();
  const friends = useFriendsStore((s) => s.getFriends(user.id));
  const pendingRequests = requests.filter((r: any) => r.to === user.id);
  const innerFriends = friends.filter((f: any) => innerCircle.includes(f.id));
  const otherFriends = friends.filter((f: any) => !innerCircle.includes(f.id));

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}><Text style={s.headerTitle}>Friends</Text><TouchableOpacity style={s.addBtn}><Text style={s.addIcon}>+</Text></TouchableOpacity></View>
      <View style={s.linkCard}>
        <Text style={s.linkLabel}>Your link</Text>
        <View style={s.linkRow}><Text style={s.linkUrl}>{user.link}</Text><TouchableOpacity onPress={() => Alert.alert('Copied!', user.link)} style={s.copyBtn}><Text style={s.copyText}>Copy</Text></TouchableOpacity></View>
      </View>
      <FlatList data={[...(pendingRequests.length > 0 ? [{ type: 'pending', data: pendingRequests }] : []), { type: 'inner', data: innerFriends }, { type: 'all', data: otherFriends }]}
        keyExtractor={(item: any) => item.type} showsVerticalScrollIndicator={false}
        renderItem={({ item: section }: any) => (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{section.type === 'pending' ? 'Pending (' + section.data.length + ')' : section.type === 'inner' ? 'Inner Circle ⭐ (' + section.data.length + ')' : 'All Friends (' + section.data.length + ')'}</Text>
            {section.data.map((f: any) => {
              if (section.type === 'pending') {
                const from = USERS[f.from] || CURRENT_USER;
                return (
                  <View key={f.from} style={s.requestCard}>
                    <Image source={{ uri: from.avatar }} style={s.avatar} />
                    <View style={{ flex: 1 }}><Text style={s.friendName}>{from.name}</Text><Text style={s.friendBio}>{from.bio}</Text></View>
                    <TouchableOpacity onPress={() => acceptRequest(f.from, user.id)} style={s.acceptBtn}><Text style={s.acceptText}>Accept</Text></TouchableOpacity>
                  </View>
                );
              }
              return (
                <TouchableOpacity key={f.id} onPress={() => navigation.navigate('Chat', { friend: f })} style={s.friendCard}>
                  <Image source={{ uri: f.avatar }} style={s.avatar} />
                  <View style={s.friendInfo}><Text style={s.friendName}>{f.name}</Text><Text style={s.friendBio}>{f.mood?.emoji} {f.mood?.text}</Text></View>
                  {section.type === 'all' ? <TouchableOpacity onPress={() => addToInnerCircle(f.id)}><Text style={{ fontSize: 20, color: colors.textTertiary }}>☆</Text></TouchableOpacity> : <Text style={{ fontSize: 18 }}>⭐</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        ListFooterComponent={<View style={{ height: 40 }} />} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  addIcon: { color: '#FFF', fontSize: 24, fontWeight: '300' },
  linkCard: { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 16 },
  linkLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkUrl: { flex: 1, color: colors.primary, fontSize: 15, fontWeight: '600' },
  copyBtn: { backgroundColor: 'rgba(124,108,240,0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 24 },
  copyText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },
  requestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, padding: 14, marginBottom: 8, gap: 12 },
  friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, padding: 14, marginBottom: 8, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceElevated },
  friendInfo: { flex: 1 },
  friendName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  friendBio: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  acceptBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24 },
  acceptText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
