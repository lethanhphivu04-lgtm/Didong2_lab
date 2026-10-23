import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Button, Card } from '../../components';

type CardioTab = 'time' | 'heart' | 'calories' | 'pace';

export default function CardioScreen() {
  const router = useRouter();

  // Session state
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTab, setActiveTab] = useState<CardioTab>('time');
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [heartBpm, setHeartBpm] = useState(78);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [feedback, setFeedback] = useState<'challenging' | 'moderate' | 'exhausted'>('moderate');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          // Calculate simulated speed & distance: ~9.5 km/h (2.64 m/s)
          setDistanceKm((d) => +(d + 0.0026).toFixed(2));
          // Calorie burn: ~10-12 kcal/min
          setCaloriesBurned((c) => +(c + 0.18).toFixed(1));
          // Simulated heart rate between 128 - 152 when running
          setHeartBpm(Math.floor(130 + Math.sin(next / 5) * 12 + (next % 4)));
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (isActive) {
      Alert.alert(
        'Đang chạy bộ',
        'Buổi chạy đang diễn ra. Bạn có muốn tạm dừng và thoát không?',
        [
          { text: 'Tiếp tục chạy', style: 'cancel' },
          {
            text: 'Thoát',
            style: 'destructive',
            onPress: () => {
              setIsActive(false);
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/workout');
            },
          },
        ]
      );
    } else {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/workout');
    }
  };

  const handleFinish = () => {
    setIsActive(false);
    setShowCompleteModal(true);
  };

  const handleSaveSession = () => {
    setShowCompleteModal(false);
    Alert.alert(
      'Tuyệt vời!',
      `Đã lưu buổi chạy: ${formatTime(seconds)} · ${distanceKm} km · ${Math.round(caloriesBurned)} kcal`,
      [
        {
          text: 'Về trang chủ',
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)/workout');
          },
        },
      ]
    );
  };

  const paceDisplay = distanceKm > 0 ? (seconds / 60 / distanceKm).toFixed(2) : '5.30';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* CaFit Top Coral Curved Banner */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerIconButton}
          accessibilityRole="button"
          accessibilityLabel={strings.common.back}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.cafit.cardio.title}</Text>

        <TouchableOpacity
          onPress={() => setIsLocked(!isLocked)}
          style={[styles.headerIconButton, isLocked && styles.headerIconLocked]}
          accessibilityRole="button"
          accessibilityLabel={isLocked ? strings.cafit.cardio.unlock : strings.cafit.cardio.lock}
        >
          <Ionicons
            name={isLocked ? 'lock-closed' : 'lock-open-outline'}
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Metric Selector Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('time')}
            style={[styles.tabButton, activeTab === 'time' && styles.tabButtonActive]}
          >
            <Ionicons
              name="timer-outline"
              size={18}
              color={activeTab === 'time' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'time' && styles.tabLabelActive,
              ]}
            >
              {strings.cafit.cardio.tabTime}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('heart')}
            style={[styles.tabButton, activeTab === 'heart' && styles.tabButtonActive]}
          >
            <Ionicons
              name="heart-outline"
              size={18}
              color={activeTab === 'heart' ? theme.colors.heart : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'heart' && styles.tabLabelActive,
              ]}
            >
              {strings.cafit.cardio.tabHeart}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('calories')}
            style={[styles.tabButton, activeTab === 'calories' && styles.tabButtonActive]}
          >
            <Ionicons
              name="flame-outline"
              size={18}
              color={activeTab === 'calories' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'calories' && styles.tabLabelActive,
              ]}
            >
              {strings.cafit.cardio.tabCalories}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('pace')}
            style={[styles.tabButton, activeTab === 'pace' && styles.tabButtonActive]}
          >
            <Ionicons
              name="speedometer-outline"
              size={18}
              color={activeTab === 'pace' ? theme.colors.info : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'pace' && styles.tabLabelActive,
              ]}
            >
              {strings.cafit.cardio.tabPace}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Circular HUD Gauge matching CaFit XD Design */}
        <View style={styles.gaugeContainer}>
          <View style={styles.outerRing}>
            <View style={styles.gaugeContent}>
              {activeTab === 'time' && (
                <>
                  <Ionicons name="time" size={30} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                  <Text style={styles.gaugeMainValue}>{formatTime(seconds)}</Text>
                  <Text style={styles.gaugeUnit}>{isActive ? 'ĐANG CHẠY' : 'SẴN SÀNG'}</Text>
                </>
              )}

              {activeTab === 'heart' && (
                <>
                  <Ionicons name="heart" size={32} color={theme.colors.heart} style={{ marginBottom: 4 }} />
                  <Text style={[styles.gaugeMainValue, { color: theme.colors.heart }]}>{heartBpm}</Text>
                  <Text style={styles.gaugeUnit}>BPM · VÙNG HIẾU KHÍ</Text>
                </>
              )}

              {activeTab === 'calories' && (
                <>
                  <Ionicons name="flame" size={32} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                  <Text style={styles.gaugeMainValue}>{caloriesBurned.toFixed(1)}</Text>
                  <Text style={styles.gaugeUnit}>KCAL ĐÃ ĐỐT</Text>
                </>
              )}

              {activeTab === 'pace' && (
                <>
                  <Ionicons name="flash" size={32} color={theme.colors.info} style={{ marginBottom: 4 }} />
                  <Text style={[styles.gaugeMainValue, { color: theme.colors.info }]}>{paceDisplay}</Text>
                  <Text style={styles.gaugeUnit}>MIN / KM</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Live Metrics Grid */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>{strings.cafit.cardio.distance}</Text>
            <Text style={styles.metricValue}>{distanceKm} <Text style={styles.metricUnit}>km</Text></Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>{strings.cafit.cardio.pace}</Text>
            <Text style={styles.metricValue}>{paceDisplay} <Text style={styles.metricUnit}>min/km</Text></Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>{strings.cafit.cardio.bpm}</Text>
            <Text style={[styles.metricValue, { color: theme.colors.heart }]}>{heartBpm}</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>{strings.cafit.cardio.calories}</Text>
            <Text style={styles.metricValue}>{Math.round(caloriesBurned)} <Text style={styles.metricUnit}>kcal</Text></Text>
          </Card>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          {isLocked ? (
            <TouchableOpacity
              onPress={() => setIsLocked(false)}
              style={styles.unlockPill}
              activeOpacity={0.8}
            >
              <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
              <Text style={styles.unlockText}>Chạm để mở khóa màn hình</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonsContainer}>
              <Button
                title={isActive ? strings.cafit.cardio.pause : (seconds > 0 ? strings.cafit.cardio.resume : strings.cafit.cardio.start)}
                onPress={() => setIsActive(!isActive)}
                accessibilityLabel={isActive ? strings.cafit.cardio.pause : strings.cafit.cardio.start}
                style={styles.mainStartButton}
                icon={
                  <Ionicons
                    name={isActive ? 'pause' : 'play'}
                    size={22}
                    color="#FFFFFF"
                  />
                }
              />

              {seconds > 10 && (
                <Button
                  title={strings.cafit.cardio.finish}
                  variant="outline"
                  onPress={handleFinish}
                  accessibilityLabel={strings.cafit.cardio.finish}
                  style={styles.finishButton}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* CaFit Running Complete Feedback Modal */}
      <Modal
        visible={showCompleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalHeaderTitle}>{strings.cafit.cardio.feedbackTitle}</Text>
            <Text style={styles.modalHeaderSubtitle}>{strings.cafit.cardio.feedbackSubtitle}</Text>

            {/* Stats Summary Card */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{formatTime(seconds)}</Text>
                <Text style={styles.summaryText}>Thời gian</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{distanceKm} km</Text>
                <Text style={styles.summaryText}>Quãng đường</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{Math.round(caloriesBurned)}</Text>
                <Text style={styles.summaryText}>Calo</Text>
              </View>
            </View>

            {/* Feedback Rating Options */}
            <View style={styles.feedbackList}>
              <TouchableOpacity
                onPress={() => setFeedback('moderate')}
                style={[styles.feedbackOption, feedback === 'moderate' && styles.feedbackOptionSelected]}
              >
                <Text style={styles.feedbackOptionText}>{strings.cafit.cardio.feedbackModerate}</Text>
                {feedback === 'moderate' && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFeedback('challenging')}
                style={[styles.feedbackOption, feedback === 'challenging' && styles.feedbackOptionSelected]}
              >
                <Text style={styles.feedbackOptionText}>{strings.cafit.cardio.feedbackChallenging}</Text>
                {feedback === 'challenging' && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFeedback('exhausted')}
                style={[styles.feedbackOption, feedback === 'exhausted' && styles.feedbackOptionSelected]}
              >
                <Text style={styles.feedbackOptionText}>{strings.cafit.cardio.feedbackExhausted}</Text>
                {feedback === 'exhausted' && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
              </TouchableOpacity>
            </View>

            <Button
              title={strings.cafit.cardio.saveSession}
              onPress={handleSaveSession}
              accessibilityLabel={strings.cafit.cardio.saveSession}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerIconLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: theme.spacing.xl,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.surfaceHighlight,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
  },
  outerRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    borderTopColor: theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gaugeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeMainValue: {
    fontSize: 48,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  gaugeUnit: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 22,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  metricUnit: {
    fontSize: 13,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  controlsRow: {
    marginTop: theme.spacing.sm,
  },
  buttonsContainer: {
    gap: 12,
  },
  mainStartButton: {
    height: 54,
    borderRadius: 27,
  },
  finishButton: {
    height: 48,
    borderRadius: 24,
    borderColor: theme.colors.borderLight,
  },
  unlockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#333D47',
    gap: 8,
  },
  unlockText: {
    color: '#FFFFFF',
    fontFamily: theme.fontFamilies.bold,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 24,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalHeaderSubtitle: {
    fontSize: 14,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  feedbackList: {
    gap: 10,
    marginBottom: 16,
  },
  feedbackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feedbackOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(255, 114, 78, 0.08)',
  },
  feedbackOptionText: {
    fontSize: 16,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
});
