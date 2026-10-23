import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Header, Card } from '../../components';

export default function SettingsScreen() {
  const [workoutReminder, setWorkoutReminder] = useState(true);
  const [mealReminder, setMealReminder] = useState(false);

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

        <Card style={styles.settingRowCard}>
          <Text style={styles.settingLabel}>{strings.settings.reminderTime}</Text>
          <Text style={styles.settingValue}>18:00</Text>
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

        <Card style={styles.settingRowCard}>
          <Text style={styles.settingLabel}>{strings.settings.units}</Text>
          <Text style={styles.settingValue}>{strings.settings.unitValue}</Text>
        </Card>

        <Card style={styles.settingRowCard}>
          <Text style={styles.settingLabel}>{strings.settings.language}</Text>
          <Text style={styles.settingValue}>{strings.settings.languageValue}</Text>
        </Card>

        <Card style={styles.settingRowCard}>
          <Text style={styles.settingLabel}>{strings.settings.theme}</Text>
          <Text style={styles.settingValue}>{strings.settings.themeDark}</Text>
        </Card>

        {/* TÀI KHOẢN */}
        <Text style={styles.sectionHeader}>{strings.settings.accountSection}</Text>

        <Card style={styles.settingRowCard} onPress={() => {}}>
          <Text style={styles.settingLabel}>{strings.settings.changePassword}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </Card>

        <Card style={styles.settingRowCard} onPress={() => {}}>
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
