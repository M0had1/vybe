import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
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
  const progress = useRef(new Animated.Value(0)).current;

  const currentStory = userStories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;
    viewStory(userId, currentStory.id, user.id);
    // Auto-advance after 5 seconds
    Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false }).start(() => {
      if (currentIndex < userStories.length - 1) {
        setCurrentIndex(currentIndex + 1);
        progress.setValue(0);
      } else {
        navigation.goBack();
      }
    });
    return () => progress.stopAnimation();
  }, [currentIndex]);

  if (!currentStory) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>No stories</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}><Text style={{ color: colors.primary }}>Go back</Text></TouchableOpacity>
      </View>
    );
  }

  const handleTap = (side: 'left' | 'right') => {
    progress.stopAnimation();
    if (side === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      progress.setValue(0);
    } else if (side === 'right' && currentIndex < userStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      progress.setValue(0);
    } else if (side === 'right') {
      navigation.goBack();
    }
  };

  return (
    <View style={s.container}>
      <StatusBar hidden />

      {/* Background */}
      {currentStory.image ? (
        <Image source={{ uri: currentStory.image }} style={s.background} resizeMode="cover" />
      ) : (
        <View style={[s.background, s.moodBg]}>
          <Text style={s.moodEmoji}>{currentStory.emoji}</Text>
          <Text style={s.moodText}>{currentStory.content}</Text>
        </View>
      )}

      {/* Tap zones */}
      <View style={s.tapZones}>
        <TouchableOpacity style={s.tapLeft} onPress={() => handleTap('left')} />
        <TouchableOpacity style={s.tapRight} onPress={() => handleTap('right')} />
      </View>

      {/* Progress bars */}
      <View style={[s.progressContainer, { top: insets.top + 8 }]}>
        {userStories.map((_: any, i: number) => (
          <View key={i} style={s.progressBg}>
            {i < currentIndex ? (
              <View style={[s.progressFill, { width: '100%' }]} />
            ) : i === currentIndex ? (
              <Animated.View style={[s.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
            ) : null}
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={[s.header, { top: insets.top + 24 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Image source={{ uri: author?.avatar }} style={s.headerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.headerName}>{author?.name}</Text>
          <Text style={s.headerTime}>{getTimeAgo(currentStory.createdAt)}</Text>
        </View>
        <TouchableOpacity style={s.moreBtn}><Text style={s.moreIcon}>•••</Text></TouchableOpacity>
      </View>

      {/* Content (for photo stories) */}
      {currentStory.type === 'photo' && currentStory.content && (
        <View style={[s.captionContainer, { bottom: insets.bottom + 80 }]}>
          <Text style={s.caption}>{currentStory.content}</Text>
        </View>
      )}

      {/* Viewer count */}
      <View style={[s.viewerCount, { bottom: insets.bottom + 20 }]}>
        <Text style={s.viewerText}>👁 {currentStory.viewers.length} viewed</Text>
      </View>
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { ...StyleSheet.absoluteFillObject },
  moodBg: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  moodEmoji: { fontSize: 80, marginBottom: 16 },
  moodText: { color: colors.text, fontSize: font.xl, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 },
  tapZones: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
  progressContainer: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', gap: 4 },
  progressBg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  header: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 18 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.primary },
  headerName: { color: '#FFF', fontSize: font.md, fontWeight: '700' },
  headerTime: { color: 'rgba(255,255,255,0.6)', fontSize: font.xs },
  moreBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  moreIcon: { color: '#FFF', fontSize: 18 },
  captionContainer: { position: 'absolute', left: 20, right: 20 },
  caption: { color: '#FFF', fontSize: font.lg, fontWeight: '600', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  viewerCount: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  viewerText: { color: 'rgba(255,255,255,0.6)', fontSize: font.xs },
});
