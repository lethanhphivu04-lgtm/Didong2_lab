import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
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
  const [viewMode, setViewMode] = useState<'3d_video' | 'camera'>('3d_video');
  const [feedback, setFeedback] = useState<PoseFeedback>({
    kneeAngleDegrees: 92,
    postureStatus: 'good',
    warningMessage: 'TƯ THẾ CHUẨN',
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

    const fb = await poseAnalyzer.analyzeFrame('', id || 'squat');
    setFeedback(fb);
  };

  // Dynamic squat cycle simulation: angle smoothly cycles 160 -> 90 -> 160 and increments reps
  useEffect(() => {
    let angle = 160;
    let goingDown = true;
    let currentRep = 7;

    const interval = setInterval(() => {
      if (goingDown) {
        angle -= 7;
        if (angle <= 90) {
          angle = 90;
          goingDown = false;
        }
      } else {
        angle += 7;
        if (angle >= 162) {
          angle = 162;
          goingDown = true;
          currentRep = currentRep < 12 ? currentRep + 1 : 12;
        }
      }

      const isDeep = angle <= 95;
      const isMid = angle > 95 && angle < 135;

      setFeedback((prev) => ({
        ...prev,
        kneeAngleDegrees: angle,
        completedReps: currentRep,
        postureStatus: isDeep ? 'good' : isMid ? 'warning' : 'good',
        warningMessage: isDeep
          ? 'TƯ THẾ CHUẨN'
          : isMid
          ? 'LƯNG HƠI CONG'
          : 'DUY TRÌ NHỊP ĐỘ',
        correctionTip: isDeep
          ? 'Góc chuẩn 90°, đẩy gót siết mông khi đứng dậy'
          : isMid
          ? 'Mở ngực, nhìn thẳng phía trước'
          : 'Hạ hông có kiểm soát như ngồi ghế',
      }));
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const sampleVideoUrl =
    exercise?.video3DUrl ||
    'https://raw.githubusercontent.com/samarthify/AI-Fitness-Trainer/main/squats.mp4';

  const player = useVideoPlayer(sampleVideoUrl, (p) => {
    p.loop = true;
    p.playbackRate = 0.75; // Tốc độ mẫu chuẩn PDF: 0.75x
    p.play();
  });

  const handleFinish = () => {
    player.pause();
    router.push('/workout/summary');
  };

  const animation3DSource =
    exercise?.animation3DUrl ||
    'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0514.gif';

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

      {/* NỬA DƯỚI: Chế độ Video 3D Chuyên nghiệp hoặc Camera */}
      <View style={styles.bottomHalf}>
        {viewMode === '3d_video' ? (
          // Hiển thị trực tiếp Video / Animation 3D của bài tập thay vì khung xương thô
          <View style={styles.video3DContainer}>
            <Image
              source={{ uri: animation3DSource }}
              style={styles.animation3DImage}
              resizeMode="contain"
            />

            {/* Vòng tròn đo góc chuyển động sinh học (Biomechanical HUD) */}
            <View style={styles.hudOverlay}>
              <View style={styles.hudCircle}>
                <Ionicons name="scan-outline" size={32} color={theme.colors.primary} />
                <Text style={styles.hudAngleValue}>{feedback.kneeAngleDegrees}°</Text>
              </View>
            </View>
          </View>
        ) : permission && permission.granted ? (
          <CameraView facing="front" style={styles.cameraSurface} />
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

        {/* Nút chuyển đổi chế độ Video 3D / Camera */}
        <View style={styles.modeToggleRow}>
          <TouchableOpacity
            style={[
              styles.modeTabButton,
              viewMode === '3d_video' && styles.modeTabButtonActive,
            ]}
            onPress={() => setViewMode('3d_video')}
            accessibilityRole="button"
            accessibilityLabel="Xem Video 3D mô phỏng"
          >
            <Ionicons
              name="cube"
              size={14}
              color={viewMode === '3d_video' ? '#0F1412' : '#fff'}
            />
            <Text
              style={[
                styles.modeTabText,
                viewMode === '3d_video' && styles.modeTabTextActive,
              ]}
            >
              Video 3D
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabButton,
              viewMode === 'camera' && styles.modeTabButtonActive,
            ]}
            onPress={() => setViewMode('camera')}
            accessibilityRole="button"
            accessibilityLabel="Bật Camera trước"
          >
            <Ionicons
              name="camera"
              size={14}
              color={viewMode === 'camera' ? '#0F1412' : '#fff'}
            />
            <Text
              style={[
                styles.modeTabText,
                viewMode === 'camera' && styles.modeTabTextActive,
              ]}
            >
              Camera
            </Text>
          </TouchableOpacity>
        </View>

        {/* Camera/3D Top Badges */}
        <View style={styles.cameraTopRow}>
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>
              {viewMode === '3d_video' ? 'Mô hình 3D AI' : strings.cameraWorkout.frontCamera}
            </Text>
          </View>

          <View
            style={[
              styles.kneeAngleBadge,
              feedback.postureStatus === 'warning' && styles.kneeAngleBadgeWarning,
            ]}
          >
            <Text style={styles.kneeAngleText}>
              Góc gối {feedback.kneeAngleDegrees}°
            </Text>
          </View>
        </View>

        {/* Floating feedback and rep count card */}
        <View style={styles.floatingFeedbackCard}>
          <View style={styles.feedbackLeft}>
            <Text
              style={[
                styles.warningTag,
                feedback.postureStatus === 'good' && styles.goodTag,
              ]}
            >
              {feedback.warningMessage}
            </Text>
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
  kneeAngleBadgeWarning: {
    backgroundColor: theme.colors.warning,
  },
  kneeAngleText: {
    color: '#0F1412',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
  },
  video3DContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F1613',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation3DImage: {
    width: '100%',
    height: '82%',
    marginTop: 20,
  },
  hudOverlay: {
    position: 'absolute',
    top: 55,
    right: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  hudAngleValue: {
    color: theme.colors.primary,
    fontSize: 11,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    marginTop: 2,
  },
  modeToggleRow: {
    position: 'absolute',
    top: 14,
    left: '50%',
    transform: [{ translateX: -80 }],
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 3,
    zIndex: 15,
  },
  modeTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 13,
  },
  modeTabButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeTabText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: theme.fontFamilies.semiBold,
  },
  modeTabTextActive: {
    color: '#0F1412',
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
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
  goodTag: {
    color: theme.colors.primary,
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
