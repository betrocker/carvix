// i18n/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import sr from "./locales/sr.json";

export type LanguageCode = "en" | "sr";
const STORAGE_KEY = "carvix.language";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    sr: { translation: sr }
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

// helper da promenimo jezik + sačuvamo ga
export async function setAppLanguage(lang: LanguageCode) {
  await AsyncStorage.setItem(STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export async function getSavedLanguage(): Promise<LanguageCode | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "sr") return stored;
  return null;
}

export default i18n;
