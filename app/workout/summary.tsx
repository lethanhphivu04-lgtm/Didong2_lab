import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button, StatTile, Header } from '../../components';
import { workoutService } from '../../services';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const [hasSaved, setHasSaved] = useState(false);

  const workoutData = {
    workoutId: 'workout_today',
    workoutTitle: 'Chân và Core',
    durationMinutes: 26,
    caloriesBurned: 195,
    totalReps: 108,
    postureScore: 86,
    exerciseScores: [
      { exerciseId: 'squat', exerciseName: 'Squat', score: 88 },
      { exerciseId: 'plank', exerciseName: 'Plank', score: 90 },
      { exerciseId: 'lunge', exerciseName: 'Lunge', score: 80 },
    ],
  };

  useEffect(() => {
    async function saveLog() {
      if (!hasSaved) {
        await workoutService.saveWorkoutLog({
          ...workoutData,
          completedAt: 'Hôm nay',
        });
        setHasSaved(true);
      }
    }
    saveLog();
  }, [hasSaved]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 Tôi vừa hoàn thành buổi tập "${workoutData.workoutTitle}" cùng Fitness AI!\n⏱️ Thời gian: ${workoutData.durationMinutes} phút\n⚡ Calo đốt: ${workoutData.caloriesBurned} kcal\n🎯 Điểm tư thế: ${workoutData.postureScore}/100`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title={strings.workout.workoutCompleted}
          showBack
          onBack={() => router.replace('/(tabs)/workout')}
        />

        {/* 4 Big Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <StatTile
              label={strings.workout.durationLabel}
              value={`${workoutData.durationMinutes} phút`}
              style={styles.metricTile}
            />
            <StatTile
              label={strings.workout.caloriesBurnedLabel}
              value={`${workoutData.caloriesBurned} kcal`}
              style={styles.metricTile}
            />
          </View>
          <View style={styles.metricRow}>
            <StatTile
              label={strings.workout.totalRepsLabel}
              value={workoutData.totalReps}
              style={styles.metricTile}
            />
            <StatTile
              label={strings.workout.postureScoreLabel}
              value={`${workoutData.postureScore}/100`}
              style={styles.metricTile}
            />
          </View>
        </View>

        {/* Posture Score Per Exercise */}
        <Text style={styles.sectionTitle}>
          {strings.workout.postureScorePerExercise}
        </Text>

        {workoutData.exerciseScores.map((item) => (
          <Card key={item.exerciseId} style={styles.scoreRowCard}>
            <Text style={styles.exerciseName}>{item.exerciseName}</Text>
            <Text style={styles.scoreValue}>{item.score}</Text>
          </Card>
        ))}

        {/* Bottom Action Buttons */}
        <Button
          title={strings.workout.finishButton}
          accessibilityLabel={strings.workout.finishButton}
          onPress={() => router.replace('/(tabs)/workout')}
          style={styles.finishButton}
        />

        <Button
          title={strings.workout.shareResult}
          variant="secondary"
          accessibilityLabel={strings.workout.shareResult}
          onPress={handleShare}
          style={styles.shareButton}
        />
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: theme.spacing.xl,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricTile: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  scoreRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  exerciseName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
  scoreValue: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  finishButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  shareButton: {
    marginBottom: theme.spacing.lg,
  },
});
