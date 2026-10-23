import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, Chip, StepProgress } from '../../components';
import { FitnessLevel, EquipmentType } from '../../types';

export default function Step3ScheduleScreen() {
  const router = useRouter();
  const [level, setLevel] = useState<FitnessLevel>('beginner');
  const [sessions, setSessions] = useState<number>(4);
  const [duration, setDuration] = useState<number>(45);
  const [equipment, setEquipment] = useState<EquipmentType>('none');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <StepProgress currentStep={3} totalSteps={4} />

        <Text style={styles.title}>{strings.onboarding.step3.title}</Text>

        {/* Level */}
        <Text style={styles.sectionTitle}>{strings.onboarding.step3.levels.title}</Text>
        <View style={styles.chipsRow}>
          <Chip
            label={strings.onboarding.step3.levels.beginner}
            selected={level === 'beginner'}
            onPress={() => setLevel('beginner')}
          />
          <Chip
            label={strings.onboarding.step3.levels.intermediate}
            selected={level === 'intermediate'}
            onPress={() => setLevel('intermediate')}
          />
          <Chip
            label={strings.onboarding.step3.levels.advanced}
            selected={level === 'advanced'}
            onPress={() => setLevel('advanced')}
          />
        </View>

        {/* Sessions per week */}
        <Text style={styles.sectionTitle}>
          {strings.onboarding.step3.sessionsPerWeek.title}
        </Text>
        <View style={styles.chipsRow}>
          {[2, 3, 4, 5, 6].map((num) => (
            <Chip
              key={num}
              label={num.toString()}
              selected={sessions === num}
              onPress={() => setSessions(num)}
            />
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.sectionTitle}>
          {strings.onboarding.step3.duration.title}
        </Text>
        <View style={styles.chipsRow}>
          {[30, 45, 60].map((mins) => (
            <Chip
              key={mins}
              label={`${mins} phút`}
              selected={duration === mins}
              onPress={() => setDuration(mins)}
            />
          ))}
        </View>

        {/* Equipment */}
        <Text style={styles.sectionTitle}>
          {strings.onboarding.step3.equipment.title}
        </Text>
        <View style={styles.chipsRow}>
          <Chip
            label={strings.onboarding.step3.equipment.none}
            selected={equipment === 'none'}
            onPress={() => setEquipment('none')}
          />
          <Chip
            label={strings.onboarding.step3.equipment.dumbbell}
            selected={equipment === 'dumbbell'}
            onPress={() => setEquipment('dumbbell')}
          />
          <Chip
            label={strings.onboarding.step3.equipment.gym}
            selected={equipment === 'gym'}
            onPress={() => setEquipment('gym')}
          />
        </View>

        <Button
          title={strings.onboarding.step3.generateButton}
          accessibilityLabel={strings.onboarding.step3.generateButton}
          onPress={() => router.push('/(onboarding)/step4-ai-plan')}
          style={styles.generateButton}
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  generateButton: {
    marginTop: theme.spacing.xl,
  },
});
