import React from 'react';
import { motion } from 'framer-motion';

interface ValueBoxProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'amber' | 'indigo';
}

export const ValueBox: React.FC<ValueBoxProps> = ({ 
  title, 
  value, 
  icon,
  color = 'green'
}) => {
  const colorClasses = {
    green: 'bg-green-600 text-white shadow-green-200',
    blue: 'bg-blue-600 text-white shadow-blue-200',
    amber: 'bg-amber-600 text-white shadow-amber-200',
    indigo: 'bg-indigo-600 text-white shadow-indigo-200',
  };

  return (
    <motion.div 
      className={`rounded-lg shadow-lg ${colorClasses[color]} overflow-hidden`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
        <div>
          <dt className="text-sm font-medium truncate">
            {title}
          </dt>
          <dd className="mt-1 text-3xl font-semibold">
            {value}
          </dd>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};