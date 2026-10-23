import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button } from '../../components';
import { nutritionService } from '../../services';
import { DailyNutrition, MealType } from '../../types';

export default function NutritionTabScreen() {
  const router = useRouter();
  const [data, setData] = useState<DailyNutrition | null>(null);

  const loadData = async () => {
    const d = await nutritionService.getDailyNutrition();
    setData(d);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDeleteItem = (id: string, name: string) => {
    Alert.alert('Xóa món ăn', `Bạn có chắc muốn xóa "${name}" khỏi nhật ký hôm nay?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await nutritionService.removeFoodEntry(id);
          loadData();
        },
      },
    ]);
  };

  const remaining = Math.max(
    0,
    (data?.calorieTarget || 2000) - (data?.caloriesConsumed || 1240)
  );

  const renderMealSection = (mealType: MealType, title: string) => {
    const items = data?.meals[mealType] || [];
    return (
      <Card style={styles.mealCard}>
        <View style={styles.mealHeaderRow}>
          <Text style={styles.mealTitle}>{title}</Text>
          <TouchableOpacity
            onPress={() => router.push('/nutrition/scan')}
            style={styles.addMiniButton}
            accessibilityRole="button"
            accessibilityLabel={`Thêm món vào ${title}`}
          >
            <Ionicons name="add" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {items.length > 0 ? (
          items.map((item) => (
            <View key={item.id} style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.food.name}</Text>
                <Text style={styles.foodGrams}>{item.food.portionGrams}g</Text>
              </View>

              <View style={styles.foodRight}>
                <Text style={styles.foodCalories}>{item.food.calories} kcal</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(item.id, item.food.name)}
                  style={styles.deleteButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Xóa ${item.food.name}`}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyFoodRow}>
            <Text style={styles.emptyFoodText}>{strings.nutrition.noFoodYet}</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>{strings.nutrition.title}</Text>

        {/* Daily Calorie Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.mainCalories}>
            {data?.caloriesConsumed.toLocaleString() || '1.240'}
          </Text>
          <Text style={styles.calorieSubtext}>
            trên {data?.calorieTarget.toLocaleString() || '2.000'} kcal · còn {remaining}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    ((data?.caloriesConsumed || 1240) / (data?.calorieTarget || 2000)) *
                      100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>

          {/* Macros row */}
          <View style={styles.macrosRow}>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>{strings.nutrition.protein}</Text>
              <Text style={styles.macroValue}>{data?.proteinConsumed || 78} g</Text>
            </View>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>{strings.nutrition.carbs}</Text>
              <Text style={styles.macroValue}>{data?.carbsConsumed || 150} g</Text>
            </View>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>{strings.nutrition.fat}</Text>
              <Text style={styles.macroValue}>{data?.fatConsumed || 38} g</Text>
            </View>
          </View>
        </Card>

        {/* 4 Meals List */}
        {renderMealSection('breakfast', strings.nutrition.meals.breakfast)}
        {renderMealSection('lunch', strings.nutrition.meals.lunch)}
        {renderMealSection('dinner', strings.nutrition.meals.dinner)}
        {renderMealSection('snack', strings.nutrition.meals.snack)}

        {/* Scan Food CTA Button */}
        <Button
          title={strings.nutrition.scanFood}
          accessibilityLabel={strings.nutrition.scanFood}
          onPress={() => router.push('/nutrition/scan')}
          style={styles.scanButton}
          icon={
            <Ionicons
              name="camera-outline"
              size={20}
              color={theme.colors.textOnPrimary}
            />
          }
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.hero,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  mainCalories: {
    fontSize: 34,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  calorieSubtext: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#242D29',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCol: {
    alignItems: 'flex-start',
  },
  macroLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  mealCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  mealTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  addMiniButton: {
    padding: 4,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#242D29',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
  },
  foodGrams: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  foodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foodCalories: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
  deleteButton: {
    padding: 4,
  },
  emptyFoodRow: {
    paddingVertical: 8,
  },
  emptyFoodText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textMuted,
  },
  scanButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
