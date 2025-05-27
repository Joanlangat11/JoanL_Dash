import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Define types for our data
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

// Create context with default values
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

// Create a provider component
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

  // For simplicity, in this example we'll use mock data
  // In a real application, you would fetch this from your API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be API calls
        // const farmersResponse = await axios.get('/api/farmers');
        // const cropsResponse = await axios.get('/api/crops');
        // etc.
        
        // Using mock data for now
        const mockFarmers = generateMockFarmers();
        const mockCrops = generateMockCrops();
        const mockLivestock = generateMockLivestock();
        const mockAquaculture = generateMockAquaculture();
        
        setFarmers(mockFarmers);
        setCrops(mockCrops);
        setLivestock(mockLivestock);
        setAquaculture(mockAquaculture);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update filter function
  const updateFilter = (category: string, field: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category as keyof typeof prevFilters],
        [field]: value,
        // Reset dependent filters when parent filter changes
        ...(field === 'county' && { subcounty: 'All', ward: 'All' }),
        ...(field === 'subcounty' && { ward: 'All' }),
      }
    }));
  };

  // Generate options for dropdowns based on current filter state
  const countyOptions = [...new Set(farmers.map(farmer => farmer.county))];

  // Generate subcounty options based on selected county
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

  // Generate ward options based on selected subcounty
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

// Helper hook to use the context
export const useData = () => useContext(DataContext);

// Mock data generators
const counties = ['Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Kisumu'];
const subcounties = {
  'Nairobi': ['Westlands', 'Embakasi', 'Dagoretti'],
  'Kiambu': ['Kikuyu', 'Thika', 'Limuru'],
  'Nakuru': ['Naivasha', 'Gilgil', 'Molo'],
  'Mombasa': ['Nyali', 'Kisauni', 'Likoni'],
  'Kisumu': ['Kisumu Central', 'Kisumu West', 'Nyando'],
};
const wards = {
  'Westlands': ['Parklands', 'Mountain View', 'Kangemi'],
  'Embakasi': ['Pipeline', 'Utawala', 'Mihango'],
  'Kikuyu': ['Karai', 'Nachu', 'Sigona'],
  // More wards...
};

function generateMockFarmers(): Farmer[] {
  const farmers: Farmer[] = [];
  for (let i = 1; i <= 100; i++) {
    const county = counties[Math.floor(Math.random() * counties.length)];
    const subcountyOptions = subcounties[county as keyof typeof subcounties] || ['Central'];
    const subcounty = subcountyOptions[Math.floor(Math.random() * subcountyOptions.length)];
    const wardOptions = wards[subcounty as keyof typeof wards] || ['Ward 1'];
    const ward = wardOptions[Math.floor(Math.random() * wardOptions.length)] || 'Ward 1';
    
    farmers.push({
      id: i,
      name: `Farmer ${i}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      year_of_birth: 1960 + Math.floor(Math.random() * 40),
      county,
      subcounty,
      ward,
      crop_production: Math.random() > 0.3 ? 1 : 0,
      livestock_production: Math.random() > 0.4 ? 1 : 0,
      highest_level_of_formal_education: ['Primary', 'Secondary', 'Tertiary', 'None'][Math.floor(Math.random() * 4)],
      formal_training_in_agriculture: Math.floor(Math.random() * 3),
    });
  }
  return farmers;
}

function generateMockCrops(): Crop[] {
  const crops: Crop[] = [];
  const cropTypes = ['Maize', 'Beans', 'Wheat', 'Rice', 'Potatoes', 'Cassava', 'Sorghum'];
  const waterSources = ['Rain-fed', 'Irrigated', 'Both', 'None'];
  const productionSystems = ['Small-scale', 'Large-scale', 'Commercial', 'Subsistence'];
  const purposes = ['Commercial', 'Subsistence', 'Both'];
  
  for (let i = 1; i <= 150; i++) {
    const farmerId = Math.floor(Math.random() * 100) + 1;
    const county = counties[Math.floor(Math.random() * counties.length)];
    const subcountyOptions = subcounties[county as keyof typeof subcounties] || ['Central'];
    const subcounty = subcountyOptions[Math.floor(Math.random() * subcountyOptions.length)];
    const wardOptions = wards[subcounty as keyof typeof wards] || ['Ward 1'];
    const ward = wardOptions[Math.floor(Math.random() * wardOptions.length)] || 'Ward 1';
    
    crops.push({
      id: i,
      farmer_id: farmerId,
      crop_name: cropTypes[Math.floor(Math.random() * cropTypes.length)],
      acreage: Math.random() * 10,
      county,
      subcounty,
      ward,
      water_source: waterSources[Math.floor(Math.random() * waterSources.length)],
      production_system: productionSystems[Math.floor(Math.random() * productionSystems.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      use_of_certified_seeds: Math.random() > 0.5 ? 1 : 0,
    });
  }
  return crops;
}

function generateMockLivestock(): Livestock[] {
  const livestock: Livestock[] = [];
  const livestockTypes = ['Cattle', 'Goats', 'Sheep', 'Chicken', 'Pigs', 'Rabbits'];
  const subCategories = {
    'Cattle': ['Dairy', 'Beef', 'Mixed'],
    'Goats': ['Dairy', 'Meat'],
    'Sheep': ['Wool', 'Meat'],
    'Chicken': ['Layers', 'Broilers', 'Indigenous'],
    'Pigs': ['Breeding', 'Fattening'],
    'Rabbits': ['Fur', 'Meat'],
  };
  const productionSystems = ['Zero-grazing', 'Free-range', 'Semi-intensive', 'Intensive'];
  const ageGroups = ['Young', 'Adult', 'Old'];
  
  for (let i = 1; i <= 120; i++) {
    const farmerId = Math.floor(Math.random() * 100) + 1;
    const livestockType = livestockTypes[Math.floor(Math.random() * livestockTypes.length)];
    const subCategoryOptions = subCategories[livestockType as keyof typeof subCategories] || ['General'];
    const subCategory = subCategoryOptions[Math.floor(Math.random() * subCategoryOptions.length)];
    
    const county = counties[Math.floor(Math.random() * counties.length)];
    const subcountyOptions = subcounties[county as keyof typeof subcounties] || ['Central'];
    const subcounty = subcountyOptions[Math.floor(Math.random() * subcountyOptions.length)];
    const wardOptions = wards[subcounty as keyof typeof wards] || ['Ward 1'];
    const ward = wardOptions[Math.floor(Math.random() * wardOptions.length)] || 'Ward 1';
    
    const maleCount = Math.floor(Math.random() * 10);
    const femaleCount = Math.floor(Math.random() * 15);
    
    livestock.push({
      id: i,
      farmer_id: farmerId,
      livestock_name: livestockType,
      livestock_sub_category: subCategory,
      county,
      subcounty,
      ward,
      male_livestock_count: maleCount,
      female_livestock_count: femaleCount,
      production_system: productionSystems[Math.floor(Math.random() * productionSystems.length)],
      age_group: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      total_livestock_count: maleCount + femaleCount,
    });
  }
  return livestock;
}

function generateMockAquaculture(): Aquaculture[] {
  const aquaculture: Aquaculture[] = [];
  const species = ['Tilapia', 'Catfish', 'Carp', 'Trout', 'Salmon'];
  const categories = ['Freshwater', 'Marine', 'Brackish'];
  const productionSystems = ['Pond', 'Cage', 'Tank', 'Recirculating Aquaculture System (RAS)'];
  
  for (let i = 1; i <= 80; i++) {
    const farmerId = Math.floor(Math.random() * 100) + 1;
    const county = counties[Math.floor(Math.random() * counties.length)];
    const subcountyOptions = subcounties[county as keyof typeof subcounties] || ['Central'];
    const subcounty = subcountyOptions[Math.floor(Math.random() * subcountyOptions.length)];
    const wardOptions = wards[subcounty as keyof typeof wards] || ['Ward 1'];
    const ward = wardOptions[Math.floor(Math.random() * wardOptions.length)] || 'Ward 1';
    
    aquaculture.push({
      id: i,
      farmer_id: farmerId,
      aquaculture_species: species[Math.floor(Math.random() * species.length)],
      aquaculture_species_category: categories[Math.floor(Math.random() * categories.length)],
      county,
      subcounty,
      ward,
      type_of_production_system: productionSystems[Math.floor(Math.random() * productionSystems.length)],
      estimated_no_of_fingerlings: Math.floor(Math.random() * 1000) + 100,
    });
  }
  return aquaculture;
}

export default DataContext;