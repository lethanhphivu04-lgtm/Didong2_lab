import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button } from '../components';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.codeTitle}>404</Text>
        <Text style={styles.title}>Không tìm thấy trang!</Text>
        <Text style={styles.body}>
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được thay đổi.
        </Text>

        <Button
          title="← Trở về Trang Chủ"
          accessibilityLabel="Trở về Trang Chủ"
          onPress={() => router.replace('/')}
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  codeTitle: {
    fontSize: 64,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: '100%',
  },
});
