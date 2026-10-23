import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField, Header } from '../../components';
import { authService, profileService } from '../../services';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = strings.auth.errors.emptyName;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = strings.common.requiredField;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = strings.auth.errors.passwordMismatch;
    }

    if (!agreeTerms) {
      newErrors.terms = strings.auth.errors.termsRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const user = await authService.register(fullName.trim(), email.trim(), password);
      // Initialize profile with step 1
      await profileService.updateProfile({
        user,
        onboardingCompleted: false,
        onboardingStep: 1,
      });
      setLoading(false);
      router.replace('/(onboarding)/step1-profile');
    } catch (e) {
      setLoading(false);
      Alert.alert(strings.common.error, 'Không thể tạo tài khoản. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header showBack onBack={() => router.back()} />

        <Text style={styles.title}>{strings.auth.createAccount}</Text>
        <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>

        <TextField
          label={strings.auth.fullName}
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
          }}
          error={errors.fullName}
        />

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
          placeholder="Tối thiểu 8 ký tự"
          isPassword
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        <TextField
          label={strings.auth.confirmPassword}
          placeholder="Nhập lại mật khẩu"
          isPassword
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
        />

        {/* Agree terms checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => {
            setAgreeTerms(!agreeTerms);
            if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreeTerms }}
          accessibilityLabel={strings.auth.agreeTerms}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
            {agreeTerms && (
              <Ionicons name="checkmark" size={16} color={theme.colors.textOnPrimary} />
            )}
          </View>
          <Text style={styles.termsText}>{strings.auth.agreeTerms}</Text>
        </TouchableOpacity>
        {!!errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

        <Button
          title={strings.auth.createAccount}
          accessibilityLabel={strings.auth.createAccount}
          loading={loading}
          onPress={handleRegister}
          style={styles.registerButton}
        />

        <TouchableOpacity
          style={styles.switchAuthButton}
          onPress={() => router.replace('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel={strings.auth.alreadyHaveAccount}
        >
          <Text style={styles.switchAuthText}>
            Đã có tài khoản?{' '}
            <Text style={styles.switchAuthHighlight}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    minHeight: 44,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  termsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamilies.regular,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.danger,
    marginTop: 4,
    marginBottom: 8,
    fontFamily: theme.fontFamilies.regular,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
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
