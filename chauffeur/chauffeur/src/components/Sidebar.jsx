import React, { useEffect, useState } from 'react';
import { User, Calendar, Car, Settings, Plus, CheckCircle, ArrowLeft, ArrowRight, Sparkles, Star, Moon, Sun } from 'lucide-react';

const Sidebar = ({
  isDriverMode,
  activeTab,
  onTabChange,
  isMobile,
  isOpen
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeHover, setActiveHover] = useState(null);
  
  const clientTabs = [
    { id: 'profile', label: 'Mon Profil', icon: User, color: 'from-purple-500 to-indigo-500' },
    { id: 'reservations', label: 'Mes Réservations', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { id: 'vehicles', label: 'Voitures disponibles', icon: Car, color: 'from-teal-500 to-emerald-500' },
    { id: 'booking', label: 'Nouvelle Réservation', icon: Plus, color: 'from-amber-500 to-orange-500' },
  ];

  const driverTabs = [
    { id: 'driver-profile', label: 'Mon Profil', icon: User, color: 'from-purple-500 to-indigo-500' },
    { id: 'assigned-bookings', label: 'Réservations Assignées', icon: CheckCircle, color: 'from-green-500 to-lime-500' },
    { id: 'my-vehicle', label: 'Ma Voiture', icon: Car, color: 'from-rose-500 to-pink-500' },
    { id: 'driver-settings', label: 'Paramètres', icon: Settings, color: 'from-gray-600 to-gray-800' },
  ];

  const tabs = isDriverMode ? driverTabs : clientTabs;

  const sidebarClasses = `
    ${isMobile 
      ? `fixed inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
      : 'relative'
    } 
    w-64 bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl border-r border-gray-200 min-h-screen transition-all duration-500
    ${collapsed ? 'w-20' : ''}
  `;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 animate-fadeIn" 
          onClick={() => onTabChange(activeTab)} 
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex flex-col min-h-screen">
          {/* Header avec animation de réduction */}
          <div 
            className={`p-4 border-b border-gray-200/50 flex items-center justify-between transition-all duration-300 ${
              collapsed ? 'flex-col space-y-3 py-6' : ''
            }`}
          >
            {!collapsed && (
              <div className={`flex items-center space-x-3 transition-all duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-2 rounded-xl">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isDriverMode ? '🚙 Mode Chauffeur' : '👤 Mode Client'}
                </h2>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all ${
                collapsed ? 'rotate-180' : ''
              }`}
            >
              {collapsed ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation avec animations au survol */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isHovering = activeHover === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  onMouseEnter={() => setActiveHover(tab.id)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform -translate-x-1`
                      : 'text-gray-700 hover:bg-white hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20' 
                      : isHovering 
                        ? `bg-gradient-to-r ${tab.color} text-white` 
                        : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'text-white' : isHovering ? 'text-white' : 'text-gray-500 dark:text-gray-300'
                    } ${isHovering && !isActive ? 'group-hover:scale-110' : ''}`} />
                  </div>
                  
                  {!collapsed && (
                    <span className={`font-medium transition-all duration-300 ${
                      isActive ? 'text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}>
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Pied de page avec options supplémentaires */}
          <div className={`p-4 border-t border-gray-200/50 flex-shrink-0 transition-all ${collapsed ? 'px-2' : ''}`}>
            <div className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-inner transition-all duration-500 ${
              collapsed ? 'flex flex-col items-center' : ''
            }`}>
              {!collapsed && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                  {isDriverMode
                    ? 'Gérez vos courses et votre véhicule'
                    : 'Réservez votre prochaine course'
                  }
                </p>
              )}
              
              <div className={`flex ${collapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                    collapsed ? 'w-10 h-10 flex items-center justify-center' : ''
                  }`}
                >
                  {theme === 'light' ? 
                    <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : 
                    <Sun className="h-5 w-5 text-amber-500" />
                  }
                </button>
                
                {!collapsed && (
                  <div className="flex items-center space-x-1 text-xs bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 text-amber-500" fill="currentColor" />
                    <span className="text-amber-700 dark:text-amber-400">Premium</span>
                  </div>
                )}
                
                <button className={`p-2 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 hover:from-teal-200 hover:to-blue-200 transition-all ${
                  collapsed ? 'w-10 h-10 flex items-center justify-center' : ''
                }`}>
                  <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton pour ouvrir la barre latérale réduite */}
      {collapsed && !isMobile && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-4 bottom-4 z-30 p-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;