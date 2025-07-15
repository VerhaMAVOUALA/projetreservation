
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={onPageChange}
      />
      <Header onMenuToggle={handleMenuToggle} />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && <div className="overlay" onClick={handleMenuToggle} />}
    </div>
  );
};

export default Layout;
