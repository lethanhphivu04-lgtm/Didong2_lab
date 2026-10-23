import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#0f172a',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: '404 - Không tìm thấy',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
