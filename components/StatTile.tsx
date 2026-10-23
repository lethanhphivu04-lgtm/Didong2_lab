import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

export interface StatTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  unit?: string;
  statusBadge?: string;
  statusColor?: string;
  progressPercent?: number; // 0 - 100 (renders a small progress bar)
  style?: ViewStyle;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subtext,
  unit,
  statusBadge,
  statusColor = theme.colors.success,
  progressPercent,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {!!statusBadge && (
          <Text style={[styles.statusBadge, { color: statusColor }]}>
            {statusBadge}
          </Text>
        )}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {!!unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      {progressPercent !== undefined && (
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(progressPercent, 0), 100)}%` },
            ]}
          />
        </View>
      )}

      {!!subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface, // #1A211E
    borderRadius: theme.radii.card,        // 16px
    borderWidth: 1,
    borderColor: theme.colors.border,      // #3A4640
    padding: theme.spacing.lg,             // 16px
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,     // #A3AEA8
  },
  statusBadge: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,       // #F2F5F0
  },
  unit: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#242D29',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary, // #C6F432
    borderRadius: 2,
  },
  subtext: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,     // #A3AEA8
    marginTop: 2,
  },
});
