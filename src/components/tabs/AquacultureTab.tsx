import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FilterBar } from '../ui/FilterBar';
import { DataTable } from '../ui/DataTable';
import { PieChart } from '../charts/PieChart';
import { BarChart } from '../charts/BarChart';

const AquacultureTab: React.FC = () => {
  const { aquaculture, filters } = useData();
  
  // Apply filters to the data
  const filteredData = useMemo(() => {
    return aquaculture.filter(item => {
      if (filters.aquaculture.county !== 'All' && item.county !== filters.aquaculture.county) {
        return false;
      }
      if (filters.aquaculture.subcounty !== 'All' && item.subcounty !== filters.aquaculture.subcounty) {
        return false;
      }
      if (filters.aquaculture.ward !== 'All' && item.ward !== filters.aquaculture.ward) {
        return false;
      }
      return true;
    });
  }, [aquaculture, filters.aquaculture]);

  // Prepare data for summary table
  const aquaSummary = useMemo(() => {
    const summary = filteredData.reduce((acc, item) => {
      const species = item.aquaculture_species;
      
      if (!acc[species]) {
        acc[species] = {
          aquaculture_species: species,
          total_records: 0,
          total_fingerlings: 0,
          average_fingerlings: 0
        };
      }
      
      acc[species].total_records += 1;
      acc[species].total_fingerlings += item.estimated_no_of_fingerlings;
      
      return acc;
    }, {} as Record<string, { 
      aquaculture_species: string; 
      total_records: number; 
      total_fingerlings: number; 
      average_fingerlings: number 
    }>);
    
    // Calculate averages and convert to array
    return Object.values(summary).map(item => ({
      ...item,
      average_fingerlings: Math.round(item.total_fingerlings / item.total_records),
      total_fingerlings: Math.round(item.total_fingerlings)
    })).sort((a, b) => b.total_fingerlings - a.total_fingerlings);
  }, [filteredData]);

  // Prepare data for charts
  const productionSystemData = useMemo(() => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.type_of_production_system] = (acc[item.type_of_production_system] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts)
      .map(system => ({
        type_of_production_system: system,
        count: counts[system]
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  const categoryData = useMemo(() => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.aquaculture_species_category] = (acc[item.aquaculture_species_category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(category => ({
      name: category,
      value: counts[category]
    }));
  }, [filteredData]);

  const aquaColumns = useMemo(
    () => [
      {
        Header: 'Aquaculture Species',
        accessor: 'aquaculture_species',
      },
      {
        Header: 'Total Records',
        accessor: 'total_records',
      },
      {
        Header: 'Total Fingerlings',
        accessor: 'total_fingerlings',
      },
      {
        Header: 'Average Fingerlings',
        accessor: 'average_fingerlings',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <FilterBar category="aquaculture" />
      
      <DataTable 
        columns={aquaColumns} 
        data={aquaSummary} 
        title="Aquaculture Summary Table" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart 
          data={productionSystemData} 
          xKey="type_of_production_system" 
          yKey="count" 
          title="Type of Production System"
          horizontal={true}
          color="#4CAF50"
        />
        <PieChart 
          data={categoryData} 
          title="Aquaculture Species Category" 
          colors={['#2E8B57', '#8B4513', '#4682B4']}
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-medium text-gray-900 text-lg mb-2">Key Insights</h3>
        <div className="prose max-w-none">
          <ul className="list-disc pl-5">
            <li>Total Aquaculture Operations: <strong>{filteredData.length}</strong></li>
            <li>Most Common Species: <strong>{aquaSummary[0]?.aquaculture_species || 'N/A'}</strong></li>
            <li>Total Estimated Fingerlings: <strong>{filteredData.reduce((sum, item) => sum + item.estimated_no_of_fingerlings, 0).toLocaleString()}</strong></li>
            <li>Predominant Production System: <strong>{productionSystemData[0]?.type_of_production_system || 'N/A'}</strong></li>
            <li>Species Category Distribution: {categoryData.map(c => `<strong>${c.name}: ${c.value}</strong> (${Math.round(c.value / filteredData.length * 100)}%)`).join(', ')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AquacultureTab;