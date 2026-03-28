import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font, spacing } from '../../theme';
import { useAuthStore } from '../../store';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const fade = useRef(new Animated.Value(1)).current;

  const nextStep = () => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(step + 1), 200);
  };

  const handleLogin = () => { login(); };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      {/* Animated orbs */}
      <View style={s.bgOrbs}>
        <View style={[s.orb, { backgroundColor: colors.primary, top: -60, right: -80, width: 280, height: 280, borderRadius: 140 }]} />
        <View style={[s.orb, { backgroundColor: colors.accent, bottom: 80, left: -60, width: 220, height: 220, borderRadius: 110 }]} />
        <View style={[s.orb, { backgroundColor: '#FF6B35', bottom: -40, right: -30, width: 180, height: 180, borderRadius: 90 }]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Animated.View style={[s.content, { opacity: fade, paddingTop: height * 0.12 }]}>
          {step === 0 && (
            <>
              <Text style={s.logo}>✨</Text>
              <Text style={s.brand}>Vybe</Text>
              <Text style={s.tagline}>Your space. Your people. Your rules.</Text>
              <TouchableOpacity onPress={nextStep} style={s.cta}><Text style={s.ctaText}>Get Started</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} style={s.skipBtn}><Text style={s.skipText}>Already have an account? Sign in</Text></TouchableOpacity>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={s.stepTitle}>Your phone number</Text>
              <Text style={s.stepSub}>We'll send you a code to verify</Text>
              <TextInput style={s.input} placeholder="+1 (555) 000-0000" placeholderTextColor={colors.textTertiary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <TouchableOpacity onPress={nextStep} style={[s.cta, !phone && s.ctaDisabled]} disabled={!phone}><Text style={s.ctaText}>Send Code</Text></TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={s.stepTitle}>Enter the code</Text>
              <Text style={s.stepSub}>Sent to {phone || '+1 ••• ••• ••00'}</Text>
              <TextInput style={s.input} placeholder="• • • • • •" placeholderTextColor={colors.textTertiary} value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} />
              <TouchableOpacity onPress={nextStep} style={[s.cta, !otp && s.ctaDisabled]} disabled={!otp}><Text style={s.ctaText}>Verify</Text></TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={s.stepTitle}>What should we call you?</Text>
              <Text style={s.stepSub}>This is how your friends will see you</Text>
              <TextInput style={s.input} placeholder="Your name" placeholderTextColor={colors.textTertiary} value={name} onChangeText={setName} />
              <TouchableOpacity onPress={nextStep} style={[s.cta, !name && s.ctaDisabled]} disabled={!name}><Text style={s.ctaText}>Continue</Text></TouchableOpacity>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={s.stepTitle}>How are you feeling?</Text>
              <Text style={s.stepSub}>Set your mood status</Text>
              <View style={s.moodGrid}>
                {[
                  { emoji: '🟢', text: 'Good' },
                  { emoji: '🟡', text: 'Meh' },
                  { emoji: '🔵', text: 'Reflective' },
                  { emoji: '🟠', text: 'Energized' },
                  { emoji: '🔴', text: 'Low' },
                ].map((m) => (
                  <TouchableOpacity key={m.text} onPress={handleLogin} style={s.moodBtn}>
                    <Text style={s.moodEmoji}>{m.emoji}</Text>
                    <Text style={s.moodText}>{m.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  bgOrbs: { ...StyleSheet.absoluteFillObject },
  orb: { position: 'absolute', opacity: 0.15 },
  content: { flex: 1, paddingHorizontal: 28, alignItems: 'center' },
  logo: { fontSize: 64, marginBottom: 12 },
  brand: { fontSize: font.hero, fontWeight: '900', color: colors.text, letterSpacing: -1, marginBottom: 8 },
  tagline: { fontSize: font.lg, color: colors.textSecondary, textAlign: 'center', marginBottom: 48, lineHeight: 26 },
  stepTitle: { fontSize: font.xxl, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center' },
  stepSub: { fontSize: font.md, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  input: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 20, paddingVertical: 16, color: colors.text, fontSize: font.lg, textAlign: 'center', marginBottom: 24, letterSpacing: 2 },
  cta: { width: '100%', backgroundColor: colors.primary, borderRadius: radius.xl, paddingVertical: 16, alignItems: 'center', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#FFF', fontSize: font.lg, fontWeight: '700' },
  skipBtn: { padding: 12 },
  skipText: { color: colors.textSecondary, fontSize: font.sm },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, width: '100%' },
  moodBtn: { width: '30%', backgroundColor: colors.surface, borderRadius: radius.xl, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  moodEmoji: { fontSize: 32, marginBottom: 8 },
  moodText: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '600' },
});
