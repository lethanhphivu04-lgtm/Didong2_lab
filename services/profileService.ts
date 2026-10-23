import {
  Profile,
  PhysicalProfile,
  UserGoal,
  UserSchedule,
} from '../types';
import { IProfileService } from './interfaces';
import { storage } from './storage';
import { authService } from './authService';

const PROFILE_STORAGE_KEY = '@fitness_profile';

const DEFAULT_PROFILE: Profile = {
  user: {
    id: 'user_default',
    email: 'nguyenvana@gmail.com',
    fullName: 'Nguyễn Văn A',
    createdAt: new Date().toISOString(),
  },
  physical: {
    gender: 'male',
    age: 21,
    heightCm: 170,
    weightKg: 65,
    bmi: 22.5,
    bmiCategory: 'Bình thường',
  },
  goal: {
    type: 'fatLoss',
    targetWeightKg: 60,
  },
  schedule: {
    level: 'beginner',
    sessionsPerWeek: 4,
    durationMinutes: 45,
    equipment: 'none',
  },
  onboardingCompleted: false,
  onboardingStep: 1,
};

export class ProfileService implements IProfileService {
  async getProfile(): Promise<Profile | null> {
    const saved = await storage.get<Profile>(PROFILE_STORAGE_KEY);
    return saved;
  }

  private async getOrCreateProfile(): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) return existing;

    const currentUser = await authService.getCurrentUser();
    const initial: Profile = {
      ...DEFAULT_PROFILE,
      user: currentUser || DEFAULT_PROFILE.user,
    };
    await storage.set(PROFILE_STORAGE_KEY, initial);
    return initial;
  }

  async savePhysicalProfile(physical: PhysicalProfile): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.physical = physical;
    profile.onboardingStep = Math.max(profile.onboardingStep, 2);
    await storage.set(PROFILE_STORAGE_KEY, profile);
    return profile;
  }

  async saveGoal(goal: UserGoal): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.goal = goal;
    profile.onboardingStep = Math.max(profile.onboardingStep, 3);
    await storage.set(PROFILE_STORAGE_KEY, profile);
    return profile;
  }

  async saveSchedule(schedule: UserSchedule): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.schedule = schedule;
    profile.onboardingStep = Math.max(profile.onboardingStep, 4);
    await storage.set(PROFILE_STORAGE_KEY, profile);
    return profile;
  }

  async completeOnboarding(): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.onboardingCompleted = true;
    profile.onboardingStep = 4;
    await storage.set(PROFILE_STORAGE_KEY, profile);
    return profile;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    const updated: Profile = {
      ...profile,
      ...updates,
      user: { ...profile.user, ...(updates.user || {}) },
      physical: { ...profile.physical, ...(updates.physical || {}) },
      goal: { ...profile.goal, ...(updates.goal || {}) },
      schedule: { ...profile.schedule, ...(updates.schedule || {}) },
    };
    await storage.set(PROFILE_STORAGE_KEY, updated);
    return updated;
  }

  async setOnboardingStep(step: number): Promise<void> {
    const profile = await this.getOrCreateProfile();
    profile.onboardingStep = step;
    await storage.set(PROFILE_STORAGE_KEY, profile);
  }

  async getOnboardingStep(): Promise<number> {
    const profile = await this.getProfile();
    return profile ? profile.onboardingStep : 1;
  }
}

export const profileService = new ProfileService();
