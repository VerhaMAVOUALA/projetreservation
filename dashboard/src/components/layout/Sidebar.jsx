
import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Bell,
  Settings 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'cars', label: 'Gestion des voitures', icon: Car },
    { id: 'drivers', label: 'Gestion des chauffeurs', icon: UserCheck },
    { id: 'clients', label: 'Gestion des clients', icon: Users },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Car className="logo-icon" />
          <span className="logo-text">LuxeDrive</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <IconComponent className="nav-icon" />
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
