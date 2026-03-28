import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { useAuthStore } from '../src/store';
import AppNavigator from '../src/navigation/AppNavigator';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 800); }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg } });
