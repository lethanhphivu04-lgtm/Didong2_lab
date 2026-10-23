import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { strings } from '../../../constants/strings';

export default function CameraWorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reps, setReps] = useState(7);
  const targetReps = 12;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top half: Sample video */}
      <View style={styles.topHalf}>
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>
              Video mẫu · Squat 3D · 0.75x
            </Text>
          </View>
        </View>

        {/* Mockup skeleton of sample video */}
        <View style={styles.skeletonCenter}>
          <Ionicons name="body-outline" size={100} color="#68756F" />
        </View>

        {/* Video progress indicator line */}
        <View style={styles.dividerTrack}>
          <View style={[styles.dividerFill, { width: '60%' }]} />
        </View>
      </View>

      {/* Bottom half: Camera feed & realtime pose */}
      <View style={styles.bottomHalf}>
        <View style={styles.cameraTopRow}>
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>Camera trước</Text>
          </View>
          <View style={styles.kneeAngleBadge}>
            <Text style={styles.kneeAngleText}>Góc gối 92°</Text>
          </View>
        </View>

        {/* Mockup live pose overlay */}
        <View style={styles.skeletonCenter}>
          <Ionicons name="body" size={120} color={theme.colors.primary} />
        </View>

        {/* Floating feedback and rep count card */}
        <View style={styles.floatingFeedbackCard}>
          <View style={styles.feedbackLeft}>
            <Text style={styles.warningTag}>LƯNG HƠI CONG</Text>
            <Text style={styles.feedbackTip}>Mở ngực, nhìn thẳng phía trước</Text>
          </View>

          <TouchableOpacity
            style={styles.repsContainer}
            onPress={() => router.push('/workout/summary')}
            accessibilityRole="button"
            accessibilityLabel={`Đã tập ${reps} trên ${targetReps} lần. Bấm để kết thúc buổi tập`}
          >
            <Text style={styles.repCountText}>
              {reps}/{targetReps}
            </Text>
            <Text style={styles.repLabel}>{strings.cameraWorkout.repCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F0D',
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#121916',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  topBadgeText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  skeletonCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#242D29',
  },
  dividerFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#16221D',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cameraTopRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cameraBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cameraBadgeText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.semiBold,
  },
  kneeAngleBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  kneeAngleText: {
    color: '#0F1412',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
  },
  floatingFeedbackCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feedbackLeft: {
    flex: 1,
  },
  warningTag: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.warning, // #FFB454
    marginBottom: 4,
  },
  feedbackTip: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
  },
  repsContainer: {
    alignItems: 'center',
    paddingLeft: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  repCountText: {
    fontSize: 24,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  repLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
});
