import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Chip, Button } from '../../components';
import { FitnessTip } from '../../types';

const TIPS_DATA: FitnessTip[] = [
  {
    id: 'tip_1',
    title: 'Nguyên lý kích thích phát triển cơ bắp (Hypertrophy)',
    category: 'training',
    categoryDisplay: 'Tập luyện',
    readTimeMinutes: 3,
    summary: 'Cơ bắp chỉ phát triển khi chịu tải cơ học lũy tiến (Progressive Overload) kết hợp đủ protein và phục hồi.',
    content: [
      'Nguyên tắc vàng để cơ bắp to hơn là tăng dần khối lượng tạ, số lần lặp (reps) hoặc giảm thời gian nghỉ giữa các hiệp theo từng tuần.',
      'Tập luyện gần ngưỡng thất bại (RPE 8-9) kích hoạt tối đa các sợi cơ co rút nhanh (Type II) mang lại hiệu quả phì đại cơ cao nhất.',
      'Đừng quên theo dõi nhật ký tạ mỗi buổi tập để đảm bảo tuần này bạn làm tốt hơn tuần trước ít nhất 1 rep.',
    ],
    keyTakeaways: [
      'Tăng dần mức tạ hoặc số reps mỗi tuần (Progressive Overload).',
      'Giữ form chuẩn, kiểm soát giai đoạn hạ tạ (eccentric) từ 2-3 giây.',
      'Nghỉ giữa hiệp 90-120 giây cho bài đa khớp (Compound).',
    ],
  },
  {
    id: 'tip_2',
    title: 'Uống nước và bổ sung điện giải khi tập nặng',
    category: 'water',
    categoryDisplay: 'Uống nước',
    readTimeMinutes: 2,
    summary: 'Mất chỉ 2% lượng nước cơ thể có thể làm giảm tới 15% hiệu suất sức mạnh và tăng nguy cơ chuột rút.',
    content: [
      'Nước đóng vai trò bôi trơn khớp và vận chuyển glycogen vào tế bào cơ. Khi thiếu nước, tim phải đập nhanh hơn để bơm cùng lượng oxy.',
      'Uống 500ml nước trước khi tập 1 giờ. Trong buổi tập, cứ sau 15-20 phút uống từ 150-250ml nước từng ngụm nhỏ.',
      'Nếu buổi tập kéo dài trên 60 phút hoặc ra nhiều mồ hôi, hãy bổ sung thêm muối khoáng (Natri, Kali, Magie) để chống tụt huyết áp.',
    ],
    keyTakeaways: [
      'Uống đều đặn từng ngụm nhỏ mỗi 15-20 phút trong lúc tập.',
      'Duy trì mục tiêu tối thiểu 2.000ml - 2.500ml nước mỗi ngày.',
      'Nước tiểu màu vàng nhạt trong suốt là dấu hiệu cơ thể đủ nước.',
    ],
  },
  {
    id: 'tip_3',
    title: 'Thời điểm nạp Protein và dinh dưỡng quanh buổi tập',
    category: 'nutrition',
    categoryDisplay: 'Ăn uống',
    readTimeMinutes: 3,
    summary: 'Tổng lượng đạm trong ngày quan trọng hơn "cửa sổ đồng hóa", nhưng nạp đúng lúc sẽ tối ưu quá trình tổng hợp cơ.',
    content: [
      'Trước tập 90-120 phút: Nạp bữa ăn giàu carb hấp thu chậm (yến mạch, khoai lang, cơm gạo lứt) và protein nạc để có nguồn năng lượng dồi dào.',
      'Sau tập: Cơ thể cần carb để bù đắp glycogen cạn kiệt và protein (25-35g) để sửa chữa các vi tổn thương sợi cơ.',
      'Hãy chia đều lượng protein thành 3-4 bữa trong ngày, mỗi bữa cách nhau 3-4 giờ để kích hoạt liên tục tín hiệu mTOR.',
    ],
    keyTakeaways: [
      'Mục tiêu protein hàng ngày: 1.6 - 2.2g / kg trọng lượng cơ thể.',
      'Không cần uống whey ngay trong 30 giây, nạp trong vòng 2 giờ sau tập là tối ưu.',
      'Ưu tiên thực phẩm thật: ức gà, bò, cá hồi, trứng, đậu phụ.',
    ],
  },
  {
    id: 'tip_4',
    title: 'Kỹ thuật thở Valsalva an toàn khi Squat và Deadlift',
    category: 'training',
    categoryDisplay: 'Tập luyện',
    readTimeMinutes: 2,
    summary: 'Nén hơi vào bụng tạo áp lực nội ổ bụng (IAP) giúp bảo vệ cột sống tối đa khi nâng vật nặng.',
    content: [
      'Hít một hơi sâu vào khoang bụng (không phải ngực), gồng cứng cơ bụng như chuẩn bị đỡ một cú đấm.',
      'Giữ hơi trong suốt giai đoạn hạ tạ (eccentric) và qua điểm khó nhất (sticking point), sau đó thở mạnh ra khi gần khóa khớp.',
      'Kỹ thuật này tạo ra một "chiếc đai lưng tự nhiên", ngăn ngừa cong lưng và thoát vị đĩa đệm.',
    ],
    keyTakeaways: [
      'Hít hơi vào bụng, không hít phồng ngực.',
      'Gồng chặt core 360 độ trước khi di chuyển tạ.',
      'Chỉ thở ra khi đã vượt qua điểm nặng nhất.',
    ],
  },
  {
    id: 'tip_5',
    title: 'Tầm quan trọng của khởi động động và hạ nhiệt',
    category: 'recovery',
    categoryDisplay: 'Phục hồi',
    readTimeMinutes: 2,
    summary: 'Khởi động khớp làm tăng nhiệt độ mô cơ và độ nhờn của bao hoạt dịch, giảm 70% nguy cơ rách cơ.',
    content: [
      'Khởi động trước tập nên là "khởi động động" (Dynamic warm-up): xoay khớp, ép dẻo chuyển động, đạp xe nhẹ 5 phút, và các hiệp tạ ấm (warm-up sets).',
      'Tránh ép dẻo tĩnh (Static stretch) kéo dài trước khi nâng tạ nặng vì nó làm giảm độ nhạy phản xạ cơ và lực phát sinh.',
      'Sau buổi tập, dành 5 phút đi bộ chậm và ép dẻo tĩnh để đưa nhịp tim về mức bình thường và giải phóng acid lactic.',
    ],
    keyTakeaways: [
      'Khởi động động trước tập - Giãn cơ tĩnh sau tập.',
      'Luôn thực hiện 2-3 hiệp khởi động nhẹ trước khi vào hiệp chính.',
    ],
  },
  {
    id: 'tip_6',
    title: 'Giấc ngủ sâu: Nơi cơ bắp thực sự được xây dựng',
    category: 'recovery',
    categoryDisplay: 'Phục hồi',
    readTimeMinutes: 3,
    summary: 'Hơn 80% Hormone Tăng Trưởng (GH) và Testosterone được tiết ra trong giai đoạn ngủ sóng chậm (Slow-wave sleep).',
    content: [
      'Tập luyện là quá trình "phá hủy" sợi cơ, còn dinh dưỡng và giấc ngủ mới là lúc cơ thể tái tạo cơ bắp lớn hơn và khỏe hơn.',
      'Thiếu ngủ mãn tính làm tăng hormone Cortisol gây dị hóa cơ, tích trữ mỡ bụng và tăng cảm giác thèm ăn đường.',
      'Cố gắng duy trì 7-8.5 giờ ngủ mỗi đêm, phòng ngủ tối và mát mẻ (khoảng 20-22°C) để đạt chu kỳ REM hoàn hảo.',
    ],
    keyTakeaways: [
      'Ngủ đủ 7-8.5 tiếng mỗi đêm, cố định giờ đi ngủ.',
      'Tắt màn hình điện thoại trước khi ngủ 30-45 phút.',
      'Tránh nạp caffeine sau 16:00 chiều.',
    ],
  },
];

export default function TipsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTip, setActiveTip] = useState<FitnessTip | null>(null);

  const categories = [
    { key: 'all', label: strings.cafit.tips.categoryAll },
    { key: 'training', label: strings.cafit.tips.categoryTraining },
    { key: 'nutrition', label: strings.cafit.tips.categoryNutrition },
    { key: 'water', label: strings.cafit.tips.categoryWater },
    { key: 'recovery', label: strings.cafit.tips.categoryRecovery },
  ];

  const filteredTips =
    selectedCategory === 'all'
      ? TIPS_DATA
      : TIPS_DATA.filter((t) => t.category === selectedCategory);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/workout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerBack}
          accessibilityRole="button"
          accessibilityLabel={strings.common.back}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.cafit.tips.title}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{strings.cafit.tips.subtitle}</Text>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {categories.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              selected={selectedCategory === c.key}
              onPress={() => setSelectedCategory(c.key)}
              style={styles.categoryChip}
            />
          ))}
        </ScrollView>

        {/* Tips Cards List */}
        <View style={styles.tipsList}>
          {filteredTips.map((tip) => (
            <Card
              key={tip.id}
              style={styles.tipCard}
              onPress={() => setActiveTip(tip)}
              accessibilityLabel={tip.title}
            >
              <View style={styles.tipHeaderRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{tip.categoryDisplay}</Text>
                </View>
                <View style={styles.readTimeRow}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.readTimeText}>{tip.readTimeMinutes} phút đọc</Text>
                </View>
              </View>

              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipSummary} numberOfLines={2}>
                {tip.summary}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.readMoreText}>Xem chi tiết</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Tip Detail Modal */}
      <Modal
        visible={!!activeTip}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveTip(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeaderRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{activeTip?.categoryDisplay}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveTip(null)}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Đóng"
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.modalTitle}>{activeTip?.title}</Text>

              <View style={styles.readTimeRowModal}>
                <Ionicons name="time-outline" size={15} color={theme.colors.textSecondary} />
                <Text style={styles.readTimeTextModal}>Thời gian đọc: {activeTip?.readTimeMinutes} phút</Text>
              </View>

              {/* Summary Block */}
              <View style={styles.summaryCallout}>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} style={{ marginTop: 2 }} />
                <Text style={styles.summaryCalloutText}>{activeTip?.summary}</Text>
              </View>

              {/* Paragraphs */}
              <View style={styles.paragraphsContainer}>
                {activeTip?.content.map((p, idx) => (
                  <Text key={idx} style={styles.paragraphText}>
                    {p}
                  </Text>
                ))}
              </View>

              {/* Key Takeaways */}
              {activeTip?.keyTakeaways && (
                <View style={styles.takeawaysCard}>
                  <Text style={styles.takeawaysTitle}>📌 {strings.cafit.tips.keyTakeaways}</Text>
                  {activeTip.keyTakeaways.map((item, i) => (
                    <View key={i} style={styles.takeawayRow}>
                      <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                      <Text style={styles.takeawayText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Button
                title="Đã hiểu, áp dụng ngay"
                onPress={() => setActiveTip(null)}
                accessibilityLabel="Đóng hướng dẫn"
                style={{ marginTop: 20 }}
              />
            </ScrollView>
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
  headerBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: theme.spacing.lg,
  },
  categoryChip: {
    marginRight: 0,
  },
  tipsList: {
    gap: 14,
  },
  tipCard: {
    borderRadius: 20,
    padding: theme.spacing.lg,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 114, 78, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.primary,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  tipTitle: {
    fontSize: 17,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  tipSummary: {
    fontSize: 13,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: theme.fontFamilies.bold,
    color: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 30,
    marginBottom: 8,
  },
  readTimeRowModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  readTimeTextModal: {
    fontSize: 13,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  summaryCallout: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 114, 78, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 18,
  },
  summaryCalloutText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  paragraphsContainer: {
    gap: 14,
    marginBottom: 20,
  },
  paragraphText: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
    lineHeight: 23,
  },
  takeawaysCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  takeawaysTitle: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  takeawayText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
