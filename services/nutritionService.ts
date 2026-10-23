import { DailyNutrition, FoodEntry, FoodNutrition } from '../types';
import { INutritionService } from './interfaces';
import { storage } from './storage';

const NUTRITION_STORAGE_KEY = '@fitness_daily_nutrition';

const DEFAULT_NUTRITION: DailyNutrition = {
  date: new Date().toISOString().split('T')[0],
  calorieTarget: 2000,
  caloriesConsumed: 1240,
  proteinConsumed: 78,
  carbsConsumed: 150,
  fatConsumed: 38,
  waterTargetMl: 2000,
  waterConsumedMl: 1250,
  waterReminderEnabled: true,
  waterReminderIntervalHours: 2,
  meals: {
    breakfast: [
      {
        id: 'food_1',
        mealType: 'breakfast',
        consumedAt: '07:30',
        food: {
          name: 'Bánh mì trứng',
          calories: 300,
          portionGrams: 150,
          proteinGrams: 14,
          carbsGrams: 35,
          fatGrams: 11,
        },
      },
    ],
    lunch: [
      {
        id: 'food_2',
        mealType: 'lunch',
        consumedAt: '12:15',
        food: {
          name: 'Cơm gà',
          calories: 490,
          portionGrams: 300,
          proteinGrams: 36,
          carbsGrams: 63,
          fatGrams: 15,
        },
      },
    ],
    dinner: [
      {
        id: 'food_3',
        mealType: 'dinner',
        consumedAt: '19:00',
        food: {
          name: 'Phở bò',
          calories: 450,
          portionGrams: 350,
          proteinGrams: 28,
          carbsGrams: 52,
          fatGrams: 12,
        },
      },
    ],
    snack: [],
  },
};

export class NutritionService implements INutritionService {
  async getDailyNutrition(_date?: string): Promise<DailyNutrition> {
    const saved = await storage.get<DailyNutrition>(NUTRITION_STORAGE_KEY);
    return saved || DEFAULT_NUTRITION;
  }

  async recognizeFoodFromImage(_imageUri: string): Promise<FoodNutrition> {
    // Giai đoạn 1: Mock AI food recognition theo PDF page 4 (Phở bò)
    return {
      name: 'Phở bò',
      calories: 450,
      portionGrams: 350,
      proteinGrams: 28,
      carbsGrams: 52,
      fatGrams: 12,
    };
  }

  async addFoodEntry(mealType: string, food: FoodNutrition): Promise<FoodEntry> {
    const daily = await this.getDailyNutrition();
    const entry: FoodEntry = {
      id: 'entry_' + Date.now(),
      mealType: mealType as any,
      food,
      consumedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const targetMealList = (daily.meals as any)[mealType] || daily.meals.snack;
    targetMealList.push(entry);

    daily.caloriesConsumed += food.calories;
    daily.proteinConsumed += food.proteinGrams;
    daily.carbsConsumed += food.carbsGrams;
    daily.fatConsumed += food.fatGrams;

    await storage.set(NUTRITION_STORAGE_KEY, daily);
    return entry;
  }

  async removeFoodEntry(entryId: string): Promise<void> {
    const daily = await this.getDailyNutrition();
    for (const key of ['breakfast', 'lunch', 'dinner', 'snack'] as const) {
      const idx = daily.meals[key].findIndex((m) => m.id === entryId);
      if (idx !== -1) {
        const item = daily.meals[key][idx];
        daily.caloriesConsumed -= item.food.calories;
        daily.proteinConsumed -= item.food.proteinGrams;
        daily.carbsConsumed -= item.food.carbsGrams;
        daily.fatConsumed -= item.food.fatGrams;
        daily.meals[key].splice(idx, 1);
        break;
      }
    }
    await storage.set(NUTRITION_STORAGE_KEY, daily);
  }

  async logWater(amountMl: number): Promise<DailyNutrition> {
    const daily = await this.getDailyNutrition();
    const current = daily.waterConsumedMl ?? 1250;
    daily.waterConsumedMl = Math.max(0, current + amountMl);
    await storage.set(NUTRITION_STORAGE_KEY, daily);
    return daily;
  }

  async setWaterTarget(targetMl: number): Promise<DailyNutrition> {
    const daily = await this.getDailyNutrition();
    daily.waterTargetMl = targetMl;
    await storage.set(NUTRITION_STORAGE_KEY, daily);
    return daily;
  }

  async setWaterReminderSettings(enabled: boolean, intervalHours: number): Promise<DailyNutrition> {
    const daily = await this.getDailyNutrition();
    daily.waterReminderEnabled = enabled;
    daily.waterReminderIntervalHours = intervalHours;
    await storage.set(NUTRITION_STORAGE_KEY, daily);
    return daily;
  }

  async resetWater(): Promise<DailyNutrition> {
    const daily = await this.getDailyNutrition();
    daily.waterConsumedMl = 0;
    await storage.set(NUTRITION_STORAGE_KEY, daily);
    return daily;
  }
}

export const nutritionService = new NutritionService();
