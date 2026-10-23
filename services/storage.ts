import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      return json != null ? (JSON.parse(json) as T) : defaultValue;
    } catch (e) {
      console.warn(`[storage] Error reading key "${key}":`, e);
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.warn(`[storage] Error writing key "${key}":`, e);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Error removing key "${key}":`, e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('[storage] Error clearing storage:', e);
    }
  },
};
