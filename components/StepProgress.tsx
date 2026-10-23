import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

export interface StepProgressProps {
  currentStep: number; // 1 to 4
  totalSteps?: number; // default 4
  style?: ViewStyle;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps = 4,
  style,
}) => {
  const progressPercent = Math.min(Math.max(currentStep / totalSteps, 0), 1) * 100;

  return (
    <View style={[styles.container, style]} accessibilityLabel={`Tiến trình: Bước ${currentStep} trên ${totalSteps}`}>
      <Text style={styles.stepText}>
        Bước {currentStep}/{totalSteps}
      </Text>
      
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
  stepText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary, // #A3AEA8
    fontFamily: theme.fontFamilies.semiBold,
    marginBottom: theme.spacing.sm,
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: '#242D29',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.primary, // #C6F432
    borderRadius: 2,
  },
});
