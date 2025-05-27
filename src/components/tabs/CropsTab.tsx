import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FilterBar } from '../ui/FilterBar';
import { DataTable } from '../ui/DataTable';
import { PieChart } from '../charts/PieChart';
import { BarChart } from '../charts/BarChart';

const CropsTab: React.FC = () => {
  const { crops, filters } = useData();
  
  // Apply filters to the data
  const filteredData = useMemo(() => {
    return crops.filter(crop => {
      if (filters.crops.county !== 'All' && crop.county !== filters.crops.county) {
        return false;
      }
      if (filters.crops.subcounty !== 'All' && crop.subcounty !== filters.crops.subcounty) {
        return false;
      }
      if (filters.crops.ward !== 'All' && crop.ward !== filters.crops.ward) {
        return false;
      }
      return true;
    });
  }, [crops, filters.crops]);

  // Prepare data for summary table
  const cropSummary = useMemo(() => {
    const summary = filteredData.reduce((acc, crop) => {
      const cropName = crop.crop_name;
      
      if (!acc[cropName]) {
        acc[cropName] = {
          crop_name: cropName,
          total_records: 0,
          total_acreage: 0,
          average_acreage: 0
        };
      }
      
      acc[cropName].total_records += 1;
      acc[cropName].total_acreage += crop.acreage;
      
      return acc;
    }, {} as Record<string, { crop_name: string; total_records: number; total_acreage: number; average_acreage: number }>);
    
    // Calculate averages and convert to array
    return Object.values(summary).map(item => ({
      ...item,
      average_acreage: Math.round(item.total_acreage / item.total_records),
      total_acreage: Math.round(item.total_acreage)
    })).sort((a, b) => b.total_acreage - a.total_acreage);
  }, [filteredData]);

  // Prepare data for charts
  const waterSourceData = useMemo(() => {
    const counts = filteredData.reduce((acc, crop) => {
      acc[crop.water_source] = (acc[crop.water_source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(source => ({
      name: source,
      value: counts[source]
    }));
  }, [filteredData]);

  const productionSystemData = useMemo(() => {
    const counts = filteredData.reduce((acc, crop) => {
      acc[crop.production_system] = (acc[crop.production_system] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(system => ({
      production_system: system,
      count: counts[system]
    }));
  }, [filteredData]);

  const purposeData = useMemo(() => {
    const counts = filteredData.reduce((acc, crop) => {
      acc[crop.purpose] = (acc[crop.purpose] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(purpose => ({
      name: purpose,
      value: counts[purpose]
    }));
  }, [filteredData]);

  const seedsData = useMemo(() => {
    const counts = {
      'Yes': filteredData.filter(crop => crop.use_of_certified_seeds === 1).length,
      'No': filteredData.filter(crop => crop.use_of_certified_seeds === 0).length
    };

    return Object.keys(counts).map(label => ({
      name: label,
      value: counts[label as keyof typeof counts]
    }));
  }, [filteredData]);

  const cropColumns = useMemo(
    () => [
      {
        Header: 'Crop Name',
        accessor: 'crop_name',
      },
      {
        Header: 'Total Records',
        accessor: 'total_records',
      },
      {
        Header: 'Total Acreage',
        accessor: 'total_acreage',
      },
      {
        Header: 'Average Acreage',
        accessor: 'average_acreage',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <FilterBar category="crops" />
      
      <DataTable 
        columns={cropColumns} 
        data={cropSummary} 
        title="Crops Summary Table" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={waterSourceData} title="Water Source" />
        <BarChart 
          data={productionSystemData} 
          xKey="production_system" 
          yKey="count" 
          title="Production System"
          horizontal={true}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={purposeData} title="Purpose" />
        <PieChart data={seedsData} title="Use of Certified Seeds" />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-medium text-gray-900 text-lg mb-2">Key Insights</h3>
        <div className="prose max-w-none">
          <ul className="list-disc pl-5">
            <li>Total Crops Recorded: <strong>{filteredData.length}</strong></li>
            <li>Most Common Crop: <strong>{cropSummary[0]?.crop_name || 'N/A'}</strong> with <strong>{cropSummary[0]?.total_records || 0}</strong> records</li>
            <li>Total Acreage Under Cultivation: <strong>{Math.round(filteredData.reduce((sum, crop) => sum + crop.acreage, 0))}</strong> acres</li>
            <li>Predominant Water Source: <strong>{waterSourceData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}</strong></li>
            <li>Certified Seeds Usage: <strong>{Math.round((seedsData.find(d => d.name === 'Yes')?.value || 0) / filteredData.length * 100)}%</strong> of farmers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CropsTab;