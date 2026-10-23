import { Exercise, Workout, WorkoutLog } from '../types';
import { IWorkoutService } from './interfaces';
import { MOCK_EXERCISES, MOCK_TODAY_WORKOUT } from '../mocks/mockData';
import { storage } from './storage';

const WORKOUT_LOGS_KEY = '@fitness_workout_logs';

export class WorkoutService implements IWorkoutService {
  async getAllExercises(): Promise<Exercise[]> {
    return MOCK_EXERCISES;
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const found = MOCK_EXERCISES.find((e) => e.id === id);
    return found || null;
  }

  async searchExercises(query: string, muscleGroup?: string): Promise<Exercise[]> {
    return MOCK_EXERCISES.filter((e) => {
      const matchesQuery =
        !query ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.muscleGroupDisplay.toLowerCase().includes(query.toLowerCase());

      const matchesGroup =
        !muscleGroup || muscleGroup === 'all' || e.muscleGroup === muscleGroup;

      return matchesQuery && matchesGroup;
    });
  }

  async getTodayWorkout(): Promise<Workout | null> {
    return MOCK_TODAY_WORKOUT;
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    if (id === 'workout_today' || id === MOCK_TODAY_WORKOUT.id) {
      return MOCK_TODAY_WORKOUT;
    }
    return MOCK_TODAY_WORKOUT;
  }

  async saveWorkoutLog(log: Omit<WorkoutLog, 'id'>): Promise<WorkoutLog> {
    const logs = (await storage.get<WorkoutLog[]>(WORKOUT_LOGS_KEY, [])) || [];
    const newLog: WorkoutLog = {
      ...log,
      id: 'log_' + Date.now(),
    };
    logs.unshift(newLog);
    await storage.set(WORKOUT_LOGS_KEY, logs);
    return newLog;
  }

  async getWorkoutHistory(): Promise<WorkoutLog[]> {
    return (await storage.get<WorkoutLog[]>(WORKOUT_LOGS_KEY, [])) || [];
  }
}

export const workoutService = new WorkoutService();
