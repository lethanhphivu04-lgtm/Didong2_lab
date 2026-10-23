import {
  User,
  Profile,
  PhysicalProfile,
  UserGoal,
  UserSchedule,
  Plan,
  Workout,
  Exercise,
  WorkoutLog,
  DailyNutrition,
  FoodEntry,
  FoodNutrition,
  ProgressStats,
  PoseFeedback,
} from '../types';

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  register(fullName: string, email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export interface IProfileService {
  getProfile(): Promise<Profile | null>;
  savePhysicalProfile(physical: PhysicalProfile): Promise<Profile>;
  saveGoal(goal: UserGoal): Promise<Profile>;
  saveSchedule(schedule: UserSchedule): Promise<Profile>;
  completeOnboarding(): Promise<Profile>;
  updateProfile(updates: Partial<Profile>): Promise<Profile>;
  setOnboardingStep(step: number): Promise<void>;
  getOnboardingStep(): Promise<number>;
}

export interface IPlanService {
  getPlan(): Promise<Plan | null>;
  generateAIPlan(profile: Profile): Promise<Plan>;
  regeneratePlan(): Promise<Plan>;
}

export interface IWorkoutService {
  getAllExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | null>;
  searchExercises(query: string, muscleGroup?: string): Promise<Exercise[]>;
  getTodayWorkout(): Promise<Workout | null>;
  getWorkoutById(id: string): Promise<Workout | null>;
  saveWorkoutLog(log: Omit<WorkoutLog, 'id'>): Promise<WorkoutLog>;
  getWorkoutHistory(): Promise<WorkoutLog[]>;
}

export interface INutritionService {
  getDailyNutrition(date?: string): Promise<DailyNutrition>;
  recognizeFoodFromImage(imageUri: string): Promise<FoodNutrition>;
  addFoodEntry(mealType: string, food: FoodNutrition): Promise<FoodEntry>;
  removeFoodEntry(entryId: string): Promise<void>;
}

export interface IProgressService {
  getProgressStats(range?: string): Promise<ProgressStats>;
  addWeightEntry(weightKg: number): Promise<void>;
}
