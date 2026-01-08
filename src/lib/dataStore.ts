// Simple data storage utility for admin panel
// In production, this would be replaced with a proper backend API

const STORAGE_KEYS = {
  HERO: 'ecr_hero_data',
  STATS: 'ecr_stats_data',
  ABOUT: 'ecr_about_data',
  COURSES: 'ecr_courses_data',
  TESTIMONIALS: 'ecr_testimonials_data',
  BLOG: 'ecr_blog_data',
  CONTACT: 'ecr_contact_data',
  CAREERS: 'ecr_careers_data',
  ADMISSION: 'ecr_admission_data'
};

export interface StorageData {
  [STORAGE_KEYS.HERO]: any;
  [STORAGE_KEYS.STATS]: any;
  [STORAGE_KEYS.ABOUT]: any;
  [STORAGE_KEYS.COURSES]: any;
  [STORAGE_KEYS.TESTIMONIALS]: any;
  [STORAGE_KEYS.BLOG]: any;
  [STORAGE_KEYS.CONTACT]: any;
  [STORAGE_KEYS.CAREERS]: any;
  [STORAGE_KEYS.ADMISSION]: any;
}

class DataStore {
  // Save data to localStorage
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  // Load data from localStorage
  load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return defaultValue;
    }
  }

  // Remove data from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  }

  // Clear all stored data
  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Export all data as JSON
  export(): string {
    const data: Partial<StorageData> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = localStorage.getItem(key);
      if (value) {
        data[key as keyof StorageData] = JSON.parse(value);
      }
    });
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const dataStore = new DataStore();
export { STORAGE_KEYS };
