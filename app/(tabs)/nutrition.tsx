import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button } from '../../components';
import { nutritionService } from '../../services';
import { DailyNutrition } from '../../types';

export default function NutritionTabScreen() {
  const router = useRouter();
  const [data, setData] = useState<DailyNutrition | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const d = await nutritionService.getDailyNutrition();
    setData(d);
  };

  const remaining = (data?.calorieTarget || 2000) - (data?.caloriesConsumed || 1240);

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
        {/* Breakfast */}
        <Card style={styles.mealCard}>
          <Text style={styles.mealTitle}>{strings.nutrition.meals.breakfast}</Text>
          {data?.meals.breakfast.map((item) => (
            <View key={item.id} style={styles.foodRow}>
              <Text style={styles.foodName}>{item.food.name}</Text>
              <Text style={styles.foodCalories}>{item.food.calories}</Text>
            </View>
          ))}
        </Card>

        {/* Lunch */}
        <Card style={styles.mealCard}>
          <Text style={styles.mealTitle}>{strings.nutrition.meals.lunch}</Text>
          {data?.meals.lunch.map((item) => (
            <View key={item.id} style={styles.foodRow}>
              <Text style={styles.foodName}>{item.food.name}</Text>
              <Text style={styles.foodCalories}>{item.food.calories}</Text>
            </View>
          ))}
        </Card>

        {/* Dinner */}
        <Card style={styles.mealCard}>
          <Text style={styles.mealTitle}>{strings.nutrition.meals.dinner}</Text>
          {data?.meals.dinner.map((item) => (
            <View key={item.id} style={styles.foodRow}>
              <Text style={styles.foodName}>{item.food.name}</Text>
              <Text style={styles.foodCalories}>{item.food.calories}</Text>
            </View>
          ))}
        </Card>

        {/* Snack */}
        <Card style={styles.mealCard}>
          <Text style={styles.mealTitle}>{strings.nutrition.meals.snack}</Text>
          {data?.meals.snack && data.meals.snack.length > 0 ? (
            data.meals.snack.map((item) => (
              <View key={item.id} style={styles.foodRow}>
                <Text style={styles.foodName}>{item.food.name}</Text>
                <Text style={styles.foodCalories}>{item.food.calories}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyFoodRow}>
              <Text style={styles.emptyFoodText}>{strings.nutrition.noFoodYet}</Text>
              <TouchableOpacity
                onPress={() => router.push('/nutrition/scan')}
                style={styles.addFoodIcon}
                accessibilityRole="button"
                accessibilityLabel="Thêm món cho bữa phụ"
              >
                <Ionicons name="add" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

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
  mealTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  foodName: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  foodCalories: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.semiBold,
    color: theme.colors.textPrimary,
  },
  emptyFoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  emptyFoodText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textMuted,
  },
  addFoodIcon: {
    padding: 4,
  },
  scanButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
