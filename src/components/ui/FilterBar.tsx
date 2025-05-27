import React from 'react';
import { useData } from '../../context/DataContext';

interface FilterBarProps {
  category: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ category }) => {
  const { 
    filters, 
    updateFilter, 
    countyOptions, 
    subcountyOptions, 
    wardOptions 
  } = useData();

  const currentFilters = filters[category as keyof typeof filters];
  const currentSubcountyOptions = subcountyOptions[category as keyof typeof subcountyOptions];
  const currentWardOptions = wardOptions[category as keyof typeof wardOptions];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor={`${category}-county`} className="block text-sm font-medium text-gray-700 mb-1">
          Select County
        </label>
        <select
          id={`${category}-county`}
          value={currentFilters.county}
          onChange={(e) => updateFilter(category, 'county', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white py-2 px-3 text-gray-900 border"
        >
          <option value="All">All Counties</option>
          {countyOptions.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor={`${category}-subcounty`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Subcounty
        </label>
        <select
          id={`${category}-subcounty`}
          value={currentFilters.subcounty}
          onChange={(e) => updateFilter(category, 'subcounty', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white py-2 px-3 text-gray-900 border"
          disabled={currentFilters.county === 'All'}
        >
          <option value="All">All Subcounties</option>
          {currentSubcountyOptions.filter(sc => sc !== 'All').map(subcounty => (
            <option key={subcounty} value={subcounty}>{subcounty}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor={`${category}-ward`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Ward
        </label>
        <select
          id={`${category}-ward`}
          value={currentFilters.ward}
          onChange={(e) => updateFilter(category, 'ward', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white py-2 px-3 text-gray-900 border"
          disabled={currentFilters.subcounty === 'All'}
        >
          <option value="All">All Wards</option>
          {currentWardOptions.filter(w => w !== 'All').map(ward => (
            <option key={ward} value={ward}>{ward}</option>
          ))}
        </select>
      </div>
    </div>
  );
};