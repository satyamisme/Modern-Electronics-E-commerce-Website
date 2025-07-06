import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  presets?: {
    label: string;
    value: 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';
  }[];
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  presets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'week' },
    { label: 'Last 30 days', value: 'month' },
    { label: 'This year', value: 'year' },
    { label: 'Custom', value: 'custom' }
  ],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('week');

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = now;
    
    switch (preset) {
      case 'today':
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date();
        start.setDate(start.getDate() - 30);
        break;
      case 'year':
        start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'custom':
        // Don't change dates, just open the picker
        setIsOpen(true);
        return;
      default:
        break;
    }
    
    onChange(start, end);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!startDate) return 'Select date range';
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left w-full"
        >
          {formatDateRange()}
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute mt-2 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200 w-80">
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedPreset === preset.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => onChange(date, endDate)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                dateFormat="MMM d, yyyy"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">End Date</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => onChange(startDate, date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;