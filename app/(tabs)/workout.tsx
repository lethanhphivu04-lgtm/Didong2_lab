import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button, StatTile, ExerciseRow } from '../../components';
import { workoutService, nutritionService } from '../../services';
import { Workout, DailyNutrition } from '../../types';

export default function WorkoutTabScreen() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null);

  const loadData = async () => {
    const [w, n] = await Promise.all([
      workoutService.getTodayWorkout(),
      nutritionService.getDailyNutrition(),
    ]);
    setWorkout(w);
    setNutrition(n);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const completedExercisesCount =
    workout?.exercises.filter((e) => e.isCompleted).length || 2;
  const totalExercisesCount = workout?.exercises.length || 3;
  const remainingExercises = totalExercisesCount - completedExercisesCount;

  const quickFeatures = [
    {
      id: 'exercises',
      title: strings.cafit.homeGrid.exercises,
      subtitle: 'Video 3D & AI',
      icon: 'barbell',
      color: theme.colors.primary,
      route: '/workout/workout_today',
    },
    {
      id: 'cardio',
      title: strings.cafit.homeGrid.cardio,
      subtitle: 'Đo nhịp tim & GPS',
      icon: 'walk',
      color: theme.colors.heart,
      route: '/workout/cardio',
    },
    {
      id: 'water',
      title: strings.cafit.homeGrid.water,
      subtitle: `${nutrition?.waterConsumedMl || 1250}/${nutrition?.waterTargetMl || 2000} ml`,
      icon: 'water',
      color: theme.colors.water,
      route: '/workout/water',
    },
    {
      id: 'nutrition',
      title: strings.cafit.homeGrid.nutrition,
      subtitle: 'Quét món ăn AI',
      icon: 'restaurant',
      color: theme.colors.warning,
      route: '/nutrition/scan',
    },
    {
      id: 'tips',
      title: strings.cafit.homeGrid.tips,
      subtitle: 'Chuẩn khoa học',
      icon: 'bulb',
      color: theme.colors.lime,
      route: '/workout/tips',
    },
    {
      id: 'stats',
      title: strings.cafit.homeGrid.stats,
      subtitle: 'Biểu đồ cân nặng',
      icon: 'stats-chart',
      color: theme.colors.info,
      route: '/(tabs)/progress',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Greeting */}
        <Text style={styles.dateText}>Thứ Sáu, 23/10 · CaFit Pro</Text>
        <Text style={styles.headerTitle}>{strings.workout.todayQuestion}</Text>

        {/* Hero Card: Suggested Session (CaFit Warm Coral Aesthetics) */}
        <Card variant="hero" style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Text style={styles.heroBadge}>{strings.workout.suggestedSession}</Text>
            <View style={styles.heroLevelBadge}>
              <Text style={styles.heroLevelText}>Tuần 1 / 8</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{workout?.category || 'Chân và Core'}</Text>
          <Text style={styles.heroSubtitle}>
            {workout?.exercises.length || 3} bài tập · khoảng {workout?.durationMinutes || 25} phút
          </Text>

          <Button
            title={strings.workout.startSession}
            accessibilityLabel={strings.workout.startSession}
            onPress={() => router.push('/workout/workout_today')}
            style={styles.heroButton}
            textStyle={styles.heroButtonText}
            icon={<Ionicons name="play" size={18} color={theme.colors.primary} />}
          />
        </Card>

        {/* CaFit Quick-Access Feature Grid (Matching CFA Menu.psd) */}
        <Text style={styles.sectionTitle}>Tính năng CaFit</Text>
        <View style={styles.quickGrid}>
          {quickFeatures.map((feat) => (
            <TouchableOpacity
              key={feat.id}
              onPress={() => router.push(feat.route as any)}
              style={styles.quickGridItem}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={feat.title}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: `${feat.color}20` }]}>
                <Ionicons name={feat.icon as any} size={22} color={feat.color} />
              </View>
              <Text style={styles.quickGridTitle}>{feat.title}</Text>
              <Text style={styles.quickGridSubtitle} numberOfLines={1}>{feat.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2 Stat Tiles: Calories & Water / Completed Exercises */}
        <View style={styles.statGrid}>
          <StatTile
            label={strings.workout.caloriesConsumed}
            value={nutrition?.caloriesConsumed.toLocaleString() || '1.240'}
            subtext={`mục tiêu ${nutrition?.calorieTarget || 2000} kcal`}
            progressPercent={((nutrition?.caloriesConsumed || 1240) / (nutrition?.calorieTarget || 2000)) * 100}
            style={styles.statTileItem}
          />

          <StatTile
            label="Uống nước hôm nay"
            value={`${(nutrition?.waterConsumedMl || 1250).toLocaleString()} ml`}
            subtext={`mục tiêu ${nutrition?.waterTargetMl || 2000} ml`}
            progressPercent={((nutrition?.waterConsumedMl || 1250) / (nutrition?.waterTargetMl || 2000)) * 100}
            statusColor={theme.colors.water}
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
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  heroCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroBadge: {
    fontSize: 11,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  heroLevelBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  heroLevelText: {
    fontSize: 11,
    fontFamily: theme.fontFamilies.bold,
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: theme.spacing.lg,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 23,
  },
  heroButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamilies.bold,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  quickGridItem: {
    width: '31%',
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#221E3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickGridTitle: {
    fontSize: 13,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  quickGridSubtitle: {
    fontSize: 10,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
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
});
