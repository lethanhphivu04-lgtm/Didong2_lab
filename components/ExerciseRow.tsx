import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export interface ExerciseRowProps {
  title: string;
  subtitle: string;
  badgeText?: string; // e.g. "Video 2D/3D" or "Xem"
  thumbnailUri?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({
  title,
  subtitle,
  badgeText = 'Video 2D/3D',
  thumbnailUri,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${title}, ${subtitle}, ${badgeText}`}
    >
      <View style={styles.thumbnailContainer}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="barbell-outline" size={24} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {!!badgeText && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card, // 20px
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 72,
    shadowColor: '#221E3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 114, 78, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 114, 78, 0.12)',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary, // #F2F5F0
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary, // #A3AEA8
  },
  badgeContainer: {
    paddingLeft: theme.spacing.sm,
  },
  badgeText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.primary, // #C6F432
  },
});
