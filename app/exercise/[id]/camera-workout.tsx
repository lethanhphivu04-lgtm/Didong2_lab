import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { theme } from '../../../theme';
import { strings } from '../../../constants/strings';
import { Button } from '../../../components';
import { workoutService, poseAnalyzer } from '../../../services';
import { Exercise, PoseFeedback } from '../../../types';

export default function CameraWorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [feedback, setFeedback] = useState<PoseFeedback>({
    kneeAngleDegrees: 92,
    postureStatus: 'warning',
    warningMessage: 'LƯNG HƠI CONG',
    correctionTip: 'Mở ngực, nhìn thẳng phía trước',
    completedReps: 7,
    targetReps: 12,
  });

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    const e = await workoutService.getExerciseById(id || 'squat');
    setExercise(e);

    // Call pose analyzer service for initial mock feedback
    const fb = await poseAnalyzer.analyzeFrame('', id || 'squat');
    setFeedback(fb);
  };

  const sampleVideoUrl =
    exercise?.video3DUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

  const player = useVideoPlayer(sampleVideoUrl, (p) => {
    p.loop = true;
    p.playbackRate = 0.75; // Tốc độ mẫu chuẩn PDF: 0.75x
    p.play();
  });

  const handleFinish = () => {
    player.pause();
    router.push('/workout/summary');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* NỬA TRÊN: Video mẫu (expo-video) */}
      <View style={styles.topHalf}>
        <VideoView
          player={player}
          nativeControls={false}
          contentFit="cover"
          style={styles.sampleVideoSurface}
        />

        {/* Top header overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              player.pause();
              router.back();
            }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại video hướng dẫn"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>
              Video mẫu · {exercise?.name || 'Squat'} 3D · 0.75x
            </Text>
          </View>
        </View>

        {/* Progress divider line */}
        <View style={styles.dividerTrack}>
          <View style={[styles.dividerFill, { width: '55%' }]} />
        </View>
      </View>

      {/* NỬA DƯỚI: Camera trước & Khung xương AI */}
      <View style={styles.bottomHalf}>
        {permission && permission.granted ? (
          <CameraView
            facing="front"
            style={styles.cameraSurface}
          />
        ) : (
          <View style={styles.permissionFallbackContainer}>
            <Ionicons name="camera-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.permissionTitle}>
              {strings.cameraWorkout.permissionDeniedTitle}
            </Text>
            <Text style={styles.permissionMessage}>
              {strings.cameraWorkout.permissionDeniedMessage}
            </Text>
            <Button
              title={permission ? 'Cấp quyền Camera' : 'Đang kiểm tra...'}
              size="small"
              accessibilityLabel="Cấp quyền Camera"
              onPress={requestPermission}
              style={styles.permissionButton}
            />
          </View>
        )}

        {/* Camera Top Badges */}
        <View style={styles.cameraTopRow}>
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>
              {strings.cameraWorkout.frontCamera}
            </Text>
          </View>

          <View style={styles.kneeAngleBadge}>
            <Text style={styles.kneeAngleText}>
              Góc gối {feedback.kneeAngleDegrees || 92}°
            </Text>
          </View>
        </View>

        {/* Live Neon Pose Skeleton Overlay */}
        <View style={styles.liveSkeletonOverlay} pointerEvents="none">
          <View style={styles.neonHead} />
          <View style={styles.neonNeck} />
          <View style={styles.neonTorso} />
          <View style={styles.neonArmLeft} />
          <View style={styles.neonArmRight} />
          <View style={styles.neonJointHip} />
          <View style={styles.neonLegLeft} />
          <View style={styles.neonLegRight} />
        </View>

        {/* Floating feedback and rep count card */}
        <View style={styles.floatingFeedbackCard}>
          <View style={styles.feedbackLeft}>
            <Text style={styles.warningTag}>{feedback.warningMessage}</Text>
            <Text style={styles.feedbackTip}>{feedback.correctionTip}</Text>
          </View>

          <TouchableOpacity
            style={styles.repsContainer}
            onPress={handleFinish}
            accessibilityRole="button"
            accessibilityLabel={`Số lần: ${feedback.completedReps} trên ${feedback.targetReps}. Nhấn để hoàn thành`}
          >
            <Text style={styles.repCountText}>
              {feedback.completedReps}/{feedback.targetReps}
            </Text>
            <Text style={styles.repLabel}>{strings.cameraWorkout.repCount}</Text>
            <View style={styles.finishMiniBtn}>
              <Text style={styles.finishMiniText}>Hoàn tất ›</Text>
            </View>
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
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sampleVideoSurface: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  headerOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  topBadgeText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  dividerTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#242D29',
    zIndex: 10,
  },
  dividerFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#16221D',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraSurface: {
    ...StyleSheet.absoluteFill,
  },
  permissionFallbackContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#16221D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  permissionButton: {
    minWidth: 160,
  },
  cameraTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cameraBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
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
  liveSkeletonOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  neonHead: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(198,244,50,0.2)',
  },
  neonNeck: {
    width: 4,
    height: 8,
    backgroundColor: theme.colors.primary,
  },
  neonTorso: {
    width: 4,
    height: 50,
    backgroundColor: theme.colors.primary,
  },
  neonArmLeft: {
    position: 'absolute',
    top: 48,
    left: -24,
    width: 32,
    height: 4,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '35deg' }],
  },
  neonArmRight: {
    position: 'absolute',
    top: 48,
    right: -24,
    width: 32,
    height: 4,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '-35deg' }],
  },
  neonJointHip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  neonLegLeft: {
    position: 'absolute',
    top: 105,
    left: -18,
    width: 28,
    height: 45,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: theme.colors.primary,
  },
  neonLegRight: {
    position: 'absolute',
    top: 105,
    right: -18,
    width: 28,
    height: 45,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: theme.colors.primary,
  },
  floatingFeedbackCard: {
    position: 'absolute',
    bottom: 20,
    left: 14,
    right: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  feedbackLeft: {
    flex: 1,
  },
  warningTag: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.warning,
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
  finishMiniBtn: {
    marginTop: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  finishMiniText: {
    fontSize: 10,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textOnPrimary,
  },
});
