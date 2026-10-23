import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button } from '../../components';
import { nutritionService } from '../../services';
import { DailyNutrition } from '../../types';

export default function WaterTrackerScreen() {
  const router = useRouter();
  const [data, setData] = useState<DailyNutrition | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [intervalHours, setIntervalHours] = useState(2);
  const [cupSize, setCupSize] = useState(250);

  const loadData = async () => {
    const d = await nutritionService.getDailyNutrition();
    setData(d);
    setReminderEnabled(d.waterReminderEnabled ?? true);
    setIntervalHours(d.waterReminderIntervalHours ?? 2);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const targetMl = data?.waterTargetMl || 2000;
  const consumedMl = data?.waterConsumedMl || 1250;
  const percent = Math.min(Math.round((consumedMl / targetMl) * 100), 100);
  const remainingMl = Math.max(0, targetMl - consumedMl);

  const handleAddWater = async (amount: number) => {
    const updated = await nutritionService.logWater(amount);
    setData({ ...updated });
  };

  const handleReset = () => {
    Alert.alert('Đặt lại lượng nước', 'Bạn có chắc muốn đặt lại lượng nước đã uống về 0 ml hôm nay?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đặt lại',
        style: 'destructive',
        onPress: async () => {
          const updated = await nutritionService.resetWater();
          setData({ ...updated });
        },
      },
    ]);
  };

  const handleToggleReminder = async (val: boolean) => {
    setReminderEnabled(val);
    await nutritionService.setWaterReminderSettings(val, intervalHours);
  };

  const handleChangeTarget = (newTarget: number) => {
    Alert.alert(
      'Mục tiêu nước hàng ngày',
      `Chọn mục tiêu ${newTarget.toLocaleString()} ml / ngày?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            const updated = await nutritionService.setWaterTarget(newTarget);
            setData({ ...updated });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/nutrition');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* CaFit Top Coral Curved Banner */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerBack}
          accessibilityRole="button"
          accessibilityLabel={strings.common.back}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.cafit.water.title}</Text>
        <TouchableOpacity
          onPress={handleReset}
          style={styles.headerReset}
          accessibilityRole="button"
          accessibilityLabel="Đặt lại"
        >
          <Ionicons name="refresh-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main CaFit Water Gauge Card */}
        <Card style={styles.waterGaugeCard}>
          <View style={styles.waterLevelContainer}>
            {/* Water Wave Fill Simulation */}
            <View
              style={[
                styles.waterLevelFill,
                { height: `${Math.max(percent, 8)}%` },
              ]}
            />
            <View style={styles.waterInfoOverlay}>
              <Ionicons name="water" size={36} color={theme.colors.water} style={{ marginBottom: 4 }} />
              <Text style={styles.waterConsumedText}>
                {consumedMl.toLocaleString()} <Text style={styles.waterUnit}>ml</Text>
              </Text>
              <Text style={styles.waterTargetSubtext}>
                trên mục tiêu {targetMl.toLocaleString()} ml ({percent}%)
              </Text>
              <Text style={styles.remainingBadge}>
                {remainingMl > 0 ? `Còn thiếu ${remainingMl.toLocaleString()} ml` : 'Đã đạt mục tiêu hôm nay! 🎉'}
              </Text>
            </View>
          </View>

          {/* Quick Log Buttons */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              onPress={() => handleAddWater(250)}
              style={styles.quickAddButton}
              activeOpacity={0.8}
            >
              <Ionicons name="water-outline" size={22} color={theme.colors.water} />
              <Text style={styles.quickAddText}>+250 ml</Text>
              <Text style={styles.quickAddSub}>Cốc nhỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddWater(500)}
              style={[styles.quickAddButton, styles.quickAddButtonPrimary]}
              activeOpacity={0.8}
            >
              <Ionicons name="flask" size={22} color="#FFFFFF" />
              <Text style={[styles.quickAddText, { color: '#FFFFFF' }]}>+500 ml</Text>
              <Text style={[styles.quickAddSub, { color: 'rgba(255,255,255,0.8)' }]}>Bình nước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddWater(-250)}
              style={styles.quickAddButton}
              activeOpacity={0.8}
            >
              <Ionicons name="remove-circle-outline" size={22} color={theme.colors.textMuted} />
              <Text style={[styles.quickAddText, { color: theme.colors.textSecondary }]}>-250 ml</Text>
              <Text style={styles.quickAddSub}>Hoàn tác</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Daily Target Setting */}
        <Text style={styles.sectionTitle}>Mục tiêu hàng ngày</Text>
        <View style={styles.targetsRow}>
          {[1800, 2000, 2500, 3000].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => handleChangeTarget(t)}
              style={[
                styles.targetOption,
                targetMl === t && styles.targetOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.targetOptionText,
                  targetMl === t && styles.targetOptionTextActive,
                ]}
              >
                {t >= 1000 ? `${t / 1000}L` : `${t}ml`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reminder Settings (Matching CFA_ Water Settings.psd) */}
        <Text style={styles.sectionTitle}>Cài đặt nhắc nhở (CaFit)</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{strings.cafit.water.reminderTitle}</Text>
              <Text style={styles.settingSubtext}>{strings.cafit.water.reminderSubtitle}</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: theme.colors.surfaceHighlight, true: theme.colors.water }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Cốc nước yêu thích</Text>
              <Text style={styles.settingSubtext}>Dung tích mỗi lần uống thường dùng</Text>
            </View>
            <Text style={styles.settingValueText}>{cupSize} ml</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Khoảng thời gian nhắc</Text>
              <Text style={styles.settingSubtext}>Mỗi {intervalHours} tiếng một lần</Text>
            </View>
            <Text style={styles.settingValueText}>08:00 - 22:00</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerReset: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  waterGaugeCard: {
    borderRadius: 24,
    padding: 0,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  waterLevelContainer: {
    height: 230,
    backgroundColor: theme.colors.surfaceHighlight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterLevelFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(56, 182, 255, 0.35)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  waterInfoOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  waterConsumedText: {
    fontSize: 42,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  waterUnit: {
    fontSize: 22,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  waterTargetSubtext: {
    fontSize: 14,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  remainingBadge: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.water,
    backgroundColor: 'rgba(56, 182, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: theme.colors.surface,
  },
  quickAddButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickAddButtonPrimary: {
    backgroundColor: theme.colors.water,
    borderColor: theme.colors.water,
  },
  quickAddText: {
    fontSize: 16,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.water,
    marginTop: 4,
  },
  quickAddSub: {
    fontSize: 11,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  targetsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  targetOption: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  targetOptionActive: {
    borderColor: theme.colors.water,
    backgroundColor: 'rgba(56, 182, 255, 0.12)',
  },
  targetOptionText: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textSecondary,
  },
  targetOptionTextActive: {
    color: theme.colors.water,
    fontFamily: theme.fontFamilies.bold,
  },
  settingsCard: {
    borderRadius: 20,
    padding: theme.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
  settingSubtext: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  settingValueText: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.water,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 14,
  },
});
