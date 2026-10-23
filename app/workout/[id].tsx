import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Header, ExerciseRow, Card, Button } from '../../components';
import { workoutService } from '../../services';
import { Workout } from '../../types';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    loadWorkout();
  }, [id]);

  const loadWorkout = async () => {
    const w = await workoutService.getWorkoutById(id || 'workout_today');
    setWorkout(w);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Buổi tập" />

        <Text style={styles.workoutTitle}>{workout?.title || 'Chân và Core'}</Text>
        <Text style={styles.workoutMeta}>
          {workout?.exercises.length || 3} bài · {workout?.durationMinutes || 25} phút · khoảng{' '}
          {workout?.estimatedCalories || 180} kcal
        </Text>

        {/* Exercises list */}
        {workout?.exercises.map((item) => (
          <ExerciseRow
            key={item.exerciseId}
            title={item.exercise.name}
            subtitle={`${item.sets} hiệp × ${item.repsOrSeconds}`}
            badgeText="Xem"
            onPress={() => router.push(`/exercise/${item.exerciseId}/video`)}
          />
        ))}

        {/* Rest note card */}
        <Card style={styles.restNoteCard}>
          <Text style={styles.restNoteText}>
            Nghỉ giữa các hiệp: {workout?.restSeconds || 45} giây. Khởi động{' '}
            {workout?.warmupMinutes || 5} phút trước khi bắt đầu.
          </Text>
        </Card>

        {/* Start CTA */}
        <Button
          title={strings.workout.startWorkoutSession}
          accessibilityLabel={strings.workout.startWorkoutSession}
          onPress={() => router.push(`/exercise/${workout?.exercises[0]?.exerciseId || 'squat'}/video`)}
          style={styles.startButton}
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
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxxl,
  },
  workoutTitle: {
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  restNoteCard: {
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  restNoteText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    marginTop: theme.spacing.md,
  },
});
