import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatKWDEnglish } from '../../utils/currency';

interface ChartWidgetProps {
  title: string;
  icon: React.ElementType;
  type: 'line' | 'bar' | 'pie';
  data: any[];
  dataKeys: string[];
  colors?: string[];
  height?: number;
  isCurrency?: boolean;
  xAxisKey?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string, props: any) => any;
  labelFormatter?: (value: any) => string;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  icon: Icon,
  type,
  data,
  dataKeys,
  colors = ['#1E40AF', '#10B981', '#7C3AED', '#DB2777', '#F59E0B'],
  height = 300,
  isCurrency = false,
  xAxisKey = 'name',
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  labelFormatter
}) => {
  const defaultTooltipFormatter = (value: any, name: string) => {
    if (isCurrency) return formatKWDEnglish(value);
    return value;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxisKey} 
                tickFormatter={xAxisFormatter}
              />
              <YAxis tickFormatter={yAxisFormatter} />
              <Tooltip 
                formatter={tooltipFormatter || defaultTooltipFormatter}
                labelFormatter={labelFormatter}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxisKey} 
                tickFormatter={xAxisFormatter}
              />
              <YAxis tickFormatter={yAxisFormatter} />
              <Tooltip 
                formatter={tooltipFormatter || defaultTooltipFormatter}
                labelFormatter={labelFormatter}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
                nameKey={xAxisKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={tooltipFormatter || defaultTooltipFormatter}
                labelFormatter={labelFormatter}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      
      {renderChart()}
    </div>
  );
};

export default ChartWidget;