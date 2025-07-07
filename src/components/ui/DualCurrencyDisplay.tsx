import React from 'react';
import { formatKWDEnglish, formatKWDArabic } from '../../utils/currency';

interface DualCurrencyDisplayProps {
  amount: number;
  primaryLocale?: 'en' | 'ar';
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}

/**
 * A component that displays currency in both English and Arabic formats
 * with customizable styling and order
 */
const DualCurrencyDisplay: React.FC<DualCurrencyDisplayProps> = ({
  amount,
  primaryLocale = 'en',
  className = '',
  primaryClassName = 'text-lg font-bold',
  secondaryClassName = 'text-sm text-gray-600'
}) => {
  const primaryFormat = primaryLocale === 'en' 
    ? formatKWDEnglish(amount) 
    : formatKWDArabic(amount);
    
  const secondaryFormat = primaryLocale === 'en' 
    ? formatKWDArabic(amount) 
    : formatKWDEnglish(amount);

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={primaryClassName}>{primaryFormat}</span>
      <span className={secondaryClassName}>{secondaryFormat}</span>
    </div>
  );
};

export default DualCurrencyDisplay;