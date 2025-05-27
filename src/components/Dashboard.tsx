import React, { useState } from 'react';
import { Tabs } from './ui/Tabs';
import { useData } from '../context/DataContext';
import DemographicsTab from './tabs/DemographicsTab';
import CropsTab from './tabs/CropsTab';
import LivestockTab from './tabs/LivestockTab';
import AquacultureTab from './tabs/AquacultureTab';
import Header from './layout/Header';
import { Plane as Plant, Cog as Cow, Fish, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demographics');
  const { loading, error } = useData();

  const tabs = [
    { id: 'demographics', label: 'Demographics', icon: <Users size={18} /> },
    { id: 'crops', label: 'Crops', icon: <Plant size={18} /> },
    { id: 'livestock', label: 'Livestock', icon: <Cow size={18} /> },
    { id: 'aquaculture', label: 'Aquaculture', icon: <Fish size={18} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div className="mt-4">
          {activeTab === 'demographics' && <DemographicsTab />}
          {activeTab === 'crops' && <CropsTab />}
          {activeTab === 'livestock' && <LivestockTab />}
          {activeTab === 'aquaculture' && <AquacultureTab />}
        </div>
      </main>
      
      <footer className="bg-green-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Farmers Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;