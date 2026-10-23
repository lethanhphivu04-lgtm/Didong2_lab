import {
  User,
  Profile,
  PhysicalProfile,
  UserGoal,
  UserSchedule,
} from '../types';
import { IProfileService } from './interfaces';
import { storage } from './storage';
import { authService } from './authService';

const PROFILE_STORAGE_KEY_LEGACY = '@fitness_profile';

const DEFAULT_PROFILE: Profile = {
  user: {
    id: 'user_demo',
    email: 'ban@email.com',
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
  onboardingCompleted: true, // Demo user starts completed
  onboardingStep: 4,
};

const createProfileForUser = (user: User): Profile => {
  const isDemo =
    user.email.toLowerCase() === 'ban@email.com' || user.id === 'user_demo';
  return {
    ...DEFAULT_PROFILE,
    user,
    onboardingCompleted: isDemo,
    onboardingStep: isDemo ? 4 : 1,
  };
};

export class ProfileService implements IProfileService {
  private getStorageKey(userId?: string): string {
    if (!userId) return '@fitness_profile_guest';
    return `@fitness_profile_${userId}`;
  }

  async getProfile(): Promise<Profile | null> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      const guest = await storage.get<Profile>('@fitness_profile_guest');
      return guest || null;
    }

    const key = this.getStorageKey(currentUser.id);
    let profile = await storage.get<Profile>(key);

    if (!profile) {
      profile = createProfileForUser(currentUser);
      await storage.set(key, profile);
      await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
    }
    return profile;
  }

  private async getOrCreateProfile(): Promise<Profile> {
    const p = await this.getProfile();
    if (p) return p;

    const currentUser = await authService.getCurrentUser();
    const fallbackUser: User = currentUser || DEFAULT_PROFILE.user;
    const initial = createProfileForUser(fallbackUser);
    const key = this.getStorageKey(fallbackUser.id);
    await storage.set(key, initial);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, initial);
    return initial;
  }

  async savePhysicalProfile(physical: PhysicalProfile): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.physical = physical;
    profile.onboardingStep = Math.max(profile.onboardingStep, 2);

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || profile.user.id);
    await storage.set(key, profile);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
    return profile;
  }

  async saveGoal(goal: UserGoal): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.goal = goal;
    profile.onboardingStep = Math.max(profile.onboardingStep, 3);

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || profile.user.id);
    await storage.set(key, profile);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
    return profile;
  }

  async saveSchedule(schedule: UserSchedule): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.schedule = schedule;
    profile.onboardingStep = Math.max(profile.onboardingStep, 4);

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || profile.user.id);
    await storage.set(key, profile);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
    return profile;
  }

  async completeOnboarding(): Promise<Profile> {
    const profile = await this.getOrCreateProfile();
    profile.onboardingCompleted = true;
    profile.onboardingStep = 4;

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || profile.user.id);
    await storage.set(key, profile);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
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

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || updated.user.id);
    await storage.set(key, updated);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, updated);
    return updated;
  }

  async setOnboardingStep(step: number): Promise<void> {
    const profile = await this.getOrCreateProfile();
    profile.onboardingStep = step;

    const currentUser = await authService.getCurrentUser();
    const key = this.getStorageKey(currentUser?.id || profile.user.id);
    await storage.set(key, profile);
    await storage.set(PROFILE_STORAGE_KEY_LEGACY, profile);
  }

  async getOnboardingStep(): Promise<number> {
    const profile = await this.getProfile();
    return profile ? profile.onboardingStep : 1;
  }
}

export const profileService = new ProfileService();
