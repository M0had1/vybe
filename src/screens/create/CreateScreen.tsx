import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, usePostsStore, useStoriesStore } from '../../store';

const { width: SCREEN_W } = Dimensions.get('window');

export default function CreateScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { addPost } = usePostsStore();
  const { addStory } = useStoriesStore();
  const [mode, setMode] = useState<'post' | 'story'>('post');
  const [type, setType] = useState<string>('photo');
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleCreate = () => {
    if (type === 'mood' && !emoji) {
      Alert.alert('Pick a mood', 'Choose an emoji for your mood');
      return;
    }

    const post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      type,
      content: text || (type === 'mood' ? 'Vibing' : 'New moment'),
      emoji: type === 'mood' ? emoji : undefined,
      images: type === 'photo' ? [`https://picsum.photos/seed/${Date.now()}/600/800`] : undefined,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    if (mode === 'post') {
      addPost(post);
    } else {
      addStory(user.id, { id: `s-${Date.now()}`, type, content: text, emoji, image: type === 'photo' ? `https://picsum.photos/seed/${Date.now()}/400/700` : undefined, createdAt: new Date(), viewers: [] });
    }

    Alert.alert(mode === 'post' ? 'Posted!' : 'Story added!', '', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
    setText('');
    setEmoji('');
  };

  const types = [
    { id: 'photo', icon: '📸', label: 'Photo' },
    { id: 'video', icon: '🎬', label: 'Video' },
    { id: 'mood', icon: '🎭', label: 'Mood' },
    { id: 'voice', icon: '🎙', label: 'Voice' },
    { id: 'song', icon: '🎵', label: 'Song' },
    { id: 'note', icon: '📝', label: 'Note' },
  ];

  const moods = ['😀', '🥰', '😎', '🤔', '😢', '😤', '🔥', '💀', '🫠', '✨'];

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.closeBtn}><Text style={s.closeText}>✕</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Create</Text>
        <TouchableOpacity onPress={handleCreate} style={s.postBtn}><Text style={s.postBtnText}>{mode === 'post' ? 'Post' : 'Share'}</Text></TouchableOpacity>
      </View>

      {/* Mode toggle */}
      <View style={s.modeToggle}>
        <TouchableOpacity onPress={() => setMode('post')} style={[s.modeTab, mode === 'post' && s.modeTabActive]}><Text style={[s.modeText, mode === 'post' && s.modeTextActive]}>Post</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('story')} style={[s.modeTab, mode === 'story' && s.modeTabActive]}><Text style={[s.modeText, mode === 'story' && s.modeTextActive]}>Story</Text></TouchableOpacity>
      </View>

      {/* Content type selector */}
      <View style={s.typeRow}>
        {types.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => setType(t.id)} style={[s.typeBtn, type === t.id && s.typeBtnActive]}>
            <Text style={s.typeIcon}>{t.icon}</Text>
            <Text style={[s.typeLabel, type === t.id && s.typeLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content area */}
      <View style={s.contentArea}>
        {type === 'mood' ? (
          <View style={s.moodSelector}>
            <Text style={s.moodLabel}>How are you feeling?</Text>
            <View style={s.moodGrid}>
              {moods.map((m) => (
                <TouchableOpacity key={m} onPress={() => setEmoji(m)} style={[s.moodOption, emoji === m && s.moodOptionActive]}>
                  <Text style={s.moodEmoji}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={s.moodInput} placeholder="What's on your mind?" placeholderTextColor={colors.textTertiary} value={text} onChangeText={setText} multiline />
          </View>
        ) : (
          <>
            <View style={s.cameraPlaceholder}>
              <Text style={s.cameraIcon}>{type === 'photo' ? '📸' : type === 'video' ? '🎬' : type === 'voice' ? '🎙' : type === 'song' ? '🎵' : '📝'}</Text>
              <Text style={s.cameraText}>
                {type === 'photo' ? 'Tap to capture or choose from gallery' :
                 type === 'video' ? 'Tap to record or choose from gallery' :
                 type === 'voice' ? 'Hold to record' :
                 type === 'song' ? 'Search for a song' :
                 'Write your thoughts'}
              </Text>
            </View>
            <TextInput
              style={s.textInput}
              placeholder={type === 'note' ? 'Write something...' : 'Add a caption...'}
              placeholderTextColor={colors.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
            />
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: colors.text, fontSize: 18 },
  headerTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  postBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.full },
  postBtnText: { color: '#FFF', fontSize: font.md, fontWeight: '700' },
  modeToggle: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 4, marginBottom: 16 },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.md },
  modeTabActive: { backgroundColor: colors.primary },
  modeText: { color: colors.textSecondary, fontSize: font.md, fontWeight: '600' },
  modeTextActive: { color: '#FFF' },
  typeRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginBottom: 20 },
  typeBtn: { alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.lg },
  typeBtnActive: { backgroundColor: 'rgba(124,108,240,0.1)' },
  typeIcon: { fontSize: 24 },
  typeLabel: { color: colors.textTertiary, fontSize: font.xs, fontWeight: '600' },
  typeLabelActive: { color: colors.primary },
  contentArea: { flex: 1, paddingHorizontal: 16 },
  cameraPlaceholder: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.xxl, justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 16 },
  cameraIcon: { fontSize: 64 },
  cameraText: { color: colors.textSecondary, fontSize: font.md, textAlign: 'center' },
  textInput: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, color: colors.text, fontSize: font.md, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  moodSelector: { flex: 1 },
  moodLabel: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 },
  moodOption: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  moodOptionActive: { borderColor: colors.primary, backgroundColor: 'rgba(124,108,240,0.1)' },
  moodEmoji: { fontSize: 28 },
  moodInput: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 16, color: colors.text, fontSize: font.lg, minHeight: 100, textAlignVertical: 'top', textAlign: 'center' },
});
