// Currency utilities for Kuwait market
export const KWD_CURRENCY = {
  code: 'KWD',
  symbolEn: 'KD',
  symbolAr: 'د.ك',
  name: 'Kuwaiti Dinar',
  nameAr: 'دينار كويتي',
  decimals: 3,
  locale: 'ar-KW'
};

export const formatKWD = (amount: number, locale: 'en' | 'ar' = 'en'): string => {
  if (locale === 'ar') {
    return formatKWDArabic(amount);
  }
  return formatKWDEnglish(amount);
};

export const formatKWDEnglish = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
};

export const formatKWDArabic = (amount: number): string => {
  return new Intl.NumberFormat('ar-KW', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
};

export const formatKWDSimple = (amount: number): string => {
  return `KD ${amount.toFixed(3)}`;
};

export const formatKWDSimpleArabic = (amount: number): string => {
  return `د.ك ${amount.toFixed(3)}`;
};

export const convertToKWD = (usdAmount: number): number => {
  // Current exchange rate (should be fetched from API in production)
  const exchangeRate = 0.307; // 1 USD = 0.307 KWD (approximate)
  return usdAmount * exchangeRate;
};

export const parseKWDAmount = (amountString: string): number => {
  return parseFloat(amountString.replace(/[^\d.-]/g, ''));
};

// Kuwait-specific price validation
export const validateKWDPrice = (price: number): boolean => {
  return price > 0 && price <= 10000; // Max reasonable price in KWD
};

// Format price for display in Kuwait market
export const displayPrice = (price: number, showCurrency = true): string => {
  const formatted = price.toFixed(3);
  return showCurrency ? `KD ${formatted}` : formatted;
};

// Format price for display in Kuwait market (Arabic)
export const displayPriceArabic = (price: number, showCurrency = true): string => {
  const formatted = price.toFixed(3);
  return showCurrency ? `د.ك ${formatted}` : formatted;
};

// Get currency symbol based on locale
export const getCurrencySymbol = (locale: 'en' | 'ar' = 'en'): string => {
  return locale === 'ar' ? KWD_CURRENCY.symbolAr : KWD_CURRENCY.symbolEn;
};