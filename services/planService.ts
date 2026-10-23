import { Plan, Profile } from '../types';
import { IPlanService } from './interfaces';
import { MOCK_AI_PLAN } from '../mocks/mockData';
import { storage } from './storage';

const PLAN_STORAGE_KEY = '@fitness_ai_plan';

export class PlanService implements IPlanService {
  async getPlan(): Promise<Plan | null> {
    const saved = await storage.get<Plan>(PLAN_STORAGE_KEY);
    return saved || MOCK_AI_PLAN;
  }

  async generateAIPlan(profile: Profile): Promise<Plan> {
    const goalTitle =
      profile.goal.type === 'fatLoss'
        ? 'Giảm mỡ'
        : profile.goal.type === 'muscleGain'
        ? 'Tăng cơ'
        : profile.goal.type === 'stayFit'
        ? 'Giữ dáng'
        : 'Tăng sức bền';

    const sessions = profile.schedule.sessionsPerWeek || 4;
    const duration = profile.schedule.durationMinutes || 45;

    const plan: Plan = {
      ...MOCK_AI_PLAN,
      id: 'plan_' + Date.now(),
      goalDescription: `${goalTitle} · ${sessions} buổi/tuần · khoảng 2.000 kcal mỗi ngày`,
      sessionsPerWeek: sessions,
      weeklySchedule: MOCK_AI_PLAN.weeklySchedule.map((d) => ({
        ...d,
        durationMinutes: d.isRest ? undefined : duration,
      })),
    };

    await storage.set(PLAN_STORAGE_KEY, plan);
    return plan;
  }

  async regeneratePlan(): Promise<Plan> {
    const current = await this.getPlan();
    if (!current) return MOCK_AI_PLAN;

    const regenerated: Plan = {
      ...current,
      id: 'plan_' + Date.now(),
    };
    await storage.set(PLAN_STORAGE_KEY, regenerated);
    return regenerated;
  }
}

export const planService = new PlanService();
