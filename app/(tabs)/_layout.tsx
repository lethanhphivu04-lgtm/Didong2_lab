import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components';
import { theme } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Bài tập',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Dinh dưỡng',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Tiến độ',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
        }}
      />
    </Tabs>
  );
}
