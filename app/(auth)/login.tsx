import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField } from '../../components';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('ban@email.com');
  const [password, setPassword] = useState('12345678');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand squircle logo */}
        <View style={styles.logoSquircle} />

        {/* Title & subtitle */}
        <Text style={styles.title}>{strings.auth.welcomeBack}</Text>
        <Text style={styles.subtitle}>{strings.auth.loginSubtitle}</Text>

        {/* Form Inputs */}
        <TextField
          label={strings.auth.email}
          placeholder="ban@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextField
          label={strings.auth.password}
          placeholder="••••••••"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel={strings.auth.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>
            {strings.auth.forgotPassword}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionSection}>
          <Button
            title={strings.auth.login}
            accessibilityLabel={strings.auth.login}
            onPress={() => router.push('/(onboarding)/step1-profile')}
            style={styles.primaryButton}
          />

          <Button
            title={strings.auth.continueWithGoogle}
            variant="secondary"
            accessibilityLabel={strings.auth.continueWithGoogle}
            onPress={() => router.push('/(onboarding)/step1-profile')}
            style={styles.googleButton}
          />

          <TouchableOpacity
            style={styles.switchAuthButton}
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="button"
            accessibilityLabel={strings.auth.noAccount}
          >
            <Text style={styles.switchAuthText}>
              Chưa có tài khoản?{' '}
              <Text style={styles.switchAuthHighlight}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xxxl,
  },
  logoSquircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: theme.colors.primary, // #C6F432
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
    lineHeight: 22,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.primary, // #C6F432
  },
  actionSection: {
    marginTop: theme.spacing.lg,
  },
  primaryButton: {
    marginBottom: theme.spacing.md,
  },
  googleButton: {
    marginBottom: theme.spacing.xl,
  },
  switchAuthButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  switchAuthText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  switchAuthHighlight: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
  },
});
