import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Chip, StatTile } from '../../components';
import { progressService } from '../../services';
import { ProgressStats, TimeRange } from '../../types';

export default function ProgressTabScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    loadStats();
  }, [selectedRange]);

  const loadStats = async () => {
    const s = await progressService.getProgressStats(selectedRange);
    setStats(s);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>{strings.progress.title}</Text>

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

        {/* Weight Trend Card */}
        <Card style={styles.weightCard}>
          <Text style={styles.weightLabel}>{strings.progress.weightLabel}</Text>
          <Text style={styles.weightValue}>
            {stats?.currentWeightKg.toFixed(1).replace('.', ',') || '65,0'}
          </Text>

          {/* Simple chart timeline line */}
          <View style={styles.chartLineContainer}>
            <View style={styles.chartDottedLine} />
          </View>

          <View style={styles.timelineRow}>
            {stats?.weightHistory.map((item) => (
              <Text key={item.id} style={styles.timelinePoint}>
                {item.date}
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
  headerTitle: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.lg,
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
  },
  chartDottedLine: {
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
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
    backgroundColor: '#242D29',
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
