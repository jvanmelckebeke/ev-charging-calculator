const STORAGE_KEY = 'ev-charging-calc-settings';

export interface Settings {
  efficiency: number;
  darkMode: 'system' | 'light' | 'dark';
}

const DEFAULT_SETTINGS: Settings = {
  efficiency: 0.9,
  darkMode: 'system',
};

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (_) {
    void _;
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (_) {
    void _;
  }
}

export function getDefaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS };
}
