import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
  color?: string;
  tooltip?: string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  color = '#2E8B57',
  tooltip = '',
  horizontal = false,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="font-medium text-gray-900 text-lg mb-2">{title}</h3>
      <div className="flex-grow" style={{ minHeight: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {horizontal ? (
            <RechartsBarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey={xKey} 
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: any) => [value, tooltip || yKey]}
                itemStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
              />
              <Bar dataKey={yKey} fill={color} radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          ) : (
            <RechartsBarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [value, tooltip || yKey]}
                itemStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
              />
              <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};