import { Stack } from 'expo-router';
import { theme } from '../../theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="step1-profile" />
      <Stack.Screen name="step2-goal" />
      <Stack.Screen name="step3-schedule" />
      <Stack.Screen name="step4-ai-plan" />
    </Stack>
  );
}
