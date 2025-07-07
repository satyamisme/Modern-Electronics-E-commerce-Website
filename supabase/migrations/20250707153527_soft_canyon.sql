/*
  # Add Currency Display Options

  1. New Functions
    - `format_currency_ar` - Format currency in Arabic
    - `format_currency_en` - Format currency in English
    - `get_currency_symbol` - Get currency symbol based on locale

  2. Updates
    - Add support for both Arabic and English currency display
*/

-- Function to format currency in Arabic
CREATE OR REPLACE FUNCTION format_currency_ar(amount numeric)
RETURNS text AS $$
BEGIN
  RETURN 'د.ك ' || to_char(amount, 'FM999,999,990.000');
END;
$$ LANGUAGE plpgsql;

-- Function to format currency in English
CREATE OR REPLACE FUNCTION format_currency_en(amount numeric)
RETURNS text AS $$
BEGIN
  RETURN 'KD ' || to_char(amount, 'FM999,999,990.000');
END;
$$ LANGUAGE plpgsql;

-- Function to get currency symbol based on locale
CREATE OR REPLACE FUNCTION get_currency_symbol(locale text)
RETURNS text AS $$
BEGIN
  IF locale = 'ar' THEN
    RETURN 'د.ك';
  ELSE
    RETURN 'KD';
  END IF;
END;
$$ LANGUAGE plpgsql;