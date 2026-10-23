import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme';

export type CardVariant = 'default' | 'hero' | 'selected' | 'transparent';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  accessibilityLabel,
  ...rest
}) => {
  const isHero = variant === 'hero';
  const isSelected = variant === 'selected';
  const isTransparent = variant === 'transparent';

  const containerStyles: StyleProp<ViewStyle> = [
    styles.base,
    isHero && styles.hero,
    isSelected && styles.selected,
    isTransparent && styles.transparent,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={containerStyles}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyles} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card, // 20px
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    shadowColor: '#221E3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  hero: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  selected: {
    backgroundColor: '#FFF7F4',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
