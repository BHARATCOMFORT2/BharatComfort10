"use client";

import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18nContext } from "@/lib/i18n";
import { CurrencyContext } from "@/context/CurrencyContext";

const LOCALE_KEY = "preferred_locale";
const CURRENCY_KEY = "preferred_currency";

export function useLocale() {
  const { locale, setLocale: setI18nLocale, t } = useContext(I18nContext);
  const { currency, setCurrency: setCtxCurrency, convert } = useContext(CurrencyContext);
  const router = useRouter();
  const pathname = usePathname();

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    const savedCurrency = localStorage.getItem(CURRENCY_KEY);

    if (savedLocale && savedLocale !== locale) {
      setI18nLocale(savedLocale);
    }
    if (savedCurrency && savedCurrency !== currency) {
      setCtxCurrency(savedCurrency);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    setI18nLocale(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);

    // Replace locale in URL: /en/... → /fr/...
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const changeCurrency = (newCurrency: string) => {
    setCtxCurrency(newCurrency);
    localStorage.setItem(CURRENCY_KEY, newCurrency);
  };

  return {
    locale,
    setLocale: changeLocale,
    t, // translator
    currency,
    setCurrency: changeCurrency,
    convert, // currency converter
  };
}
