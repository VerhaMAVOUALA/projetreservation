import React, { useState } from 'react';
import { Car, User, LogOut, Menu, X, Sparkles, Sun, Moon, Bell, BellRing } from 'lucide-react';

const Navbar = ({
  isDriverMode,
  onToggleMode,
  onLogout,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-teal-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec animation */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-2 rounded-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center">
                LuxDrive
                <span className="ml-2 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
                  {isHovering ? "Premium" : "Pro"}
                </span>
              </h1>
              <p className="text-xs text-teal-300 group-hover:text-teal-100 transition-colors">
                Location avec chauffeur
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Mode Toggle avec animation améliorée */}
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full p-1">
              <span className={`text-sm px-3 py-1 rounded-full transition-all ${
                !isDriverMode 
                  ? 'bg-white text-teal-900 font-bold shadow-md' 
                  : 'text-gray-300'
              }`}>
                Client
              </span>
              <button
                onClick={onToggleMode}
                className="relative flex items-center justify-center"
              >
                <div className="relative w-12 h-6 flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-full h-full"></div>
                  <div className={`absolute h-5 w-5 bg-white rounded-full transform transition-transform duration-300 ${
                    isDriverMode ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </div>
              </button>
              <span className={`text-sm px-3 py-1 rounded-full transition-all ${
                isDriverMode 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold shadow-md' 
                  : 'text-gray-300'
              }`}>
                Chauffeur
              </span>
            </div>

            {/* Notifications avec badge animé */}
            <div className="relative">
              <button className="p-2 bg-gray-800/30 rounded-full hover:bg-teal-700/50 transition-colors group relative">
                {notificationCount > 0 ? (
                  <BellRing className="h-5 w-5 text-teal-300 group-hover:text-white" />
                ) : (
                  <Bell className="h-5 w-5 text-gray-400 group-hover:text-white" />
                )}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Info avec animation au survol */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-medium text-white group-hover:text-teal-300 transition-colors">
                  Ahmed Benali
                </p>
                <p className="text-xs text-teal-300 group-hover:text-teal-100 transition-colors">
                  {isDriverMode ? (
                    <span className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                      Chauffeur Premium
                    </span>
                  ) : (
                    'Client VIP'
                  )}
                </p>
              </div>
              <div className="h-9 w-9 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Bouton de déconnexion animé */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-gray-800/40 rounded-lg text-gray-300 hover:text-white hover:bg-red-600/80 transition-all duration-300 flex items-center group"
            >
              <LogOut className="h-4 w-4 mr-1.5 group-hover:animate-pulse" />
              <span>Déconnexion</span>
            </button>
          </div>

          {/* Mobile Menu Button avec animation */}
          <div className="md:hidden">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 bg-gray-800/50 rounded-full text-white hover:bg-teal-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 animate-spin-in" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu avec animation slide-down */}
        {isMobileMenuOpen && (
          <div className="md:hidden overflow-hidden">
            <div className="pt-2 pb-4 space-y-4 animate-slide-down">
              {/* Mode Toggle Mobile */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-300">Changer de mode:</span>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${!isDriverMode ? 'text-white font-medium' : 'text-gray-400'}`}>
                    Client
                  </span>
                  <button
                    onClick={onToggleMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDriverMode ? 'bg-teal-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDriverMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${isDriverMode ? 'text-white font-medium' : 'text-gray-400'}`}>
                    Chauffeur
                  </span>
                </div>
              </div>

              {/* Notifications Mobile */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 rounded-lg">
                <span className="text-sm text-gray-300">Notifications:</span>
                <button className="relative">
                  {notificationCount > 0 ? (
                    <BellRing className="h-5 w-5 text-teal-300" />
                  ) : (
                    <Bell className="h-5 w-5 text-gray-400" />
                  )}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info Mobile */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/30 rounded-lg">
                <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Ahmed Benali</p>
                  <p className="text-xs text-teal-300">
                    {isDriverMode ? 'Chauffeur Premium' : 'Client VIP'}
                  </p>
                </div>
              </div>

              {/* Logout Mobile */}
              <div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600/80 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Effet de lumière animé */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 opacity-30 animate-light-pulse"></div>
    </nav>
  );
};

export default Navbar;