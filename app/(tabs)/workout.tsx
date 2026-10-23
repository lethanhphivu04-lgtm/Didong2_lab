import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button, StatTile, ExerciseRow } from '../../components';
import { workoutService, nutritionService } from '../../services';
import { Workout, DailyNutrition } from '../../types';

export default function WorkoutTabScreen() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [w, n] = await Promise.all([
      workoutService.getTodayWorkout(),
      nutritionService.getDailyNutrition(),
    ]);
    setWorkout(w);
    setNutrition(n);
  };

  const completedExercisesCount =
    workout?.exercises.filter((e) => e.isCompleted).length || 2;
  const totalExercisesCount = workout?.exercises.length || 3;
  const remainingExercises = totalExercisesCount - completedExercisesCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Greeting */}
        <Text style={styles.dateText}>Thứ Sáu, 23/10</Text>
        <Text style={styles.headerTitle}>{strings.workout.todayQuestion}</Text>

        {/* Hero Card: Suggested Session */}
        <Card variant="hero" style={styles.heroCard}>
          <Text style={styles.heroBadge}>{strings.workout.suggestedSession}</Text>
          <Text style={styles.heroTitle}>{workout?.category || 'Chân và Core'}</Text>
          <Text style={styles.heroSubtitle}>
            {workout?.exercises.length || 3} bài · khoảng {workout?.durationMinutes || 25} phút
          </Text>

          <Button
            title={strings.workout.startSession}
            accessibilityLabel={strings.workout.startSession}
            onPress={() => router.push('/workout/workout_today')}
            style={styles.heroButton}
            textStyle={styles.heroButtonText}
          />
        </Card>

        {/* 2 Stat Tiles: Calories & Completed Exercises */}
        <View style={styles.statGrid}>
          <StatTile
            label={strings.workout.caloriesConsumed}
            value={nutrition?.caloriesConsumed.toLocaleString() || '1.240'}
            subtext={`mục tiêu ${nutrition?.calorieTarget || 2000} kcal`}
            progressPercent={((nutrition?.caloriesConsumed || 1240) / (nutrition?.calorieTarget || 2000)) * 100}
            style={styles.statTileItem}
          />

          <StatTile
            label={strings.workout.exercisesDone}
            value={`${completedExercisesCount} / ${totalExercisesCount}`}
            subtext={`còn ${remainingExercises} bài`}
            progressPercent={(completedExercisesCount / totalExercisesCount) * 100}
            style={styles.statTileItem}
          />
        </View>

        {/* Exercises in Session */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{strings.workout.exercisesInSession}</Text>
          <Button
            title="Thư viện"
            variant="ghost"
            size="small"
            accessibilityLabel="Mở thư viện bài tập"
            onPress={() => router.push('/exercise-library')}
          />
        </View>

        {workout?.exercises.map((item) => (
          <ExerciseRow
            key={item.exerciseId}
            title={item.exercise.name}
            subtitle={`${item.sets} hiệp × ${item.repsOrSeconds}`}
            badgeText={strings.workout.videoBadge}
            onPress={() => router.push(`/exercise/${item.exerciseId}/video`)}
          />
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
  dateText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  heroCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: 20,
  },
  heroBadge: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textOnPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textOnPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: '#28322D',
    marginBottom: theme.spacing.lg,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.textOnPrimary, // #0F1412
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  heroButtonText: {
    color: theme.colors.primary, // #C6F432
    fontFamily: theme.fontFamilies.bold,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.xl,
  },
  statTileItem: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
});
