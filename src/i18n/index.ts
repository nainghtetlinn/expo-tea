import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import my from "./translations/mm.json";

export const LANGUAGE_STORAGE_KEY = "expoTeaLanguage";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    my: { translation: my },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
