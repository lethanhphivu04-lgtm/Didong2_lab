import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, TextField, Chip, StepProgress, StatTile } from '../../components';
import { profileService } from '../../services';
import { Gender } from '../../types';

export default function Step1ProfileScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('21');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ age?: string; height?: string; weight?: string }>({});

  useEffect(() => {
    async function loadSaved() {
      const p = await profileService.getProfile();
      if (p?.physical) {
        setGender(p.physical.gender);
        setAge(p.physical.age.toString());
        setHeight(p.physical.heightCm.toString());
        setWeight(p.physical.weightKg.toString());
      }
    }
    loadSaved();
  }, []);

  // Realtime BMI calculation
  const heightM = parseFloat(height) / 100;
  const weightKg = parseFloat(weight);
  const bmiNumber =
    heightM > 0 && weightKg > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 22.5;
  const bmiFormatted = bmiNumber.toFixed(1).replace('.', ',');

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Gầy', color: theme.colors.warning };
    if (bmi < 25) return { label: 'Bình thường', color: theme.colors.success };
    if (bmi < 30) return { label: 'Thừa cân', color: theme.colors.warning };
    return { label: 'Béo phì', color: theme.colors.danger };
  };

  const bmiStatus = getBmiCategory(bmiNumber);

  const validate = () => {
    const newErrors: typeof errors = {};
    const parsedAge = parseInt(age);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (!age || isNaN(parsedAge) || parsedAge < 10 || parsedAge > 100) {
      newErrors.age = 'Vui lòng nhập tuổi hợp lệ (10 - 100)';
    }

    if (!height || isNaN(parsedHeight) || parsedHeight < 100 || parsedHeight > 250) {
      newErrors.height = 'Vui lòng nhập chiều cao hợp lệ (100 - 250 cm)';
    }

    if (!weight || isNaN(parsedWeight) || parsedWeight < 30 || parsedWeight > 250) {
      newErrors.weight = 'Vui lòng nhập cân nặng hợp lệ (30 - 250 kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await profileService.savePhysicalProfile({
        gender,
        age: parseInt(age),
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        bmi: bmiNumber,
        bmiCategory: bmiStatus.label,
      });
      setLoading(false);
      router.push('/(onboarding)/step2-goal');
    } catch (e) {
      setLoading(false);
      Alert.alert(strings.common.error, 'Không thể lưu hồ sơ thể chất.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress
          currentStep={1}
          totalSteps={4}
          showBack
          onBack={() => router.replace('/(auth)/login')}
        />

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
          onChangeText={(t) => {
            setAge(t);
            if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
          }}
          keyboardType="numeric"
          error={errors.age}
        />

        <TextField
          label={strings.onboarding.step1.height}
          value={height}
          onChangeText={(t) => {
            setHeight(t);
            if (errors.height) setErrors((prev) => ({ ...prev, height: undefined }));
          }}
          keyboardType="numeric"
          error={errors.height}
        />

        <TextField
          label={strings.onboarding.step1.weight}
          value={weight}
          onChangeText={(t) => {
            setWeight(t);
            if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
          }}
          keyboardType="numeric"
          error={errors.weight}
        />

        {/* BMI Card */}
        <StatTile
          label={strings.onboarding.step1.bmi}
          value={bmiFormatted}
          statusBadge={bmiStatus.label}
          statusColor={bmiStatus.color}
          style={styles.bmiCard}
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
