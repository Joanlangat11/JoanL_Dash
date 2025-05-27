import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

type Farmer = {
  id: number;
  name: string;
  gender: string;
  year_of_birth: number;
  county: string;
  subcounty: string;
  ward: string;
  crop_production: number;
  livestock_production: number;
  highest_level_of_formal_education: string;
  formal_training_in_agriculture: number;
};

type Crop = {
  id: number;
  farmer_id: number;
  crop_name: string;
  acreage: number;
  county: string;
  subcounty: string;
  ward: string;
  water_source: string;
  production_system: string;
  purpose: string;
  use_of_certified_seeds: number;
};

type Livestock = {
  id: number;
  farmer_id: number;
  livestock_name: string;
  livestock_sub_category: string;
  county: string;
  subcounty: string;
  ward: string;
  male_livestock_count: number;
  female_livestock_count: number;
  production_system: string;
  age_group: string;
  total_livestock_count: number;
};

type Aquaculture = {
  id: number;
  farmer_id: number;
  aquaculture_species: string;
  aquaculture_species_category: string;
  county: string;
  subcounty: string;
  ward: string;
  type_of_production_system: string;
  estimated_no_of_fingerlings: number;
};

type FilterState = {
  county: string;
  subcounty: string;
  ward: string;
};

type DataContextType = {
  farmers: Farmer[];
  crops: Crop[];
  livestock: Livestock[];
  aquaculture: Aquaculture[];
  loading: boolean;
  error: string | null;
  filters: {
    demographics: FilterState;
    crops: FilterState;
    livestock: FilterState;
    aquaculture: FilterState;
  };
  updateFilter: (category: string, field: string, value: string) => void;
  countyOptions: string[];
  subcountyOptions: {
    demographics: string[];
    crops: string[];
    livestock: string[];
    aquaculture: string[];
  };
  wardOptions: {
    demographics: string[];
    crops: string[];
    livestock: string[];
    aquaculture: string[];
  };
};

const DataContext = createContext<DataContextType>({
  farmers: [],
  crops: [],
  livestock: [],
  aquaculture: [],
  loading: true,
  error: null,
  filters: {
    demographics: { county: 'All', subcounty: 'All', ward: 'All' },
    crops: { county: 'All', subcounty: 'All', ward: 'All' },
    livestock: { county: 'All', subcounty: 'All', ward: 'All' },
    aquaculture: { county: 'All', subcounty: 'All', ward: 'All' },
  },
  updateFilter: () => {},
  countyOptions: [],
  subcountyOptions: {
    demographics: [],
    crops: [],
    livestock: [],
    aquaculture: [],
  },
  wardOptions: {
    demographics: [],
    crops: [],
    livestock: [],
    aquaculture: [],
  },
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [aquaculture, setAquaculture] = useState<Aquaculture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    demographics: { county: 'All', subcounty: 'All', ward: 'All' },
    crops: { county: 'All', subcounty: 'All', ward: 'All' },
    livestock: { county: 'All', subcounty: 'All', ward: 'All' },
    aquaculture: { county: 'All', subcounty: 'All', ward: 'All' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [farmersRes, cropsRes, livestockRes, aquacultureRes] = await Promise.all([
          axios.get('/api/farmers'),
          axios.get('/api/crops'),
          axios.get('/api/livestock'),
          axios.get('/api/aquaculture')
        ]);
        
        setFarmers(farmersRes.data);
        setCrops(cropsRes.data);
        setLivestock(livestockRes.data);
        setAquaculture(aquacultureRes.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const updateFilter = (category: string, field: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category as keyof typeof prevFilters],
        [field]: value,
        ...(field === 'county' && { subcounty: 'All', ward: 'All' }),
        ...(field === 'subcounty' && { ward: 'All' }),
      }
    }));
  };

  const countyOptions = [...new Set(farmers.map(farmer => farmer.county))];

  const generateSubcountyOptions = (category: string) => {
    const currentFilter = filters[category as keyof typeof filters];
    const dataSource = 
      category === 'demographics' ? farmers :
      category === 'crops' ? crops :
      category === 'livestock' ? livestock : aquaculture;
    
    if (currentFilter.county === 'All') {
      return ['All'];
    }
    
    return ['All', ...new Set(dataSource
      .filter(item => item.county === currentFilter.county)
      .map(item => item.subcounty))];
  };

  const generateWardOptions = (category: string) => {
    const currentFilter = filters[category as keyof typeof filters];
    const dataSource = 
      category === 'demographics' ? farmers :
      category === 'crops' ? crops :
      category === 'livestock' ? livestock : aquaculture;
    
    if (currentFilter.subcounty === 'All') {
      return ['All'];
    }
    
    return ['All', ...new Set(dataSource
      .filter(item => 
        item.county === currentFilter.county && 
        item.subcounty === currentFilter.subcounty
      )
      .map(item => item.ward))];
  };

  const subcountyOptions = {
    demographics: generateSubcountyOptions('demographics'),
    crops: generateSubcountyOptions('crops'),
    livestock: generateSubcountyOptions('livestock'),
    aquaculture: generateSubcountyOptions('aquaculture'),
  };

  const wardOptions = {
    demographics: generateWardOptions('demographics'),
    crops: generateWardOptions('crops'),
    livestock: generateWardOptions('livestock'),
    aquaculture: generateWardOptions('aquaculture'),
  };

  return (
    <DataContext.Provider 
      value={{ 
        farmers, 
        crops, 
        livestock, 
        aquaculture, 
        loading, 
        error,
        filters,
        updateFilter,
        countyOptions,
        subcountyOptions,
        wardOptions
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default DataContext;