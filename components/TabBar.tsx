import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export interface TabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
  };
  descriptors: Record<string, {
    options: {
      title?: string;
      tabBarButtonTestID?: string;
      [key: string]: any;
    };
  }>;
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string, params?: any) => void;
  };
}

interface TabItemConfig {
  name: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameActive: keyof typeof Ionicons.glyphMap;
}

const TAB_CONFIGS: Record<string, TabItemConfig> = {
  workout: {
    name: 'workout',
    label: 'Bài tập',
    iconName: 'barbell-outline',
    iconNameActive: 'barbell',
  },
  nutrition: {
    name: 'nutrition',
    label: 'Dinh dưỡng',
    iconName: 'restaurant-outline',
    iconNameActive: 'restaurant',
  },
  progress: {
    name: 'progress',
    label: 'Tiến độ',
    iconName: 'stats-chart-outline',
    iconNameActive: 'stats-chart',
  },
  profile: {
    name: 'profile',
    label: 'Hồ sơ',
    iconName: 'person-outline',
    iconNameActive: 'person',
  },
};

export const TabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
      accessibilityRole="tablist"
    >
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const options = descriptor ? descriptor.options : {};
        const isFocused = state.index === index;
        const config = TAB_CONFIGS[route.name] || {
          name: route.name,
          label: options.title || route.name,
          iconName: 'ellipse-outline',
          iconNameActive: 'ellipse',
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? theme.colors.primary : theme.colors.textSecondary;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? config.iconNameActive : config.iconName}
              size={22}
              color={color}
              style={styles.icon}
            />
            <Text
              style={[
                styles.tabLabel,
                { color },
                isFocused && styles.tabLabelActive,
              ]}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
    minHeight: 64,
    shadowColor: '#221E3A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Vùng bấm tối thiểu
    paddingVertical: 4,
  },
  icon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamilies.regular,
  },
  tabLabelActive: {
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
  },
});
