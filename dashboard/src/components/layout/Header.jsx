
import React, { useState } from 'react';
import { Bell, User, LogOut, Menu, Search } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuToggle, notificationCount = 3 }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'Nouvelle réservation reçue', time: '5 min', type: 'info' },
    { id: 2, message: 'Chauffeur Jean Dupont disponible', time: '10 min', type: 'success' },
    { id: 3, message: 'Maintenance prévue véhicule #123', time: '1h', type: 'warning' },
  ];

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <Menu />
        </button>
        
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="notification-count">{notificationCount}</span>
              </div>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.type}`}>
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="btn btn-sm btn-primary">Voir tout</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-container">
          <button 
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User />
            </div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrateur</span>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar large">
                  <User />
                </div>
                <div>
                  <p className="user-dropdown-name">Administrateur</p>
                  <p className="user-dropdown-email">admin@luxedrive.com</p>
                </div>
              </div>
              <div className="user-dropdown-menu">
                <button className="dropdown-item">
                  <User className="dropdown-icon" />
                  Profil
                </button>
                <button className="dropdown-item">
                  <LogOut className="dropdown-icon" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
