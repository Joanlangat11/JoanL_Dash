import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
  color?: string;
  tooltip?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  color = '#2E8B57',
  tooltip = '',
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="font-medium text-gray-900 text-lg mb-2">{title}</h3>
      <div className="flex-grow" style={{ minHeight: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} />
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
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};