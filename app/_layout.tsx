import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import { theme } from '../theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'fade',
        }}
      >
        {/* Entry Router */}
        <Stack.Screen name="index" />

        {/* Auth Flow */}
        <Stack.Screen name="(auth)" />

        {/* Onboarding Flow */}
        <Stack.Screen name="(onboarding)" />

        {/* Main 4-Tab Flow */}
        <Stack.Screen name="(tabs)" />

        {/* Sub-screens (no bottom tab bar) */}
        <Stack.Screen
          name="workout/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="workout/cardio"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="workout/tips"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="workout/water"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="workout/summary"
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="exercise/[id]/video"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="exercise/[id]/camera-workout"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="exercise-library"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="nutrition/scan"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="profile/settings"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="profile/edit"
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
