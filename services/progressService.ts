import { ProgressStats } from '../types';
import { IProgressService } from './interfaces';
import { storage } from './storage';

const WEIGHT_STORAGE_KEY = '@fitness_weight_history';

const DEFAULT_PROGRESS: ProgressStats = {
  currentWeightKg: 65.0,
  weightChangeKg: -2.4,
  completedWorkoutsCount: 14,
  currentStreakDays: 5,
  weightHistory: [
    { id: 'w1', date: 'Tuần 1', weightKg: 67.4 },
    { id: 'w4', date: 'Tuần 4', weightKg: 66.0 },
    { id: 'w7', date: 'Tuần 7', weightKg: 65.0 },
  ],
  recentLogs: [
    {
      id: 'log_recent_1',
      workoutId: 'workout_today',
      workoutTitle: 'Chân và Core',
      completedAt: 'Hôm qua',
      durationMinutes: 26,
      caloriesBurned: 195,
      totalReps: 108,
      postureScore: 86,
      exerciseScores: [
        { exerciseId: 'squat', exerciseName: 'Squat', score: 88 },
        { exerciseId: 'plank', exerciseName: 'Plank', score: 90 },
        { exerciseId: 'lunge', exerciseName: 'Lunge', score: 80 },
      ],
    },
    {
      id: 'log_recent_2',
      workoutId: 'workout_upper',
      workoutTitle: 'Thân trên',
      completedAt: 'Thứ 4',
      durationMinutes: 44,
      caloriesBurned: 240,
      totalReps: 120,
      postureScore: 82,
      exerciseScores: [
        { exerciseId: 'push-up', exerciseName: 'Push-up', score: 85 },
        { exerciseId: 'deadlift', exerciseName: 'Deadlift', score: 80 },
      ],
    },
  ],
};

export class ProgressService implements IProgressService {
  async getProgressStats(_range?: string): Promise<ProgressStats> {
    const saved = await storage.get<ProgressStats>(WEIGHT_STORAGE_KEY);
    return saved || DEFAULT_PROGRESS;
  }

  async addWeightEntry(weightKg: number): Promise<void> {
    const stats = await this.getProgressStats();
    stats.currentWeightKg = weightKg;
    stats.weightHistory.push({
      id: 'w_' + Date.now(),
      date: 'Hôm nay',
      weightKg,
    });
    await storage.set(WEIGHT_STORAGE_KEY, stats);
  }
}

export const progressService = new ProgressService();
