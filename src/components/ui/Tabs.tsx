import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-4 md:space-x-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 relative 
                font-medium text-sm md:text-base transition-colors duration-200
                ${isActive 
                  ? 'text-green-700 border-green-700' 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'}
              `}
            >
              <span className="flex items-center">
                {tab.icon && (
                  <span className={`mr-2 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};