import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suffix?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  suffix,
  containerStyle,
  inputStyle,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder || 'Ô nhập liệu'}
          {...rest}
        />

        {suffix && <Text style={styles.suffix}>{suffix}</Text>}

        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconButton}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {!isPassword && rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary, // #A3AEA8
    fontFamily: theme.fontFamilies.regular,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, // #1A211E
    borderWidth: 1,
    borderColor: theme.colors.border,      // #3A4640
    borderRadius: theme.radii.input,       // 14px
    height: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  inputFocused: {
    borderColor: theme.colors.primary,     // #C6F432
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.textPrimary,       // #F2F5F0
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
  },
  leftIconContainer: {
    marginRight: theme.spacing.sm,
  },
  rightIconContainer: {
    marginLeft: theme.spacing.sm,
  },
  rightIconButton: {
    padding: theme.spacing.xs,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffix: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamilies.semiBold,
    marginLeft: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
    fontFamily: theme.fontFamilies.regular,
  },
});
