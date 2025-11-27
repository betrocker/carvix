// context/LanguageProvider.tsx
import * as Localization from "expo-localization";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import i18n, {
  DEFAULT_LANGUAGE,
  getSavedLanguage,
  LanguageCode,
  setAppLanguage,
} from "@/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) prvo probaj ono što je korisnik već izabrao ranije
        const saved = await getSavedLanguage();

        let lang: LanguageCode;

        if (saved) {
          lang = saved;
        } else {
          // 2) ako nema sačuvan jezik, uzmi sistemski
          const locale = Localization.getLocales?.()[0];
          const code = locale?.languageCode?.toLowerCase();

          // sve što je naš region tretiramo kao srpski
          if (code === "sr" || code === "bs" || code === "hr") {
            lang = "sr";
          } else {
            lang = "en";
          }
        }

        await i18n.changeLanguage(lang);
        setLanguageState(lang);
      } catch (e) {
        console.log("LanguageProvider init error:", e);
        // fallback na default
        await i18n.changeLanguage(DEFAULT_LANGUAGE);
        setLanguageState(DEFAULT_LANGUAGE);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSetLanguage = async (lang: LanguageCode) => {
    setLanguageState(lang);
    await setAppLanguage(lang); // ovde se i i18n.changeLanguage i AsyncStorage rade
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
