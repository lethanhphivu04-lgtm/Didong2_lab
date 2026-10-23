import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  StyleProp,
} from 'react-native';
import { theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'normal' | 'small';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel: string; // Yêu cầu tiếp cận chuẩn accessibility
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'normal',
  loading = false,
  disabled = false,
  icon,
  accessibilityLabel,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';
  const isSmall = size === 'small';

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    isSmall ? styles.smallContainer : styles.normalContainer,
    isPrimary && styles.primaryContainer,
    isSecondary && styles.secondaryContainer,
    isOutline && styles.outlineContainer,
    isGhost && styles.ghostContainer,
    isDanger && styles.dangerContainer,
    (disabled || loading) && styles.disabledContainer,
    style,
  ];

  const labelStyle: StyleProp<TextStyle> = [
    styles.baseText,
    isSmall ? styles.smallText : styles.normalText,
    isPrimary && styles.primaryText,
    isSecondary && styles.secondaryText,
    isOutline && styles.outlineText,
    isGhost && styles.ghostText,
    isDanger && styles.dangerText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? theme.colors.textOnPrimary : theme.colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={labelStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.button, // 26px
    minHeight: theme.minTapTarget,   // Tối thiểu 44px
    gap: 8,
  },
  normalContainer: {
    height: theme.buttonHeight,      // Chuẩn 52px
    paddingHorizontal: 24,
  },
  smallContainer: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary, // #C6F432
  },
  secondaryContainer: {
    backgroundColor: theme.colors.surface, // #1A211E
    borderWidth: 1,
    borderColor: theme.colors.border,      // #3A4640
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  baseText: {
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    textAlign: 'center',
  },
  normalText: {
    fontSize: theme.typography.sizes.base,
  },
  smallText: {
    fontSize: theme.typography.sizes.sm,
  },
  primaryText: {
    color: theme.colors.textOnPrimary, // #0F1412
  },
  secondaryText: {
    color: theme.colors.textPrimary,   // #F2F5F0
  },
  outlineText: {
    color: theme.colors.textPrimary,
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  dangerText: {
    color: theme.colors.danger,
  },
  disabledText: {
    opacity: 0.8,
  },
});
