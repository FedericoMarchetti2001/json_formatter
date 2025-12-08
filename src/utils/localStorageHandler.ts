// Centralized localStorage handler for achievements, preferences, and page content

type Achievements = {
  unlocked: string[];
  images: string[];
};

type Preferences = {
  tabSpaces?: number;
  enablePlaySound?: boolean;
  enableAIVoice?: boolean;
  formatClickCount?: number;
  [key: string]: any;
};

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'jsonFormatterAchievements',
  PREFERENCES: 'jsonFormatterPreferences',
  PAGE_CONTENT_PREFIX: 'jsonFormatterPageContent_', // + page key
};

const localStorageHandler = {
  // Achievements
  getAchievements(): Achievements | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading achievements from localStorage:', e);
      return null;
    }
  },
  setAchievements(achievements: Achievements) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements to localStorage:', e);
    }
  },
  removeAchievements() {
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  },

  // Preferences (tabSpaces, audio, etc.)
  getPreferences(): Preferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading preferences from localStorage:', e);
      return {};
    }
  },
  setPreferences(preferences: Preferences) {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (e) {
      console.error('Error saving preferences to localStorage:', e);
    }
  },
  updatePreference(key: string, value: any) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    this.setPreferences(prefs);
  },
  removePreferences() {
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  // Page content (by page key)
  getPageContent<T = any>(pageKey: string): T | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAGE_CONTENT_PREFIX + pageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading page content from localStorage:', e);
      return null;
    }
  },
  setPageContent<T = any>(pageKey: string, content: T) {
    try {
      localStorage.setItem(STORAGE_KEYS.PAGE_CONTENT_PREFIX + pageKey, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving page content to localStorage:', e);
    }
  },
  removePageContent(pageKey: string) {
    localStorage.removeItem(STORAGE_KEYS.PAGE_CONTENT_PREFIX + pageKey);
  }
};

export default localStorageHandler;