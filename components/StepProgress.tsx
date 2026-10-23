import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export interface StepProgressProps {
  currentStep: number; // 1 to 4
  totalSteps?: number; // default 4
  showBack?: boolean;
  onBack?: () => void;
  style?: ViewStyle;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps = 4,
  showBack,
  onBack,
  style,
}) => {
  const router = useRouter();
  const shouldShowBack = showBack ?? (currentStep > 1 || !!onBack);
  const progressPercent = Math.min(Math.max(currentStep / totalSteps, 0), 1) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={[styles.container, style]} accessibilityLabel={`Tiến trình: Bước ${currentStep} trên ${totalSteps}`}>
      <View style={styles.topRow}>
        {shouldShowBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Quay lại bước trước"
          >
            <Ionicons name="arrow-back" size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        <Text style={styles.stepText}>
          Bước {currentStep}/{totalSteps}
        </Text>
      </View>
      
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  stepText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary, // #A3AEA8
    fontFamily: theme.fontFamilies.semiBold,
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.primary, // #C6F432
    borderRadius: 2,
  },
});
