import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, Card, StepProgress } from '../../components';
import { planService, profileService } from '../../services';
import { Plan } from '../../types';

export default function Step4AiPlanScreen() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    const current = await planService.getPlan();
    setPlan(current);
  };

  const handleStartWeek1 = async () => {
    setLoading(true);
    await profileService.completeOnboarding();
    setLoading(false);
    router.replace('/(tabs)/workout');
  };

  const handleRegenerate = async () => {
    setLoading(true);
    const newPlan = await planService.regeneratePlan();
    setPlan(newPlan);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <StepProgress currentStep={4} totalSteps={4} />

        <Text style={styles.title}>{strings.onboarding.step4.title}</Text>
        <Text style={styles.subtitle}>
          {plan?.goalDescription || 'Giảm mỡ · 4 buổi/tuần · khoảng 2.000 kcal mỗi ngày'}
        </Text>

        {/* Schedule Day Cards */}
        {plan?.weeklySchedule.map((day, idx) => (
          <Card key={idx} style={styles.dayCard}>
            <View style={styles.dayCardHeader}>
              <Text style={styles.dayName}>{day.dayName}</Text>
              {day.durationMinutes && (
                <Text style={styles.durationText}>{day.durationMinutes} phút</Text>
              )}
            </View>
            <Text style={[styles.sessionTitle, day.isRest && styles.restTitle]}>
              {day.isRest ? 'Nghỉ' : day.sessionTitle}
            </Text>
          </Card>
        ))}

        <Text style={styles.disclaimer}>{strings.onboarding.step4.disclaimer}</Text>

        <Button
          title={strings.onboarding.step4.startWeek1}
          accessibilityLabel={strings.onboarding.step4.startWeek1}
          loading={loading}
          onPress={handleStartWeek1}
          style={styles.startButton}
        />

        <Button
          title={strings.onboarding.step4.regenerate}
          variant="secondary"
          accessibilityLabel={strings.onboarding.step4.regenerate}
          onPress={handleRegenerate}
          style={styles.regenButton}
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
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  dayCard: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayName: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  durationText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  sessionTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  restTitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamilies.regular,
  },
  disclaimer: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginVertical: theme.spacing.lg,
  },
  startButton: {
    marginBottom: theme.spacing.md,
  },
  regenButton: {
    marginBottom: theme.spacing.lg,
  },
});
