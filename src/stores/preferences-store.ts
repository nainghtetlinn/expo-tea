import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "@/i18n";

const APP_PREFERENCES_KEY = "app_preferences";

type ThemeMode = "light" | "dark" | "system";
type Language = "en" | "my";

type PreferencesState = {
  theme: ThemeMode;
  language: Language;
  setTheme: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      language: "en",
      setTheme: (mode) => set({ theme: mode }),
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: APP_PREFERENCES_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        i18n.changeLanguage(state?.language || "en");
      },
    },
  ),
);
