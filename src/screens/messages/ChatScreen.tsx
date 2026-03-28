import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../../theme';
import { useAuthStore, useMessagesStore } from '../../store';

export default function ChatScreen({ route, navigation }: any) {
  const { friend } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { conversations, sendMessage, markRead } = useMessagesStore();
  const [text, setText] = useState('');
  const messages = conversations[friend.id] || [];

  React.useEffect(() => { markRead(friend.id); }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(friend.id, text.trim());
    setText('');
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Image source={{ uri: friend.avatar }} style={s.headerAvatar} />
        <View style={{ flex: 1 }}><Text style={s.headerName}>{friend.name}</Text><Text style={s.headerStatus}>{friend.mood?.emoji} {friend.mood?.text}</Text></View>
        <TouchableOpacity style={s.moreBtn}><Text style={s.moreIcon}>⋯</Text></TouchableOpacity>
      </View>
      <View style={s.screenshotNotice}><Text style={s.screenshotText}>🔒 Screenshot detection active</Text></View>
      <View style={{ flex: 1, padding: 16 }}>
        {messages.map((item: any) => {
          const isMe = item.from === user.id;
          return (
            <View key={item.id} style={[s.bubbleRow, isMe && s.bubbleRowMe]}>
              <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
                <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{item.text}</Text>
                <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{isMe && item.read ? ' ✓✓' : ''}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity style={s.attachBtn}><Text style={s.attachIcon}>+</Text></TouchableOpacity>
          <TextInput style={s.input} placeholder="Message..." placeholderTextColor={colors.textTertiary} value={text} onChangeText={setText} onSubmitEditing={handleSend} returnKeyType="send" />
          <TouchableOpacity onPress={handleSend} style={s.sendBtn}><Text style={s.sendIcon}>{text.trim() ? '➤' : '🎤'}</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  backText: { color: colors.text, fontSize: 18 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface },
  headerName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  headerStatus: { color: colors.textSecondary, fontSize: 11 },
  moreBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  moreIcon: { color: colors.textTertiary, fontSize: 20 },
  screenshotNotice: { alignItems: 'center', paddingVertical: 8, backgroundColor: 'rgba(124,108,240,0.05)' },
  screenshotText: { color: colors.textTertiary, fontSize: 11 },
  bubbleRow: { marginBottom: 8, flexDirection: 'row' },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  bubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  bubbleText: { color: colors.text, fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: '#FFF' },
  bubbleTime: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.7)' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 8, gap: 8, borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.bg },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  attachIcon: { color: colors.primary, fontSize: 24, fontWeight: '300' },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, color: colors.text, fontSize: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontSize: 18 },
});
