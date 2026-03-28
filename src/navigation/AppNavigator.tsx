import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useAuthStore } from '../store';
import { colors, font } from '../theme';

import OnboardingScreen from '../screens/auth/OnboardingScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import CreateScreen from '../screens/create/CreateScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChatScreen from '../screens/messages/ChatScreen';
import CommentScreen from '../screens/home/CommentScreen';
import StoryViewerScreen from '../screens/story/StoryViewerScreen';

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [activeTab, setActiveTab] = useState('Home');
  const [screen, setScreen] = useState<{ name: string; params?: any } | null>(null);

  if (!isLoggedIn) return <OnboardingScreen />;

  // Stack screen (modal-like)
  if (screen) {
    const goBack = () => setScreen(null);
    switch (screen.name) {
      case 'Chat': return <ChatScreen route={{ params: screen.params }} navigation={{ goBack }} />;
      case 'Comments': return <CommentScreen route={{ params: screen.params }} navigation={{ goBack }} />;
      case 'StoryViewer': return <StoryViewerScreen route={{ params: screen.params }} navigation={{ goBack }} />;
    }
  }

  const navigation = { navigate: (name: string, params?: any) => setScreen({ name, params }) };

  const renderTab = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen navigation={navigation} />;
      case 'Messages': return <MessagesScreen navigation={navigation} />;
      case 'Create': return <CreateScreen navigation={{ goBack: () => setActiveTab('Home'), navigate: navigation.navigate }} />;
      case 'Friends': return <FriendsScreen navigation={navigation} />;
      case 'Profile': return <ProfileScreen navigation={navigation} />;
      default: return <HomeScreen navigation={navigation} />;
    }
  };

  const tabs = [
    { id: 'Home', icon: '🏠', label: 'Home' },
    { id: 'Messages', icon: '💬', label: 'Messages' },
    { id: 'Create', icon: '+', label: '' },
    { id: 'Friends', icon: '👥', label: 'Friends' },
    { id: 'Profile', icon: '🪞', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderTab()}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={styles.tab}
          >
            {tab.id === 'Create' ? (
              <View style={styles.createBtn}>
                <Text style={styles.createIcon}>+</Text>
              </View>
            ) : (
              <Text style={[styles.tabIcon, activeTab === tab.id && styles.tabIconActive]}>{tab.icon}</Text>
            )}
            {tab.label ? <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text> : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: colors.bg, borderTopColor: colors.border, borderTopWidth: 0.5, paddingBottom: Platform.OS === 'ios' ? 28 : 12, paddingTop: 8, height: Platform.OS === 'ios' ? 88 : 68 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 22, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: colors.textTertiary, marginTop: 2 },
  tabLabelActive: { color: colors.primary },
  createBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: -12 },
  createIcon: { color: '#FFF', fontSize: 28, fontWeight: '700', marginTop: -2 },
});
