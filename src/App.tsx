import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;