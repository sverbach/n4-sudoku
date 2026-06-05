import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Settings } from '../types';

const SETTINGS_KEY = 'sudoku.settings.v1';

const THEMES = {
  light: {
    '--bg': '#f5f5f0', '--paper': '#f5f5f0', '--ink': '#0a0a0a',
    '--line': '#cdccc4', '--box': '#0a0a0a', '--peer': '#e8e7e0',
    '--faint': '#8a8a82', '--note': '#8f8e86',
    '--selbg': '#0a0a0a', '--selink': '#f5f5f0',
    '--conflictbg': 'rgba(229,52,31,0.12)',
  },
  dark: {
    '--bg': '#0a0a09', '--paper': '#121210', '--ink': '#f1f0ea',
    '--line': '#272720', '--box': '#7d7c72', '--peer': '#1d1d18',
    '--faint': '#6f6e66', '--note': '#73726a',
    '--selbg': '#f1f0ea', '--selink': '#0c0c0b',
    '--conflictbg': 'rgba(229,52,31,0.20)',
  },
} as const;

const SETTINGS_DEFAULTS: Settings = {
  accent: '#e5341f',
  theme: 'light',
  peers: true,
  selectionStyle: 'invert',
  numberFont: 'martian',
};

interface SettingsContextValue {
  settings: Settings;
  updateSetting: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...SETTINGS_DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch { /* ignore */ }
    return SETTINGS_DEFAULTS;
  });

  useEffect(() => {
    const root = document.documentElement;
    const vars = THEMES[settings.theme];
    Object.entries(vars).forEach(([property, cssValue]) => root.style.setProperty(property, cssValue));
    root.style.setProperty('--accent', settings.accent);
    root.style.setProperty('color-scheme', settings.theme === 'dark' ? 'dark' : 'light');
  }, [settings.theme, settings.accent]);

  const updateSetting = useCallback(<Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  }, [settings.theme, updateSetting]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
