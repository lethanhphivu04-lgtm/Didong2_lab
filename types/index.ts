// ==========================================
// User & Auth Types
// ==========================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export type Gender = 'male' | 'female' | 'other';

export type GoalType = 'fatLoss' | 'muscleGain' | 'stayFit' | 'endurance';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentType = 'none' | 'dumbbell' | 'gym';

export interface PhysicalProfile {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: string;
}

export interface UserGoal {
  type: GoalType;
  targetWeightKg: number;
}

export interface UserSchedule {
  level: FitnessLevel;
  sessionsPerWeek: number;
  durationMinutes: number;
  equipment: EquipmentType;
}

export interface Profile {
  user: User;
  physical: PhysicalProfile;
  goal: UserGoal;
  schedule: UserSchedule;
  onboardingCompleted: boolean;
  onboardingStep: number; // 1, 2, 3, 4
}

// ==========================================
// Workout & Exercise Types
// ==========================================

export type MuscleGroup = 'all' | 'chest' | 'back' | 'legs' | 'core' | 'arms' | 'shoulders';

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface ExerciseStep {
  stepNumber: number;
  instruction: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  muscleGroupDisplay: string;
  difficulty: ExerciseDifficulty;
  difficultyDisplay: string;
  thumbnailUrl?: string;
  hasVideo2D: boolean;
  hasVideo3D: boolean;
  video2DUrl: string;
  video3DUrl: string;
  animation3DUrl?: string;
  defaultSets: number;
  defaultRepsOrSeconds: string; // e.g., "12 lần" or "40 giây"
  steps: string[];
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  repsOrSeconds: string;
  isCompleted?: boolean;
}

export interface Workout {
  id: string;
  title: string;
  category: string; // e.g. "Chân và Core"
  durationMinutes: number;
  estimatedCalories: number;
  restSeconds: number;
  warmupMinutes: number;
  exercises: WorkoutExerciseItem[];
}

export interface ExerciseScore {
  exerciseId: string;
  exerciseName: string;
  score: number; // 0 - 100
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;
  durationMinutes: number;
  caloriesBurned: number;
  totalReps: number;
  postureScore: number; // 0 - 100
  exerciseScores: ExerciseScore[];
}

// ==========================================
// Plan Types (AI Generated)
// ==========================================

export interface DayPlan {
  dayName: string; // e.g. "Thứ 2"
  isRest: boolean;
  sessionTitle?: string;
  durationMinutes?: number;
  workoutId?: string;
}

export interface Plan {
  id: string;
  title: string; // e.g. "Lộ trình 8 tuần"
  goalDescription: string;
  dailyCalorieTarget: number;
  sessionsPerWeek: number;
  currentWeek: number;
  totalWeeks: number;
  weeklySchedule: DayPlan[];
}

// ==========================================
// Nutrition Types
// ==========================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodNutrition {
  name: string;
  calories: number;
  portionGrams: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  imageUrl?: string;
}

export interface FoodEntry {
  id: string;
  mealType: MealType;
  food: FoodNutrition;
  consumedAt: string;
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  calorieTarget: number;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  waterTargetMl?: number; // CaFit water target (default: 2000 ml)
  waterConsumedMl?: number; // CaFit water consumed (default: 1250 ml)
  waterReminderEnabled?: boolean;
  waterReminderIntervalHours?: number;
  meals: {
    breakfast: FoodEntry[];
    lunch: FoodEntry[];
    dinner: FoodEntry[];
    snack: FoodEntry[];
  };
}

// ==========================================
// CaFit Cardio & Running Types
// ==========================================

export interface CardioSession {
  id: string;
  durationSeconds: number;
  distanceKm: number;
  averagePaceMinKm: number;
  averageHeartRateBpm: number;
  caloriesBurned: number;
  completedAt: string;
  feedback?: 'challenging' | 'moderate' | 'exhausted';
}

// ==========================================
// CaFit Fitness & Health Tips Types
// ==========================================

export interface FitnessTip {
  id: string;
  title: string;
  category: 'training' | 'nutrition' | 'water' | 'recovery';
  categoryDisplay: string;
  readTimeMinutes: number;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  bannerUrl?: string;
}

// ==========================================
// Progress & Stats Types
// ==========================================

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
}

export type TimeRange = 'week' | 'month' | 'threeMonths';

export interface ProgressStats {
  currentWeightKg: number;
  weightChangeKg: number;
  completedWorkoutsCount: number;
  currentStreakDays: number;
  weightHistory: WeightEntry[];
  recentLogs: WorkoutLog[];
}

// ==========================================
// AI & Pose Analyzer Interfaces
// ==========================================

export interface PoseFeedback {
  kneeAngleDegrees?: number;
  postureStatus: 'good' | 'warning' | 'error';
  warningMessage?: string;
  correctionTip?: string;
  completedReps: number;
  targetReps: number;
}

export interface PoseAnalyzer {
  analyzeFrame(imageUri: string, exerciseId: string): Promise<PoseFeedback>;
  reset(): void;
}
