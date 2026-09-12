import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0a7ea4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Expo Router Notation' }} />
      <Stack.Screen name="about" options={{ title: 'Static Route: About' }} />
      <Stack.Screen name="users/[userId]" options={{ title: 'Dynamic Route: User' }} />
      <Stack.Screen name="(home)/feed" options={{ title: 'Route Group: Feed' }} />
      <Stack.Screen name="+not-found" options={{ title: '404 - Not Found' }} />
    </Stack>
  );
}

