import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../theme';
import { strings } from '../../constants/strings';
import { Card, Button, Chip } from '../../components';
import { nutritionService } from '../../services';
import { MealType } from '../../types';

export default function FoodScanScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('Phở bò');
  const [portionGrams, setPortionGrams] = useState(350);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('dinner');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Nutrition calculated based on portion
  const baseCalories = 450;
  const basePortion = 350;
  const ratio = portionGrams / basePortion;
  const calories = Math.round(baseCalories * ratio);
  const protein = Math.round(28 * ratio);
  const carbs = Math.round(52 * ratio);
  const fat = Math.round(12 * ratio);

  // Take photo with camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền Camera',
          'Vui lòng cấp quyền camera trong cài đặt để chụp ảnh món ăn.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        processImage(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  // Pick photo from gallery
  const handlePickLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền Thư viện ảnh',
          'Vui lòng cấp quyền truy cập thư viện ảnh để phân tích món ăn.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        processImage(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Library error:', e);
    }
  };

  const processImage = async (uri: string) => {
    setImageUri(uri);
    setAnalyzing(true);
    const result = await nutritionService.recognizeFoodFromImage(uri);
    setFoodName(result.name);
    setPortionGrams(result.portionGrams);
    setAnalyzing(false);
  };

  const handleAdjustPortion = (delta: number) => {
    setPortionGrams((prev) => Math.max(50, prev + delta));
  };

  const handleAddToDiary = async () => {
    setSaving(true);
    await nutritionService.addFoodEntry(selectedMeal, {
      name: foodName,
      calories,
      portionGrams,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatGrams: fat,
      imageUrl: imageUri || undefined,
    });
    setSaving(false);
    router.replace('/(tabs)/nutrition');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Scanner Viewfinder Box */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại nhật ký ăn uống"
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.viewfinderBadge}>
              <Text style={styles.viewfinderBadgeText}>
                {strings.nutrition.scanTitle}
              </Text>
            </View>
          </View>

          {/* Viewfinder Center content */}
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.scannedImage} />
          ) : (
            <View style={styles.bracketFrame}>
              <View style={styles.dishOuterPlate}>
                <View style={styles.dishFood}>
                  <View style={styles.foodGarnish1} />
                  <View style={styles.foodGarnish2} />
                  <View style={styles.foodGarnish3} />
                </View>
              </View>
            </View>
          )}

          {/* Analyzing loading overlay */}
          {analyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.analyzingText}>AI đang phân tích món ăn...</Text>
            </View>
          )}

          {/* Photo Source Quick Action Buttons */}
          <View style={styles.photoSourceBar}>
            <TouchableOpacity
              style={styles.sourceButton}
              onPress={handleTakePhoto}
              accessibilityRole="button"
              accessibilityLabel="Chụp ảnh bằng camera"
            >
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.sourceButtonText}>Chụp ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sourceButton}
              onPress={handlePickLibrary}
              accessibilityRole="button"
              accessibilityLabel="Chọn ảnh từ thư viện"
            >
              <Ionicons name="images" size={18} color="#fff" />
              <Text style={styles.sourceButtonText}>Thư viện ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recognition Result Header */}
        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.recognizedLabel}>
              {strings.nutrition.recognized}
            </Text>
            <Text style={styles.foodTitle}>{foodName}</Text>
          </View>

          <View style={styles.caloriesBox}>
            <Text style={styles.caloriesNumber}>≈ {calories}</Text>
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>
        </View>

        {/* Choose Meal to add */}
        <Text style={styles.mealSelectLabel}>Chọn bữa ăn:</Text>
        <View style={styles.mealChipsRow}>
          <Chip
            label={strings.nutrition.meals.breakfast}
            selected={selectedMeal === 'breakfast'}
            onPress={() => setSelectedMeal('breakfast')}
          />
          <Chip
            label={strings.nutrition.meals.lunch}
            selected={selectedMeal === 'lunch'}
            onPress={() => setSelectedMeal('lunch')}
          />
          <Chip
            label={strings.nutrition.meals.dinner}
            selected={selectedMeal === 'dinner'}
            onPress={() => setSelectedMeal('dinner')}
          />
          <Chip
            label={strings.nutrition.meals.snack}
            selected={selectedMeal === 'snack'}
            onPress={() => setSelectedMeal('snack')}
          />
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
          loading={saving}
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
    height: 290,
    borderRadius: 20,
    backgroundColor: '#16221D',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  scannedImage: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dishOuterPlate: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EBE5D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishFood: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: '#B46C38',
    position: 'relative',
    overflow: 'hidden',
  },
  foodGarnish1: {
    position: 'absolute',
    top: 20,
    left: 15,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#DE9E5C',
  },
  foodGarnish2: {
    position: 'absolute',
    top: 20,
    right: 25,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E8CA5B',
  },
  foodGarnish3: {
    position: 'absolute',
    bottom: 15,
    left: 35,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6A9248',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,20,18,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    gap: 10,
  },
  analyzingText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.bold,
  },
  photoSourceBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    gap: 6,
  },
  sourceButtonText: {
    color: '#fff',
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.semiBold,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
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
  mealSelectLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  mealChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.lg,
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
