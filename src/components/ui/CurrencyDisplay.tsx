import React, { useState } from 'react';
import { formatKWD, formatKWDEnglish, formatKWDArabic } from '../../utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  showBothLanguages?: boolean;
  defaultLocale?: 'en' | 'ar';
  className?: string;
  allowToggle?: boolean;
}

/**
 * A component for displaying KWD currency in Arabic and/or English format
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  showBothLanguages = false,
  defaultLocale = 'en',
  className = '',
  allowToggle = false
}) => {
  const [locale, setLocale] = useState<'en' | 'ar'>(defaultLocale);

  const toggleLocale = () => {
    if (allowToggle) {
      setLocale(locale === 'en' ? 'ar' : 'en');
    }
  };

  if (showBothLanguages) {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className="font-bold">{formatKWDEnglish(amount)}</span>
        <span className="text-sm text-gray-600">{formatKWDArabic(amount)}</span>
      </div>
    );
  }

  return (
    <div 
      className={`${className} ${allowToggle ? 'cursor-pointer' : ''}`}
      onClick={toggleLocale}
    >
      {formatKWD(amount, locale)}
    </div>
  );
};

export default CurrencyDisplay;