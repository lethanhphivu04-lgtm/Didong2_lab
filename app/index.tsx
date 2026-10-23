import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { authService, profileService } from '../services';
import { theme } from '../theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function determineInitialRoute() {
      try {
        const isAuth = await authService.isAuthenticated();
        if (!isAuth) {
          router.replace('/(auth)/login');
          return;
        }

        const profile = await profileService.getProfile();
        if (!profile || !profile.onboardingCompleted) {
          const step = profile ? profile.onboardingStep : 1;
          switch (step) {
            case 2:
              router.replace('/(onboarding)/step2-goal');
              break;
            case 3:
              router.replace('/(onboarding)/step3-schedule');
              break;
            case 4:
              router.replace('/(onboarding)/step4-ai-plan');
              break;
            case 1:
            default:
              router.replace('/(onboarding)/step1-profile');
              break;
          }
          return;
        }

        // Đã hoàn tất onboarding -> vào thẳng tab Bài tập
        router.replace('/(tabs)/workout');
      } catch (e) {
        console.error('Error determining initial route:', e);
        router.replace('/(auth)/login');
      }
    }

    determineInitialRoute();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
