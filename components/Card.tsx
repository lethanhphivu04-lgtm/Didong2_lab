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
    backgroundColor: theme.colors.surface, // #1A211E
    borderRadius: theme.radii.card,        // 16px
    borderWidth: 1,
    borderColor: theme.colors.border,      // #3A4640
    padding: theme.spacing.lg,             // 16px
  },
  hero: {
    backgroundColor: theme.colors.primary, // #C6F432
    borderColor: theme.colors.primary,
  },
  selected: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
});
