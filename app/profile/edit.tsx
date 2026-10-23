import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Header, TextField, Button } from '../../components';
import { profileService } from '../../services';
import { Profile } from '../../types';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('ban@email.com');
  const [age, setAge] = useState('21');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [goal, setGoal] = useState('Giảm mỡ');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await profileService.getProfile();
    if (p) {
      setProfile(p);
      setFullName(p.user.fullName);
      setEmail(p.user.email);
      setAge(p.physical.age.toString());
      setHeight(p.physical.heightCm.toString());
      setWeight(p.physical.weightKg.toString());
      setGoal(
        p.goal.type === 'fatLoss'
          ? 'Giảm mỡ'
          : p.goal.type === 'muscleGain'
          ? 'Tăng cơ'
          : p.goal.type === 'stayFit'
          ? 'Giữ dáng'
          : 'Tăng sức bền'
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await profileService.updateProfile({
      user: {
        ...(profile?.user || { id: 'user_1', createdAt: '' }),
        fullName,
        email,
      },
      physical: {
        ...(profile?.physical || {
          gender: 'male',
          bmi: 22.5,
          bmiCategory: 'Bình thường',
        }),
        age: parseInt(age) || 21,
        heightCm: parseFloat(height) || 170,
        weightKg: parseFloat(weight) || 65,
      },
    });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header title="Sửa thông tin" />

        <TextField
          label={strings.auth.fullName}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextField
          label={strings.auth.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

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

        <TextField
          label="Mục tiêu"
          value={goal}
          onChangeText={setGoal}
        />

        <Button
          title={strings.common.save}
          accessibilityLabel={strings.common.save}
          loading={loading}
          onPress={handleSave}
          style={styles.saveButton}
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
  saveButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
