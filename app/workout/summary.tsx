import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button, StatTile } from '../../components';

export default function WorkoutSummaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>{strings.workout.workoutCompleted}</Text>

        {/* 4 Big Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <StatTile
              label={strings.workout.durationLabel}
              value="26 phút"
              style={styles.metricTile}
            />
            <StatTile
              label={strings.workout.caloriesBurnedLabel}
              value="195 kcal"
              style={styles.metricTile}
            />
          </View>
          <View style={styles.metricRow}>
            <StatTile
              label={strings.workout.totalRepsLabel}
              value="108"
              style={styles.metricTile}
            />
            <StatTile
              label={strings.workout.postureScoreLabel}
              value="86/100"
              style={styles.metricTile}
            />
          </View>
        </View>

        {/* Posture Score Per Exercise */}
        <Text style={styles.sectionTitle}>
          {strings.workout.postureScorePerExercise}
        </Text>

        <Card style={styles.scoreRowCard}>
          <Text style={styles.exerciseName}>Squat</Text>
          <Text style={styles.scoreValue}>88</Text>
        </Card>

        <Card style={styles.scoreRowCard}>
          <Text style={styles.exerciseName}>Plank</Text>
          <Text style={styles.scoreValue}>90</Text>
        </Card>

        <Card style={styles.scoreRowCard}>
          <Text style={styles.exerciseName}>Lunge</Text>
          <Text style={styles.scoreValue}>80</Text>
        </Card>

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
          onPress={() => {}}
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
