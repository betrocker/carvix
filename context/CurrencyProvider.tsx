import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CurrencyCode = "RSD" | "EUR" | "USD";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  convertCurrency: (amount: number, fromCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "@carvix_currency";

// Prosečni kursevi (ažuriraj periodično ili integruj sa API-jem)
const EXCHANGE_RATES: Record<string, number> = {
  RSD: 1,
  EUR: 117, // 1 EUR = 117 RSD
  USD: 108, // 1 USD = 108 RSD
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("RSD");

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored && ["RSD", "EUR", "USD"].includes(stored)) {
        setCurrencyState(stored as CurrencyCode);
      }
    } catch (error) {
      console.error("Failed to load currency:", error);
    }
  };

  const setCurrency = async (newCurrency: CurrencyCode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error("Failed to save currency:", error);
    }
  };

  // Konvertuje bilo koju valutu u izabranu valutu korisnika
  const convertCurrency = (amount: number, fromCurrency: string): number => {
    if (!amount) return 0;

    const from = fromCurrency.toUpperCase();
    const to = currency;

    if (from === to) return amount;

    // Konvertuj prvo u RSD, pa onda u ciljnu valutu
    const amountInRSD = amount * (EXCHANGE_RATES[from] || 1);
    const convertedAmount = amountInRSD / EXCHANGE_RATES[to];

    return convertedAmount;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
