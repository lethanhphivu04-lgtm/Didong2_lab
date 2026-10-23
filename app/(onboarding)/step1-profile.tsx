import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField, Chip, StepProgress, StatTile } from '../../components';
import { Gender } from '../../types';

export default function Step1ProfileScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('21');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');

  // Realtime BMI calculation
  const heightM = parseFloat(height) / 100;
  const weightKg = parseFloat(weight);
  const bmiValue =
    heightM > 0 && weightKg > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '22.5';

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Gầy';
    if (bmi < 24.9) return 'Bình thường';
    if (bmi < 29.9) return 'Thừa cân';
    return 'Béo phì';
  };

  const bmiCategory = getBmiCategory(parseFloat(bmiValue));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <StepProgress currentStep={1} totalSteps={4} />

        <Text style={styles.title}>{strings.onboarding.step1.title}</Text>
        <Text style={styles.subtitle}>{strings.onboarding.step1.subtitle}</Text>

        {/* Gender Chips */}
        <View style={styles.chipsRow}>
          <Chip
            label={strings.onboarding.step1.gender.male}
            selected={gender === 'male'}
            onPress={() => setGender('male')}
          />
          <Chip
            label={strings.onboarding.step1.gender.female}
            selected={gender === 'female'}
            onPress={() => setGender('female')}
          />
          <Chip
            label={strings.onboarding.step1.gender.other}
            selected={gender === 'other'}
            onPress={() => setGender('other')}
          />
        </View>

        {/* Physical measurements */}
        <TextField
          label={strings.onboarding.step1.age}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextField
          label={strings.onboarding.step1.height}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <TextField
          label={strings.onboarding.step1.weight}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        {/* BMI Card */}
        <StatTile
          label={strings.onboarding.step1.bmi}
          value={bmiValue.replace('.', ',')}
          statusBadge={bmiCategory}
          statusColor={theme.colors.success}
          style={styles.bmiCard}
        />

        <Button
          title={strings.common.continue}
          accessibilityLabel={strings.common.continue}
          onPress={() => router.push('/(onboarding)/step2-goal')}
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
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  bmiCard: {
    marginVertical: theme.spacing.lg,
  },
  continueButton: {
    marginTop: theme.spacing.xl,
  },
});
