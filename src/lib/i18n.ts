// src/lib/i18n.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  try {
    return {
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.warn(`⚠️ No messages found for locale "${locale}", falling back to en`);
    return {
      messages: (await import("../../messages/en.json")).default
    };
  }
});

export const i18nConfig = {
  locales: ["en", "hi", "fr", "es", "de", "ja", "zh", "ar"],
  defaultLocale: "en"
};
