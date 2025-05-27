import React from 'react';
import { PieChart as RechartsChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  colors?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title,
  colors = ['#2E8B57', '#4CAF50', '#8BC34A', '#CDDC39', '#8B4513', '#A0522D'] 
}) => {
  const customColors = colors.length >= data.length 
    ? colors 
    : [...colors, ...Array(data.length - colors.length).fill('#999')];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="font-medium text-gray-900 text-lg mb-2">{title}</h3>
      <div className="flex-grow" style={{ minHeight: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                name,
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#888"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`, '']}
              itemStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};