import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme';

export interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  icon,
  onPress,
  accessibilityLabel,
  style,
  textStyle,
  ...rest
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.unselectedContainer,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ selected }}
      {...rest}
    >
      {icon}
      <Text
        style={[
          styles.text,
          selected ? styles.selectedText : styles.unselectedText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40,
    minHeight: 40,
    borderRadius: theme.radii.chip, // 20px
    borderWidth: 1,
    gap: 6,
  },
  selectedContainer: {
    backgroundColor: theme.colors.primary, // #C6F432
    borderColor: theme.colors.primary,
  },
  unselectedContainer: {
    backgroundColor: theme.colors.surface, // #1A211E
    borderColor: theme.colors.border,      // #3A4640
  },
  text: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    fontWeight: '600',
  },
  selectedText: {
    color: theme.colors.textOnPrimary, // #0F1412
  },
  unselectedText: {
    color: theme.colors.textPrimary,   // #F2F5F0
  },
});
