import { describe, it, expect } from 'vitest';
import {
  formatKWD,
  formatKWDEnglish,
  formatKWDArabic,
  convertToKWD,
  KWD_CURRENCY
} from './currency';

describe('Currency Utilities', () => {
  describe('KWD_CURRENCY constant', () => {
    it('should have correct properties for KWD', () => {
      expect(KWD_CURRENCY.code).toBe('KWD');
      expect(KWD_CURRENCY.decimals).toBe(3);
      expect(KWD_CURRENCY.symbolEn).toBe('KD');
      expect(KWD_CURRENCY.symbolAr).toBe('د.ك');
    });
  });

  describe('formatKWDEnglish', () => {
    it('should format numbers to KWD string with 3 decimal places and KD symbol', () => {
      // Note: Intl.NumberFormat can vary slightly based on Node/browser ICU data.
      // These tests assume a common ICU version.
      // The exact space before/after KD might differ or be non-breaking.
      // For more robustness, one might check for presence of "KD", the number, and 3 decimal points separately.
      expect(formatKWDEnglish(10.5)).toMatch(/KWD\s*10\.500/); // Using regex to account for potential space variations
      expect(formatKWDEnglish(12345.678)).toMatch(/KWD\s*12,345\.678/);
      expect(formatKWDEnglish(0.1)).toMatch(/KWD\s*0\.100/);
      expect(formatKWDEnglish(100)).toMatch(/KWD\s*100\.000/);
    });
  });

  describe('formatKWDArabic', () => {
    it('should format numbers to KWD string in Arabic locale', () => {
      // Similar to English, exact output can vary. Focus on key elements.
      // Expecting Arabic numerals and the Arabic KWD symbol.
      // Example: ١٠٫٥٠٠ د.ك (may vary based on locale data for ar-KW)
      // This is harder to test precisely without knowing the exact output of Intl on the test runner.
      // A snapshot test or more complex regex might be needed for ar-KW.
      // For simplicity, we check for the Arabic symbol and that it's not the English one.
      const formatted = formatKWDArabic(10.5);
      expect(formatted).toContain(KWD_CURRENCY.symbolAr);
      expect(formatted).not.toContain(KWD_CURRENCY.symbolEn);
      expect(formatted).toMatch(/٫٥٠٠/); // Check for ".500" with Arabic numeral ٥
    });
  });

  describe('formatKWD', () => {
    it('should default to English formatting', () => {
      expect(formatKWD(20.75)).toMatch(/KWD\s*20\.750/);
    });
    it('should use English formatting when specified', () => {
      expect(formatKWD(20.75, 'en')).toMatch(/KWD\s*20\.750/);
    });
    it('should use Arabic formatting when specified', () => {
      const formatted = formatKWD(20.75, 'ar');
      expect(formatted).toContain(KWD_CURRENCY.symbolAr);
      expect(formatted).toMatch(/٫٧٥٠/); // Check for ".750" with Arabic numerals
    });
  });

  describe('convertToKWD', () => {
    it('should convert USD to KWD using a static exchange rate', () => {
      const usdAmount = 100;
      const expectedKWDRate = 0.307; // As per current static rate in currency.ts
      expect(convertToKWD(usdAmount)).toBeCloseTo(usdAmount * expectedKWDRate, 3);
      expect(convertToKWD(0)).toBe(0);
      expect(convertToKWD(1)).toBeCloseTo(expectedKWDRate);
    });
  });
});
