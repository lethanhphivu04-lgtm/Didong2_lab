import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Chip, StatTile, Button } from '../../components';
import { progressService, workoutService } from '../../services';
import { ProgressStats, TimeRange, WorkoutLog } from '../../types';

export default function ProgressTabScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState('');

  const loadStats = async () => {
    const [s, logs] = await Promise.all([
      progressService.getProgressStats(selectedRange),
      workoutService.getWorkoutHistory(),
    ]);

    if (logs && logs.length > 0) {
      // Merge live logs with default recent logs if any
      s.recentLogs = [...logs, ...s.recentLogs.filter((l) => !logs.some((nl) => nl.id === l.id))];
      s.completedWorkoutsCount = Math.max(s.completedWorkoutsCount, logs.length + 13);
    }
    setStats(s);
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [selectedRange])
  );

  const handleAddWeight = async () => {
    const val = parseFloat(newWeightInput);
    if (!newWeightInput || isNaN(val) || val < 30 || val > 250) {
      Alert.alert('Không hợp lệ', 'Vui lòng nhập cân nặng hợp lệ (30 - 250 kg)');
      return;
    }
    await progressService.addWeightEntry(val);
    setShowAddWeight(false);
    setNewWeightInput('');
    loadStats();
  };

  // Timeline points per selected range
  const getTimelinePoints = () => {
    if (selectedRange === 'week') {
      return ['Thứ 2', 'Thứ 4', 'Hôm nay'];
    }
    if (selectedRange === 'month') {
      return ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    }
    return ['Tháng 1', 'Tháng 2', 'Tháng 3'];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{strings.progress.title}</Text>
          <TouchableOpacity
            style={styles.addWeightIconButton}
            onPress={() => setShowAddWeight(!showAddWeight)}
            accessibilityRole="button"
            accessibilityLabel="Ghi nhận cân nặng mới"
          >
            <Ionicons name="add" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Time range selector */}
        <View style={styles.rangeRow}>
          <Chip
            label={strings.progress.ranges.week}
            selected={selectedRange === 'week'}
            onPress={() => setSelectedRange('week')}
          />
          <Chip
            label={strings.progress.ranges.month}
            selected={selectedRange === 'month'}
            onPress={() => setSelectedRange('month')}
          />
          <Chip
            label={strings.progress.ranges.threeMonths}
            selected={selectedRange === 'threeMonths'}
            onPress={() => setSelectedRange('threeMonths')}
          />
        </View>

        {/* Optional Add Weight Inline Card */}
        {showAddWeight && (
          <Card style={styles.addWeightCard}>
            <Text style={styles.addWeightCardTitle}>Cập nhật cân nặng hôm nay</Text>
            <View style={styles.addWeightInputRow}>
              <TextInput
                style={styles.addWeightInput}
                placeholder="65.0"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                value={newWeightInput}
                onChangeText={setNewWeightInput}
              />
              <Text style={styles.addWeightKg}>kg</Text>
              <Button
                title="Lưu"
                size="small"
                accessibilityLabel="Lưu cân nặng mới"
                onPress={handleAddWeight}
                style={styles.saveWeightButton}
              />
            </View>
          </Card>
        )}

        {/* Weight Trend Card */}
        <Card style={styles.weightCard}>
          <Text style={styles.weightLabel}>{strings.progress.weightLabel}</Text>
          <Text style={styles.weightValue}>
            {stats?.currentWeightKg.toFixed(1).replace('.', ',') || '65,0'}
          </Text>

          {/* Simple chart timeline line */}
          <View style={styles.chartLineContainer}>
            <View style={styles.chartDottedLine} />
            <View style={styles.chartPoint1} />
            <View style={styles.chartPoint2} />
            <View style={styles.chartPoint3} />
          </View>

          <View style={styles.timelineRow}>
            {getTimelinePoints().map((pt, idx) => (
              <Text key={idx} style={styles.timelinePoint}>
                {pt}
              </Text>
            ))}
          </View>
        </Card>

        {/* 3 Metric Stat Tiles */}
        <View style={styles.statsRow}>
          <StatTile
            label={strings.progress.lostWeight}
            value={`${Math.abs(stats?.weightChangeKg || 2.4).toFixed(1).replace('.', ',')} kg`}
            style={styles.statTileItem}
          />
          <StatTile
            label={strings.progress.workoutsCount}
            value={stats?.completedWorkoutsCount || 14}
            style={styles.statTileItem}
          />
          <StatTile
            label={strings.progress.streakDays}
            value={stats?.currentStreakDays || 5}
            style={styles.statTileItem}
          />
        </View>

        {/* Recent Workouts */}
        <Text style={styles.sectionTitle}>{strings.progress.recentWorkouts}</Text>

        {stats?.recentLogs.map((log) => (
          <Card key={log.id} style={styles.logCard}>
            <View style={styles.logLeft}>
              <Text style={styles.logTitle}>{log.workoutTitle}</Text>
              <Text style={styles.logMeta}>
                {log.completedAt} · {log.durationMinutes} phút
              </Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{log.postureScore}</Text>
            </View>
          </Card>
        ))}
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  addWeightIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  addWeightCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderColor: theme.colors.primary,
  },
  addWeightCardTitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  addWeightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addWeightInput: {
    flex: 1,
    backgroundColor: '#0F1412',
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.fontFamilies.regular,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addWeightKg: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamilies.semiBold,
  },
  saveWeightButton: {
    height: 40,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  weightCard: {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  weightLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 34,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  chartLineContainer: {
    height: 40,
    justifyContent: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  chartDottedLine: {
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
  },
  chartPoint1: {
    position: 'absolute',
    left: '10%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  chartPoint2: {
    position: 'absolute',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  chartPoint3: {
    position: 'absolute',
    right: '10%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timelinePoint: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  statTileItem: {
    flex: 1,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  logLeft: {
    flex: 1,
  },
  logTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  logMeta: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  scoreContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 114, 78, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
