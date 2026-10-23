import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField } from '../../components';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{strings.auth.createAccount}</Text>
        <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>

        <TextField
          label={strings.auth.fullName}
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChangeText={setFullName}
        />

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
          placeholder="Tối thiểu 8 ký tự"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <TextField
          label={strings.auth.confirmPassword}
          placeholder="Nhập lại mật khẩu"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Agree terms checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreeTerms(!agreeTerms)}
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

        <Button
          title={strings.auth.createAccount}
          accessibilityLabel={strings.auth.createAccount}
          onPress={() => router.push('/(onboarding)/step1-profile')}
          style={styles.registerButton}
        />

        <TouchableOpacity
          style={styles.switchAuthButton}
          onPress={() => router.push('/(auth)/login')}
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
    marginVertical: theme.spacing.lg,
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
  registerButton: {
    marginTop: theme.spacing.md,
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
