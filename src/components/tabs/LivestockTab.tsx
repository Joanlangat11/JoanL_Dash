import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FilterBar } from '../ui/FilterBar';
import { ValueBox } from '../ui/ValueBox';
import { DataTable } from '../ui/DataTable';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { Cog as Cow, Scale as Male, Scale as Female } from 'lucide-react';

const LivestockTab: React.FC = () => {
  const { livestock, filters } = useData();
  
  // Apply filters to the data
  const filteredData = useMemo(() => {
    return livestock.filter(item => {
      if (filters.livestock.county !== 'All' && item.county !== filters.livestock.county) {
        return false;
      }
      if (filters.livestock.subcounty !== 'All' && item.subcounty !== filters.livestock.subcounty) {
        return false;
      }
      if (filters.livestock.ward !== 'All' && item.ward !== filters.livestock.ward) {
        return false;
      }
      return true;
    });
  }, [livestock, filters.livestock]);

  // Calculate summary statistics
  const totalLivestock = filteredData.reduce((sum, item) => sum + item.male_livestock_count + item.female_livestock_count, 0);
  const maleLivestock = filteredData.reduce((sum, item) => sum + item.male_livestock_count, 0);
  const femaleLivestock = filteredData.reduce((sum, item) => sum + item.female_livestock_count, 0);

  // Prepare data for summary table
  const livestockSummary = useMemo(() => {
    const summary = filteredData.reduce((acc, item) => {
      const key = `${item.livestock_name}-${item.livestock_sub_category}`;
      
      if (!acc[key]) {
        acc[key] = {
          livestock_name: item.livestock_name,
          livestock_sub_category: item.livestock_sub_category,
          total_records: 0,
          total_livestock: 0,
          average_livestock: 0
        };
      }
      
      acc[key].total_records += 1;
      acc[key].total_livestock += (item.male_livestock_count + item.female_livestock_count);
      
      return acc;
    }, {} as Record<string, { 
      livestock_name: string; 
      livestock_sub_category: string;
      total_records: number; 
      total_livestock: number; 
      average_livestock: number 
    }>);
    
    // Calculate averages and convert to array
    return Object.values(summary).map(item => ({
      ...item,
      average_livestock: Math.round(item.total_livestock / item.total_records)
    })).sort((a, b) => b.total_livestock - a.total_livestock);
  }, [filteredData]);

  // Prepare data for charts
  const productionSystemData = useMemo(() => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.production_system] = (acc[item.production_system] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts)
      .map(system => ({
        production_system: system,
        count: counts[system]
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  const ageGroupData = useMemo(() => {
    const data = filteredData.reduce((acc, item) => {
      if (!acc[item.age_group]) {
        acc[item.age_group] = 0;
      }
      acc[item.age_group] += (item.male_livestock_count + item.female_livestock_count);
      return acc;
    }, {} as Record<string, number>);

    // Sort age groups in logical order
    const ageOrder = ['Young', 'Adult', 'Old'];
    
    return Object.keys(data)
      .map(age => ({
        age_group: age,
        total_livestock: data[age]
      }))
      .sort((a, b) => {
        const indexA = ageOrder.indexOf(a.age_group);
        const indexB = ageOrder.indexOf(b.age_group);
        return indexA - indexB;
      });
  }, [filteredData]);

  const livestockColumns = useMemo(
    () => [
      {
        Header: 'Livestock Type',
        accessor: 'livestock_name',
      },
      {
        Header: 'Sub Category',
        accessor: 'livestock_sub_category',
      },
      {
        Header: 'Total Records',
        accessor: 'total_records',
      },
      {
        Header: 'Total Livestock',
        accessor: 'total_livestock',
      },
      {
        Header: 'Average per Farmer',
        accessor: 'average_livestock',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <FilterBar category="livestock" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ValueBox title="Total Livestock" value={totalLivestock} icon={<Cow size={24} color="white" />} />
        <ValueBox title="Male Livestock" value={maleLivestock} icon={<Male size={24} color="white" />} color="blue" />
        <ValueBox title="Female Livestock" value={femaleLivestock} icon={<Female size={24} color="white" />} color="indigo" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart 
          data={productionSystemData} 
          xKey="production_system" 
          yKey="count" 
          title="Livestock Production System"
          horizontal={true}
          color="#8B4513"
        />
        <LineChart 
          data={ageGroupData} 
          xKey="age_group" 
          yKey="total_livestock" 
          title="Livestock Age Analysis"
          color="#4CAF50"
        />
      </div>
      
      <DataTable 
        columns={livestockColumns} 
        data={livestockSummary} 
        title="Livestock Summary Table" 
      />
    </div>
  );
};

export default LivestockTab;