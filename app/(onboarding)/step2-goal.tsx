import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, Card, TextField, StepProgress } from '../../components';
import { profileService } from '../../services';
import { GoalType } from '../../types';

interface GoalOption {
  type: GoalType;
  title: string;
  desc: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    type: 'fatLoss',
    title: strings.onboarding.step2.goals.fatLoss.title,
    desc: strings.onboarding.step2.goals.fatLoss.desc,
  },
  {
    type: 'muscleGain',
    title: strings.onboarding.step2.goals.muscleGain.title,
    desc: strings.onboarding.step2.goals.muscleGain.desc,
  },
  {
    type: 'stayFit',
    title: strings.onboarding.step2.goals.stayFit.title,
    desc: strings.onboarding.step2.goals.stayFit.desc,
  },
  {
    type: 'endurance',
    title: strings.onboarding.step2.goals.endurance.title,
    desc: strings.onboarding.step2.goals.endurance.desc,
  },
];

export default function Step2GoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('fatLoss');
  const [targetWeight, setTargetWeight] = useState('60');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function loadSaved() {
      const p = await profileService.getProfile();
      if (p?.goal) {
        setSelectedGoal(p.goal.type);
        setTargetWeight(p.goal.targetWeightKg.toString());
      }
    }
    loadSaved();
  }, []);

  const handleContinue = async () => {
    const parsedTarget = parseFloat(targetWeight);
    if (!targetWeight || isNaN(parsedTarget) || parsedTarget < 30 || parsedTarget > 250) {
      setError('Vui lòng nhập cân nặng mong muốn hợp lệ (30 - 250 kg)');
      return;
    }

    try {
      setLoading(true);
      await profileService.saveGoal({
        type: selectedGoal,
        targetWeightKg: parsedTarget,
      });
      setLoading(false);
      router.push('/(onboarding)/step3-schedule');
    } catch (e) {
      setLoading(false);
      Alert.alert(strings.common.error, 'Không thể lưu mục tiêu.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress currentStep={2} totalSteps={4} />

        <Text style={styles.title}>{strings.onboarding.step2.title}</Text>
        <Text style={styles.subtitle}>{strings.onboarding.step2.subtitle}</Text>

        {/* Goal selection cards */}
        {GOAL_OPTIONS.map((item) => {
          const isSelected = selectedGoal === item.type;
          return (
            <Card
              key={item.type}
              variant={isSelected ? 'selected' : 'default'}
              onPress={() => setSelectedGoal(item.type)}
              style={styles.goalCard}
              accessibilityLabel={`Mục tiêu ${item.title}: ${item.desc}`}
            >
              <Text style={styles.goalTitle}>{item.title}</Text>
              <Text style={styles.goalDesc}>{item.desc}</Text>
            </Card>
          );
        })}

        <TextField
          label={strings.onboarding.step2.targetWeight}
          value={targetWeight}
          onChangeText={(t) => {
            setTargetWeight(t);
            if (error) setError(undefined);
          }}
          keyboardType="numeric"
          containerStyle={styles.targetWeightInput}
          error={error}
        />

        <Button
          title={strings.common.continue}
          accessibilityLabel={strings.common.continue}
          loading={loading}
          onPress={handleContinue}
          style={styles.continueButton}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
  },
  goalCard: {
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  goalTitle: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  targetWeightInput: {
    marginTop: theme.spacing.md,
  },
  continueButton: {
    marginTop: theme.spacing.xl,
  },
});
