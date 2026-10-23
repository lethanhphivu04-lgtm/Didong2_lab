import { User } from '../types';
import { IAuthService } from './interfaces';
import { storage } from './storage';

const USER_STORAGE_KEY = '@fitness_current_user';

export class AuthService implements IAuthService {
  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>(USER_STORAGE_KEY, null);
  }

  async login(email: string, _password: string): Promise<User> {
    // Giai đoạn 1: Mock auth & lưu AsyncStorage
    const existing = await this.getCurrentUser();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      return existing;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      email,
      fullName: 'Nguyễn Văn A',
      createdAt: new Date().toISOString(),
    };
    await storage.set(USER_STORAGE_KEY, newUser);
    return newUser;
  }

  async register(fullName: string, email: string, _password: string): Promise<User> {
    const newUser: User = {
      id: 'user_' + Date.now(),
      email,
      fullName,
      createdAt: new Date().toISOString(),
    };
    await storage.set(USER_STORAGE_KEY, newUser);
    return newUser;
  }

  async logout(): Promise<void> {
    await storage.remove(USER_STORAGE_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

export const authService = new AuthService();
