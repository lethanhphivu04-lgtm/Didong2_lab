import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { strings } from '../../../constants/strings';
import { Header, Card, Button, Chip } from '../../../components';
import { workoutService } from '../../../services';
import { Exercise } from '../../../types';

export default function ExerciseVideoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [mode3D, setMode3D] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [loop, setLoop] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    const e = await workoutService.getExerciseById(id || 'squat');
    setExercise(e);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* Video Player Box Mockup Container */}
        <View style={styles.videoPlayerContainer}>
          {/* Top badges over video */}
          <View style={styles.videoTopBar}>
            <View style={styles.videoBadge}>
              <Text style={styles.videoBadgeText}>
                {exercise?.name || 'Squat'} · {mode3D ? '3D' : '2D'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.pipBadge}
              accessibilityRole="button"
              accessibilityLabel="Picture in Picture"
            >
              <Text style={styles.pipText}>PiP</Text>
            </TouchableOpacity>
          </View>

          {/* Center Play Button */}
          <TouchableOpacity
            style={styles.centerPlayButton}
            onPress={() => setIsPlaying(!isPlaying)}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Tạm dừng video' : 'Phát video'}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color={theme.colors.textOnPrimary}
            />
          </TouchableOpacity>

          {/* Timeline Bar */}
          <View style={styles.timelineContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <View style={styles.timeLabelsRow}>
              <Text style={styles.timeText}>0:12</Text>
              <Text style={styles.timeText}>0:30</Text>
            </View>
          </View>
        </View>

        {/* Exercise Title */}
        <Text style={styles.exerciseTitle}>{exercise?.name || 'Squat'}</Text>

        {/* 2D / 3D Segmented Toggle */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, !mode3D && styles.segmentButtonActive]}
            onPress={() => setMode3D(false)}
            accessibilityRole="button"
            accessibilityLabel="Chế độ xem video 2D"
          >
            <Text style={[styles.segmentText, !mode3D && styles.segmentTextActive]}>
              2D
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, mode3D && styles.segmentButtonActive]}
            onPress={() => setMode3D(true)}
            accessibilityRole="button"
            accessibilityLabel="Chế độ xem mô hình 3D"
          >
            <Text style={[styles.segmentText, mode3D && styles.segmentTextActive]}>
              3D
            </Text>
          </TouchableOpacity>
        </View>

        {/* Speed & Loop Controls */}
        <View style={styles.controlsRow}>
          <Text style={styles.controlLabel}>{strings.videoPlayer.speed}</Text>
          <View style={styles.speedChips}>
            {[0.5, 0.75, 1].map((s) => (
              <Chip
                key={s}
                label={`${s}x`}
                selected={speed === s}
                onPress={() => setSpeed(s)}
                style={styles.speedChip}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setLoop(!loop)}
            style={styles.loopToggle}
            accessibilityRole="button"
            accessibilityLabel="Bật tắt lặp video"
          >
            <Text style={styles.loopText}>
              {loop ? strings.videoPlayer.loopOn : strings.videoPlayer.loopOff}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <Text style={styles.instructionsTitle}>
          {strings.videoPlayer.instructions}
        </Text>

        {exercise?.steps.map((step, idx) => (
          <Card key={idx} style={styles.stepCard}>
            <Text style={styles.stepText}>{step}</Text>
          </Card>
        ))}

        {/* Bottom CTA: Train with camera */}
        <Button
          title={strings.videoPlayer.trainWithCamera}
          accessibilityLabel={strings.videoPlayer.trainWithCamera}
          onPress={() => router.push(`/exercise/${exercise?.id || 'squat'}/camera-workout`)}
          style={styles.cameraButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxxl,
  },
  videoPlayerContainer: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: '#16221D',
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  videoTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  pipBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pipText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  centerPlayButton: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContainer: {
    width: '100%',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#3A4640',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  exerciseTitle: {
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  segmentButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.textPrimary,
  },
  segmentTextActive: {
    color: theme.colors.textOnPrimary,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  controlLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginRight: 10,
  },
  speedChips: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  speedChip: {
    height: 34,
    minHeight: 34,
    paddingHorizontal: 10,
  },
  loopToggle: {
    padding: 6,
  },
  loopText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textSecondary,
  },
  instructionsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  stepCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stepText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  cameraButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
});
