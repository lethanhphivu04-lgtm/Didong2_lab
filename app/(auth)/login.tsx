import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField } from '../../components';
import { authService, profileService } from '../../services';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('ban@email.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = strings.common.requiredField;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = strings.auth.errors.invalidEmail;
    }

    if (!password) {
      newErrors.password = strings.common.requiredField;
    } else if (password.length < 8) {
      newErrors.password = strings.auth.errors.passwordTooShort;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await authService.login(email.trim(), password);

      const profile = await profileService.getProfile();
      setLoading(false);

      if (!profile || !profile.onboardingCompleted) {
        const step = profile ? profile.onboardingStep : 1;
        switch (step) {
          case 2:
            router.replace('/(onboarding)/step2-goal');
            break;
          case 3:
            router.replace('/(onboarding)/step3-schedule');
            break;
          case 4:
            router.replace('/(onboarding)/step4-ai-plan');
            break;
          case 1:
          default:
            router.replace('/(onboarding)/step1-profile');
            break;
        }
      } else {
        router.replace('/(tabs)/workout');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert(strings.common.error, 'Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await authService.login('google.user@gmail.com', 'google12345');
      setLoading(false);
      router.replace('/(onboarding)/step1-profile');
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
        />

        <TextField
          label={strings.auth.password}
          placeholder="••••••••"
          isPassword
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => Alert.alert('Quên mật khẩu', 'Vui lòng kiểm tra email để đặt lại mật khẩu.')}
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
            loading={loading}
            onPress={handleLogin}
            style={styles.primaryButton}
          />

          <Button
            title={strings.auth.continueWithGoogle}
            variant="secondary"
            accessibilityLabel={strings.auth.continueWithGoogle}
            onPress={handleGoogleLogin}
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
    color: theme.colors.primary,
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
