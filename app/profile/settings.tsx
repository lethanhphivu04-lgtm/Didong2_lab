import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Header, Card } from '../../components';
import { storage } from '../../services';

export default function SettingsScreen() {
  const router = useRouter();
  const [workoutReminder, setWorkoutReminder] = useState(true);
  const [mealReminder, setMealReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00');

  const handleChangePassword = () => {
    Alert.alert('Đổi mật khẩu', 'Đã gửi liên kết đặt lại mật khẩu về email của bạn.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Cảnh báo xóa tài khoản',
      'Hành động này sẽ xóa vĩnh viễn toàn bộ dữ liệu buổi tập, dinh dưỡng và tiến độ của bạn. Bạn có chắc chắn không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: async () => {
            await storage.clear();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header title={strings.settings.title} />

        {/* THÔNG BÁO */}
        <Text style={styles.sectionHeader}>{strings.settings.notifications}</Text>

        <Card
          style={styles.settingRowCard}
          onPress={() => setWorkoutReminder(!workoutReminder)}
          accessibilityLabel={strings.settings.workoutReminder}
        >
          <Text style={styles.settingLabel}>{strings.settings.workoutReminder}</Text>
          <View
            style={[
              styles.checkbox,
              workoutReminder && styles.checkboxChecked,
            ]}
          >
            {workoutReminder && (
              <Ionicons name="checkmark" size={16} color={theme.colors.textOnPrimary} />
            )}
          </View>
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => {
            Alert.alert(
              'Giờ nhắc tập',
              `Hiện tại: ${reminderTime}. Bạn có thể thay đổi giờ nhắc trong hệ thống thông báo.`
            );
          }}
          accessibilityLabel={strings.settings.reminderTime}
        >
          <Text style={styles.settingLabel}>{strings.settings.reminderTime}</Text>
          <Text style={styles.settingValue}>{reminderTime}</Text>
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => setMealReminder(!mealReminder)}
          accessibilityLabel={strings.settings.mealReminder}
        >
          <Text style={styles.settingLabel}>{strings.settings.mealReminder}</Text>
          <View
            style={[
              styles.checkbox,
              mealReminder && styles.checkboxChecked,
            ]}
          >
            {mealReminder && (
              <Ionicons name="checkmark" size={16} color={theme.colors.textOnPrimary} />
            )}
          </View>
        </Card>

        {/* ỨNG DỤNG */}
        <Text style={styles.sectionHeader}>{strings.settings.appSection}</Text>

        <Card
          style={styles.settingRowCard}
          onPress={() => Alert.alert('Đơn vị', 'Ứng dụng hiện hỗ trợ hệ đo lường chuẩn: kg · cm')}
          accessibilityLabel={strings.settings.units}
        >
          <Text style={styles.settingLabel}>{strings.settings.units}</Text>
          <Text style={styles.settingValue}>{strings.settings.unitValue}</Text>
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => Alert.alert('Ngôn ngữ', 'Ứng dụng đang hiển thị Tiếng Việt mặc định')}
          accessibilityLabel={strings.settings.language}
        >
          <Text style={styles.settingLabel}>{strings.settings.language}</Text>
          <Text style={styles.settingValue}>{strings.settings.languageValue}</Text>
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => Alert.alert('Giao diện', 'Giao diện tối chuyên nghiệp (Dark theme)')}
          accessibilityLabel={strings.settings.theme}
        >
          <Text style={styles.settingLabel}>{strings.settings.theme}</Text>
          <Text style={styles.settingValue}>{strings.settings.themeDark}</Text>
        </Card>

        {/* TÍNH NĂNG CAFIT */}
        <Text style={styles.sectionHeader}>TÍNH NĂNG CAFIT</Text>

        <Card
          style={styles.settingRowCard}
          onPress={() => router.push('/workout/water')}
          accessibilityLabel="Nhắc nhở uống nước"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="water" size={18} color={theme.colors.water} />
            <Text style={styles.settingLabel}>Nhắc nhở uống nước</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => router.push('/workout/cardio')}
          accessibilityLabel="Chạy bộ & Cardio HUD"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="walk" size={18} color={theme.colors.heart} />
            <Text style={styles.settingLabel}>Chạy bộ & Cardio HUD</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={() => router.push('/workout/tips')}
          accessibilityLabel="Lời khuyên thể hình & phục hồi"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="bulb" size={18} color={theme.colors.lime} />
            <Text style={styles.settingLabel}>Lời khuyên thể hình & Phục hồi</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        {/* TÀI KHOẢN */}
        <Text style={styles.sectionHeader}>{strings.settings.accountSection}</Text>

        <Card
          style={styles.settingRowCard}
          onPress={handleChangePassword}
          accessibilityLabel={strings.settings.changePassword}
        >
          <Text style={styles.settingLabel}>{strings.settings.changePassword}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card
          style={styles.settingRowCard}
          onPress={handleDeleteAccount}
          accessibilityLabel={strings.settings.deleteAccount}
        >
          <Text style={[styles.settingLabel, styles.dangerLabel]}>
            {strings.settings.deleteAccount}
          </Text>
        </Card>
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
  sectionHeader: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  settingRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    minHeight: 56,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
  },
  settingValue: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dangerLabel: {
    color: theme.colors.warning, // #FFB454
  },
});
