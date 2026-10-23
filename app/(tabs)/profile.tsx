import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, StatTile } from '../../components';
import { profileService, authService } from '../../services';
import { Profile } from '../../types';

export default function ProfileTabScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async () => {
    const p = await profileService.getProfile();
    setProfile(p);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const initial = profile?.user.fullName ? profile.user.fullName[0].toUpperCase() : 'A';
  const goalTitle =
    profile?.goal?.type === 'fatLoss'
      ? 'Giảm mỡ'
      : profile?.goal?.type === 'muscleGain'
      ? 'Tăng cơ'
      : profile?.goal?.type === 'stayFit'
      ? 'Giữ dáng'
      : 'Tăng sức bền';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Header */}
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.user.fullName || 'Nguyễn Văn A'}</Text>
            <Text style={styles.userGoal}>Mục tiêu: {goalTitle} · Tuần 3/8</Text>
          </View>
        </View>

        {/* 3 Metric Stat Tiles */}
        <View style={styles.statGrid}>
          <StatTile
            label={strings.profile.height}
            value={`${profile?.physical.heightCm || 170} cm`}
            style={styles.statTileItem}
          />
          <StatTile
            label={strings.profile.weight}
            value={`${profile?.physical.weightKg || 65} kg`}
            style={styles.statTileItem}
          />
          <StatTile
            label={strings.profile.bmi}
            value={(profile?.physical.bmi || 22.5).toFixed(1).replace('.', ',')}
            style={styles.statTileItem}
          />
        </View>

        {/* Action Menu Items */}
        <Card
          onPress={() => router.push('/profile/edit')}
          style={styles.menuItemCard}
          accessibilityLabel={strings.profile.editProfile}
        >
          <Text style={styles.menuItemText}>{strings.profile.editProfile}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          onPress={() => router.push('/(onboarding)/step4-ai-plan')}
          style={styles.menuItemCard}
          accessibilityLabel={strings.profile.goalAndPlan}
        >
          <Text style={styles.menuItemText}>{strings.profile.goalAndPlan}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          onPress={() => router.push('/profile/settings')}
          style={styles.menuItemCard}
          accessibilityLabel={strings.profile.settings}
        >
          <Text style={styles.menuItemText}>{strings.profile.settings}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          onPress={handleLogout}
          style={styles.menuItemCard}
          accessibilityLabel={strings.profile.logout}
        >
          <Text style={[styles.menuItemText, styles.logoutText]}>
            {strings.profile.logout}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.warning} />
        </Card>
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.primary, // #C6F432
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textOnPrimary, // #0F1412
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  userGoal: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  statTileItem: {
    flex: 1,
    padding: theme.spacing.md,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 56,
  },
  menuItemText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
  logoutText: {
    color: theme.colors.warning, // #FFB454
  },
});
