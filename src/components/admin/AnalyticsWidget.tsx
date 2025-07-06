import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatKWD } from '../../utils/currency';

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change?: {
    type: 'increase' | 'decrease';
    value: string;
    period?: string;
  };
  icon: React.ElementType;
  color: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  isCurrency = false,
  isPercentage = false
}) => {
  const formattedValue = isCurrency 
    ? formatKWD(typeof value === 'string' ? parseFloat(value) : value)
    : isPercentage
      ? `${value}%`
      : value;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {change.type === 'increase' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ml-1 ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.value}
          </span>
          {change.period && (
            <span className="text-sm text-gray-500 ml-1">{change.period}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;