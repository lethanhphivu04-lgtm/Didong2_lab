import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button } from '../../components';
import { nutritionService } from '../../services';

export default function FoodScanScreen() {
  const router = useRouter();
  const [portionGrams, setPortionGrams] = useState(350);
  const [loading, setLoading] = useState(false);

  // Scaled nutrition based on grams
  const baseCalories = 450;
  const basePortion = 350;
  const ratio = portionGrams / basePortion;
  const calories = Math.round(baseCalories * ratio);
  const protein = Math.round(28 * ratio);
  const carbs = Math.round(52 * ratio);
  const fat = Math.round(12 * ratio);

  const handleAdjustPortion = (delta: number) => {
    setPortionGrams((prev) => Math.max(50, prev + delta));
  };

  const handleAddToDiary = async () => {
    setLoading(true);
    await nutritionService.addFoodEntry('dinner', {
      name: 'Phở bò',
      calories,
      portionGrams,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatGrams: fat,
    });
    setLoading(false);
    router.replace('/(tabs)/nutrition');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Scanner Viewfinder Box */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.viewfinderBadge}>
              <Text style={styles.viewfinderBadgeText}>
                {strings.nutrition.scanTitle}
              </Text>
            </View>
          </View>

          {/* Center Graphic Frame with Lime Brackets */}
          <View style={styles.bracketFrame}>
            <View style={styles.dishGraphic}>
              <View style={styles.dishOuterPlate}>
                <View style={styles.dishFood}>
                  <View style={styles.foodGarnish1} />
                  <View style={styles.foodGarnish2} />
                  <View style={styles.foodGarnish3} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recognition Result Header */}
        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.recognizedLabel}>
              {strings.nutrition.recognized}
            </Text>
            <Text style={styles.foodTitle}>Phở bò</Text>
          </View>

          <View style={styles.caloriesBox}>
            <Text style={styles.caloriesNumber}>≈ {calories}</Text>
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>
        </View>

        {/* Portion Stepper Card */}
        <Card style={styles.portionCard}>
          <Text style={styles.portionLabel}>
            {strings.nutrition.estimatedPortion}
          </Text>

          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handleAdjustPortion(-50)}
              accessibilityRole="button"
              accessibilityLabel="Giảm khẩu phần 50g"
            >
              <Ionicons name="remove" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.portionValue}>{portionGrams} g</Text>

            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => handleAdjustPortion(50)}
              accessibilityRole="button"
              accessibilityLabel="Tăng khẩu phần 50g"
            >
              <Ionicons name="add" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3 Macro Tiles */}
        <View style={styles.macrosRow}>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>{strings.nutrition.protein}</Text>
            <Text style={styles.macroValue}>{protein} g</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>{strings.nutrition.carbs}</Text>
            <Text style={styles.macroValue}>{carbs} g</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>{strings.nutrition.fat}</Text>
            <Text style={styles.macroValue}>{fat} g</Text>
          </Card>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{strings.nutrition.disclaimer}</Text>

        {/* Add to Diary CTA */}
        <Button
          title={strings.nutrition.addToDiary}
          accessibilityLabel={strings.nutrition.addToDiary}
          loading={loading}
          onPress={handleAddToDiary}
          style={styles.addButton}
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
  viewfinderContainer: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    backgroundColor: '#16221D',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewfinderBadgeText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.bold,
  },
  bracketFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishGraphic: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishOuterPlate: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#EBE5D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishFood: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B46C38',
    position: 'relative',
    overflow: 'hidden',
  },
  foodGarnish1: {
    position: 'absolute',
    top: 25,
    left: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DE9E5C',
  },
  foodGarnish2: {
    position: 'absolute',
    top: 25,
    right: 35,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E8CA5B',
  },
  foodGarnish3: {
    position: 'absolute',
    bottom: 20,
    left: 45,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A9248',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  recognizedLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  foodTitle: {
    fontSize: 26,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  caloriesBox: {
    alignItems: 'flex-end',
  },
  caloriesNumber: {
    fontSize: 28,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  caloriesUnit: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
  },
  portionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  portionLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#242D29',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portionValue: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minWidth: 50,
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  macroCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  disclaimer: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
});
