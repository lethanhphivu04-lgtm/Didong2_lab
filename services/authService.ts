import { User } from '../types';
import { IAuthService } from './interfaces';
import { storage } from './storage';

const CURRENT_USER_KEY = '@fitness_current_user';
const USERS_DB_KEY = '@fitness_users_db';

export const DEMO_USER: User = {
  id: 'user_demo',
  email: 'ban@email.com',
  fullName: 'Nguyễn Văn A',
  createdAt: '2026-01-01T00:00:00.000Z',
};

interface StoredUser extends User {
  password?: string;
}

export class AuthService implements IAuthService {
  private async getUsersDb(): Promise<StoredUser[]> {
    const users = await storage.get<StoredUser[]>(USERS_DB_KEY, []);
    if (!users || users.length === 0) {
      const initialUsers: StoredUser[] = [
        {
          ...DEMO_USER,
          password: '12345678',
        },
      ];
      await storage.set(USERS_DB_KEY, initialUsers);
      return initialUsers;
    }
    return users;
  }

  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>(CURRENT_USER_KEY, null);
  }

  async login(email: string, _password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const users = await this.getUsersDb();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (found) {
      const sessionUser: User = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        createdAt: found.createdAt,
      };
      await storage.set(CURRENT_USER_KEY, sessionUser);
      return sessionUser;
    }

    // Nếu email chưa có trong DB, tự động đăng ký tài khoản mới thuận tiện demo
    const namePart = cleanEmail.split('@')[0];
    const generatedName =
      namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const newUser: StoredUser = {
      id: 'user_' + Date.now(),
      email: cleanEmail,
      fullName: generatedName,
      password: _password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await storage.set(USERS_DB_KEY, users);

    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      createdAt: newUser.createdAt,
    };
    await storage.set(CURRENT_USER_KEY, sessionUser);
    return sessionUser;
  }

  async register(fullName: string, email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const users = await this.getUsersDb();

    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      // Cập nhật thông tin tài khoản hiện có
      users[existingIndex].fullName = cleanName;
      users[existingIndex].password = password;
      await storage.set(USERS_DB_KEY, users);

      const sessionUser: User = {
        id: users[existingIndex].id,
        email: users[existingIndex].email,
        fullName: cleanName,
        createdAt: users[existingIndex].createdAt,
      };
      await storage.set(CURRENT_USER_KEY, sessionUser);
      return sessionUser;
    }

    const newUser: StoredUser = {
      id: 'user_' + Date.now(),
      email: cleanEmail,
      fullName: cleanName,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await storage.set(USERS_DB_KEY, users);

    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      createdAt: newUser.createdAt,
    };
    await storage.set(CURRENT_USER_KEY, sessionUser);
    return sessionUser;
  }

  async logout(): Promise<void> {
    await storage.remove(CURRENT_USER_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

export const authService = new AuthService();
