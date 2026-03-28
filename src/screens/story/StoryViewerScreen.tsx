import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font } from '../../theme';
import { useAuthStore, useStoriesStore } from '../../store';
import { USERS, CURRENT_USER } from '../../services/mockData';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function StoryViewerScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { stories, viewStory } = useStoriesStore();
  const userStories = stories[userId] || [];
  const author = userId === user.id ? user : USERS[userId];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = userStories[currentIndex];

  React.useEffect(() => {
    if (!currentStory) return;
    viewStory(userId, currentStory.id, user.id);
    const timer = setTimeout(() => {
      if (currentIndex < userStories.length - 1) setCurrentIndex(currentIndex + 1);
      else navigation.goBack();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!currentStory) return (
    <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: colors.text }}>No stories</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}><Text style={{ color: colors.primary }}>Go back</Text></TouchableOpacity>
    </View>
  );

  const handleTap = (side: string) => {
    if (side === 'left' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else if (side === 'right') {
      if (currentIndex < userStories.length - 1) setCurrentIndex(currentIndex + 1);
      else navigation.goBack();
    }
  };

  return (
    <View style={s.container}>
      {currentStory.image ? (
        <Image source={{ uri: currentStory.image }} style={s.background} resizeMode="cover" />
      ) : (
        <View style={[s.background, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>{currentStory.emoji}</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 }}>{currentStory.content}</Text>
        </View>
      )}
      <View style={s.tapZones}><TouchableOpacity style={{ flex: 1 }} onPress={() => handleTap('left')} /><TouchableOpacity style={{ flex: 1 }} onPress={() => handleTap('right')} /></View>
      <View style={[s.progressContainer, { top: insets.top + 8 }]}>
        {userStories.map((_: any, i: number) => (
          <View key={i} style={[s.progressBg, i <= currentIndex && { backgroundColor: 'rgba(255,255,255,0.8)' }]} />
        ))}
      </View>
      <View style={[s.header, { top: insets.top + 24 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Image source={{ uri: author?.avatar }} style={s.headerAvatar} />
        <View style={{ flex: 1 }}><Text style={s.headerName}>{author?.name}</Text></View>
      </View>
      <View style={[s.viewerCount, { bottom: insets.bottom + 20 }]}><Text style={s.viewerText}>👁 {currentStory.viewers.length} viewed</Text></View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { ...StyleSheet.absoluteFillObject },
  tapZones: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  progressContainer: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', gap: 4 },
  progressBg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  header: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 18 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.primary },
  headerName: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  viewerCount: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  viewerText: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
});
