
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Drivers from './pages/Drivers';
import Clients from './pages/Clients';
import Reservations from './pages/Reservations';
import Statistics from './pages/Statistics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cars':
        return <Cars />;
      case 'drivers':
        return <Drivers />;
      case 'clients':
        return <Clients />;
      case 'reservations':
        return <Reservations />;
      case 'statistics':
        return <Statistics />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
