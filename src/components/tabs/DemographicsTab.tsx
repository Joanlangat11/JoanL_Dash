import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FilterBar } from '../ui/FilterBar';
import { ValueBox } from '../ui/ValueBox';
import { DataTable } from '../ui/DataTable';
import { PieChart } from '../charts/PieChart';
import { BarChart } from '../charts/BarChart';
import { Users, Leaf, Cog as Cow, Home } from 'lucide-react';

const DemographicsTab: React.FC = () => {
  const { farmers, filters } = useData();
  
  // Apply filters to the data
  const filteredData = useMemo(() => {
    return farmers.filter(farmer => {
      if (filters.demographics.county !== 'All' && farmer.county !== filters.demographics.county) {
        return false;
      }
      if (filters.demographics.subcounty !== 'All' && farmer.subcounty !== filters.demographics.subcounty) {
        return false;
      }
      if (filters.demographics.ward !== 'All' && farmer.ward !== filters.demographics.ward) {
        return false;
      }
      return true;
    });
  }, [farmers, filters.demographics]);

  // Calculate summary statistics
  const totalFarmers = filteredData.length;
  const cropFarmers = filteredData.filter(f => f.crop_production === 1).length;
  const livestockFarmers = filteredData.filter(f => f.livestock_production === 1).length;
  const farmingHouseholds = filteredData.filter(f => f.crop_production === 1 || f.livestock_production === 1).length;

  // Prepare data for charts
  const genderData = useMemo(() => {
    const counts = filteredData.reduce((acc, farmer) => {
      acc[farmer.gender] = (acc[farmer.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(gender => ({
      name: gender,
      value: counts[gender]
    }));
  }, [filteredData]);

  const ageData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const ages = filteredData.map(farmer => currentYear - farmer.year_of_birth);
    
    const ageGroups = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81+': 0
    };

    ages.forEach(age => {
      if (age <= 20) ageGroups['0-20']++;
      else if (age <= 40) ageGroups['21-40']++;
      else if (age <= 60) ageGroups['41-60']++;
      else if (age <= 80) ageGroups['61-80']++;
      else ageGroups['81+']++;
    });

    return Object.keys(ageGroups).map(group => ({
      name: group,
      value: ageGroups[group as keyof typeof ageGroups]
    }));
  }, [filteredData]);

  const countyData = useMemo(() => {
    const counts = filteredData.reduce((acc, farmer) => {
      acc[farmer.county] = (acc[farmer.county] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts)
      .map(county => ({
        county,
        farmers_count: counts[county]
      }))
      .sort((a, b) => b.farmers_count - a.farmers_count);
  }, [filteredData]);

  const educationData = useMemo(() => {
    const counts = filteredData.reduce((acc, farmer) => {
      const education = farmer.highest_level_of_formal_education;
      acc[education] = (acc[education] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(education => ({
      education,
      count: counts[education]
    }));
  }, [filteredData]);

  const trainingData = useMemo(() => {
    const trainingLabels = {
      0: 'No',
      1: 'Yes',
      2: 'None'
    };
    
    const counts = filteredData.reduce((acc, farmer) => {
      const training = trainingLabels[farmer.formal_training_in_agriculture as keyof typeof trainingLabels];
      acc[training] = (acc[training] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(training => ({
      name: training,
      value: counts[training]
    }));
  }, [filteredData]);

  const educationColumns = useMemo(
    () => [
      {
        Header: 'Education Level',
        accessor: 'education',
      },
      {
        Header: 'Number of Farmers',
        accessor: 'count',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <FilterBar category="demographics" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ValueBox title="Total Farmers" value={totalFarmers} icon={<Users size={24} color="white" />} />
        <ValueBox title="Crop Farmers" value={cropFarmers} icon={<Leaf size={24} color="white" />} color="blue" />
        <ValueBox title="Livestock Farmers" value={livestockFarmers} icon={<Cow size={24} color="white" />} color="amber" />
        <ValueBox title="Farming Households" value={farmingHouseholds} icon={<Home size={24} color="white" />} color="indigo" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={genderData} title="Farmers by Gender" />
        <PieChart data={ageData} title="Farmers by Age Group" />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BarChart 
          data={countyData} 
          xKey="county" 
          yKey="farmers_count" 
          title="Farmers by County"
          tooltip="Farmers" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataTable 
          columns={educationColumns} 
          data={educationData} 
          title="Highest Level of Formal Education" 
        />
        <PieChart 
          data={trainingData} 
          title="Formal Training in Agriculture" 
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-medium text-gray-900 text-lg mb-2">Key Insights</h3>
        <div className="prose max-w-none">
          <ul className="list-disc pl-5">
            <li>Total Farmers: <strong>{totalFarmers}</strong></li>
            <li>Crop Farmers: <strong>{cropFarmers}</strong> ({((cropFarmers / totalFarmers) * 100).toFixed(1)}% of total)</li>
            <li>Livestock Farmers: <strong>{livestockFarmers}</strong> ({((livestockFarmers / totalFarmers) * 100).toFixed(1)}% of total)</li>
            <li>Most Active County: <strong>{countyData[0]?.county || 'N/A'}</strong></li>
            <li>Gender Distribution: <strong>{genderData.map(g => `${g.name}: ${g.value}`).join(', ')}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemographicsTab;