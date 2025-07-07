# Kuwait Currency Display Guide

## Overview

This guide explains how to properly display Kuwaiti Dinar (KWD) currency in both Arabic and English formats in the LAKKI PHONES application.

## Currency Specifications

- **Code**: KWD
- **English Symbol**: KD
- **Arabic Symbol**: د.ك
- **English Name**: Kuwaiti Dinar
- **Arabic Name**: دينار كويتي
- **Decimal Places**: 3 (important: KWD uses 3 decimal places, unlike most currencies that use 2)
- **Locale**: ar-KW

## Usage Examples

### Basic Formatting

```typescript
import { formatKWD, formatKWDArabic, formatKWDEnglish } from '../utils/currency';

// Format with default locale (English)
const priceEn = formatKWD(10.500); // "KD 10.500"

// Format with Arabic locale
const priceAr = formatKWD(10.500, 'ar'); // "د.ك 10.500"

// Direct formatting functions
const priceEnDirect = formatKWDEnglish(10.500); // "KD 10.500"
const priceArDirect = formatKWDArabic(10.500); // "د.ك 10.500"
```

### Simple Formatting (Without Intl)

```typescript
import { formatKWDSimple, formatKWDSimpleArabic } from '../utils/currency';

// Simple English format
const simpleEn = formatKWDSimple(10.500); // "KD 10.500"

// Simple Arabic format
const simpleAr = formatKWDSimpleArabic(10.500); // "د.ك 10.500"
```

### Getting Currency Symbols

```typescript
import { getCurrencySymbol } from '../utils/currency';

// Get English symbol
const symbolEn = getCurrencySymbol('en'); // "KD"

// Get Arabic symbol
const symbolAr = getCurrencySymbol('ar'); // "د.ك"
```

## Implementation in Components

### React Component Example

```tsx
import React, { useState } from 'react';
import { formatKWD } from '../utils/currency';

interface PriceDisplayProps {
  amount: number;
  showCurrency?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  amount, 
  showCurrency = true 
}) => {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  
  return (
    <div>
      <div className="price">
        {formatKWD(amount, locale)}
      </div>
      <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
        Toggle Language
      </button>
    </div>
  );
};

export default PriceDisplay;
```

### Dual Language Display

```tsx
import React from 'react';
import { formatKWDEnglish, formatKWDArabic } from '../utils/currency';

interface DualPriceDisplayProps {
  amount: number;
}

const DualPriceDisplay: React.FC<DualPriceDisplayProps> = ({ amount }) => {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold">{formatKWDEnglish(amount)}</span>
      <span className="text-sm text-gray-600">{formatKWDArabic(amount)}</span>
    </div>
  );
};

export default DualPriceDisplay;
```

## Database Integration

The database includes functions to format currency in both Arabic and English:

- `format_currency_ar(amount)` - Returns the amount formatted in Arabic
- `format_currency_en(amount)` - Returns the amount formatted in English
- `get_currency_symbol(locale)` - Returns the currency symbol based on locale

Example SQL query:

```sql
SELECT 
  id, 
  name, 
  price, 
  format_currency_en(price) as price_en,
  format_currency_ar(price) as price_ar
FROM products
WHERE price > 100;
```

## Best Practices

1. **Always use 3 decimal places** for KWD currency
2. **Provide language options** for users to choose their preferred display format
3. **Use the correct symbol** (KD for English, د.ك for Arabic)
4. **Consider RTL layout** when displaying Arabic currency
5. **Format numbers appropriately** with thousands separators
6. **Store currency values** as numeric in the database, not as formatted strings
7. **Format only for display** at the presentation layer

## Troubleshooting

- If numbers appear with incorrect decimal places, ensure you're using the correct formatting function with 3 decimal places
- For RTL issues with Arabic display, ensure proper CSS direction properties are set
- If currency symbols appear as squares or missing characters, ensure proper font support for Arabic characters