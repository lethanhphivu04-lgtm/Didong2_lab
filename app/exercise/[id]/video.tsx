import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { theme } from '../../../theme';
import { strings } from '../../../constants/strings';
import { Header, Card, Button, Chip } from '../../../components';
import { workoutService } from '../../../services';
import { Exercise } from '../../../types';
import { SAMPLE_VIDEO_2D, SAMPLE_VIDEO_3D } from '../../../mocks/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExerciseVideoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [mode3D, setMode3D] = useState(true);
  const [showGif, setShowGif] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [loop, setLoop] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(30);

  const videoViewRef = useRef<VideoView>(null);

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    const e = await workoutService.getExerciseById(id || 'squat');
    setExercise(e);
  };

  const initialVideoUrl = exercise
    ? mode3D
      ? exercise.video3DUrl
      : exercise.video2DUrl
    : SAMPLE_VIDEO_3D;

  const player = useVideoPlayer(initialVideoUrl, (p) => {
    p.loop = true;
    p.playbackRate = 1.0;
    p.play();
  });

  // Keep player in sync when exercise loads or mode3D toggles
  useEffect(() => {
    if (exercise && !showGif) {
      const nextSource = mode3D ? exercise.video3DUrl : exercise.video2DUrl;
      if (nextSource) {
        player.replace(nextSource);
        player.playbackRate = speed;
        player.loop = loop;
        player.play();
      }
    }
  }, [exercise, mode3D, showGif]);

  // Track playing status with useEvent from expo
  const playingEvent = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const isPlaying = playingEvent?.isPlaying ?? player.playing;

  // Track player status (idle, loading, readyToPlay, error)
  const statusEvent = useEvent(player, 'statusChange', {
    status: player.status,
  });
  const currentStatus = statusEvent?.status ?? player.status;
  const isBuffering = currentStatus === 'loading';
  const hasError = currentStatus === 'error';

  // Track playback time
  const timeUpdateEvent = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    bufferedPosition: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
  });

  useEffect(() => {
    if (timeUpdateEvent?.currentTime !== undefined) {
      setCurrentTimeSec(timeUpdateEvent.currentTime);
    }
    if (player.duration > 0) {
      setDurationSec(player.duration);
    }
  }, [timeUpdateEvent, player.duration]);

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const totalSecs = Math.max(0, Math.floor(secs));
    const mins = Math.floor(totalSecs / 60);
    const rem = totalSecs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Switch 2D/3D while preserving exact currentTime
  const handleToggleDimension = (newMode3D: boolean) => {
    setShowGif(false);
    if (mode3D === newMode3D && !showGif) return;
    const currentPos = player.currentTime;
    const wasPlaying = isPlaying;

    setMode3D(newMode3D);
    if (!exercise) return;
    const newSource = newMode3D ? exercise.video3DUrl : exercise.video2DUrl;

    player.replace(newSource);
    player.currentTime = currentPos;
    player.playbackRate = speed;
    player.loop = loop;
    if (wasPlaying) {
      player.play();
    }
  };

  // Change playback speed
  const handleChangeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    player.playbackRate = newSpeed;
  };

  // Toggle loop
  const handleToggleLoop = () => {
    const nextLoop = !loop;
    setLoop(nextLoop);
    player.loop = nextLoop;
  };

  // Seek +/- 5s
  const handleSeek = (deltaSec: number) => {
    player.seekBy(deltaSec);
  };

  // Toggle picture in picture
  const handlePip = async () => {
    try {
      if (videoViewRef.current) {
        await videoViewRef.current.startPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP not available on this device:', e);
    }
  };

  const progressPercent =
    durationSec > 0 ? Math.min((currentTimeSec / durationSec) * 100, 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title={exercise?.name || 'Chi tiết bài tập'}
          onBack={() => {
            player.pause();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/workout');
            }
          }}
        />

        {/* Video Player Box with Custom Overlay Controls */}
        <View style={styles.videoPlayerContainer}>
          {!showGif ? (
            <VideoView
              ref={videoViewRef}
              player={player}
              nativeControls={false}
              allowsPictureInPicture
              fullscreenOptions={{ enable: true }}
              contentFit="cover"
              style={styles.videoSurface}
            />
          ) : (
            <Image
              source={{
                uri:
                  exercise?.animation3DUrl ||
                  'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0514.gif',
              }}
              style={styles.videoSurface}
              resizeMode="contain"
            />
          )}

          {/* Top badges bar over video */}
          <View style={styles.videoTopBar}>
            <View style={styles.videoBadge}>
              <Text style={styles.videoBadgeText}>
                {exercise?.name || 'Squat'} · {showGif ? '3D GIF' : mode3D ? '3D Video' : '2D Video'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.pipBadge}
              onPress={handlePip}
              accessibilityRole="button"
              accessibilityLabel={strings.videoPlayer.pip}
            >
              <Text style={styles.pipText}>PiP</Text>
            </TouchableOpacity>
          </View>

          {/* Buffering Indicator */}
          {!showGif && isBuffering && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}

          {/* Error Overlay */}
          {!showGif && hasError && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>Không thể phát video</Text>
              <View style={styles.errorButtonsRow}>
                <Button
                  title={strings.common.retry}
                  size="small"
                  variant="outline"
                  accessibilityLabel={strings.common.retry}
                  onPress={() => {
                    const target = exercise
                      ? mode3D
                        ? exercise.video3DUrl
                        : exercise.video2DUrl
                      : SAMPLE_VIDEO_3D;
                    player.replace(target);
                    player.play();
                  }}
                />
                <Button
                  title="Xem ảnh 3D"
                  size="small"
                  accessibilityLabel="Xem ảnh 3D"
                  onPress={() => {
                    setShowGif(true);
                    player.pause();
                  }}
                />
              </View>
            </View>
          )}

          {/* Center Play/Pause button */}
          {!showGif && !hasError && (
            <TouchableOpacity
              style={styles.centerPlayButton}
              onPress={() => (isPlaying ? player.pause() : player.play())}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Tạm dừng video' : 'Phát video'}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={28}
                color={theme.colors.textOnPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Timeline and seek controls */}
          {!showGif && (
            <View style={styles.timelineContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={(e) => {
                  const clickX = e.nativeEvent.locationX;
                  const containerWidth = SCREEN_WIDTH - 32 - 24; // padding offset
                  const targetPercent = Math.max(0, Math.min(clickX / containerWidth, 1));
                  player.currentTime = targetPercent * durationSec;
                }}
                style={styles.progressTouchArea}
              >
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              </TouchableOpacity>

              <View style={styles.timeLabelsRow}>
                <Text style={styles.timeText}>{formatTime(currentTimeSec)}</Text>
                <View style={styles.seekRow}>
                  <TouchableOpacity
                    onPress={() => handleSeek(-5)}
                    style={styles.seekButton}
                    accessibilityRole="button"
                    accessibilityLabel="Lùi 5 giây"
                  >
                    <Ionicons name="play-back" size={14} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSeek(5)}
                    style={styles.seekButton}
                    accessibilityRole="button"
                    accessibilityLabel="Tua nhanh 5 giây"
                  >
                    <Ionicons name="play-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.timeText}>{formatTime(durationSec)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Exercise Title */}
        <Text style={styles.exerciseTitle}>{exercise?.name || 'Squat'}</Text>

        {/* 2D / 3D / GIF Segmented Toggle */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, !showGif && !mode3D && styles.segmentButtonActive]}
            onPress={() => handleToggleDimension(false)}
            accessibilityRole="button"
            accessibilityLabel="Chuyển sang video 2D"
          >
            <Text style={[styles.segmentText, !showGif && !mode3D && styles.segmentTextActive]}>
              2D Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, !showGif && mode3D && styles.segmentButtonActive]}
            onPress={() => handleToggleDimension(true)}
            accessibilityRole="button"
            accessibilityLabel="Chuyển sang mô hình 3D"
          >
            <Text style={[styles.segmentText, !showGif && mode3D && styles.segmentTextActive]}>
              3D Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, showGif && styles.segmentButtonActive]}
            onPress={() => {
              setShowGif(true);
              player.pause();
            }}
            accessibilityRole="button"
            accessibilityLabel="Chuyển sang ảnh động 3D"
          >
            <Text style={[styles.segmentText, showGif && styles.segmentTextActive]}>
              Ảnh 3D (GIF)
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
                onPress={() => handleChangeSpeed(s)}
                style={styles.speedChip}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleToggleLoop}
            style={styles.loopToggle}
            accessibilityRole="button"
            accessibilityLabel="Bật hoặc tắt lặp lại video"
          >
            <Text style={[styles.loopText, loop && styles.loopTextActive]}>
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
          onPress={() => {
            player.pause();
            router.push(`/exercise/${exercise?.id || 'squat'}/camera-workout`);
          }}
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
    position: 'relative',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  videoSurface: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0A0F0D',
  },
  videoTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  videoBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pipText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,20,18,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    padding: 16,
    gap: 12,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  centerPlayButton: {
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineContainer: {
    width: '100%',
    zIndex: 10,
  },
  progressTouchArea: {
    paddingVertical: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#3A4640',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  seekRow: {
    flexDirection: 'row',
    gap: 16,
  },
  seekButton: {
    padding: 2,
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
  loopTextActive: {
    color: theme.colors.primary,
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
