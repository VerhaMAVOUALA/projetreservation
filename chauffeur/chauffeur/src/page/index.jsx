import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Profile from '@/components/Profile';
import Reservations from '@/components/Reservations';
import VehiclesList from '@/components/VehiclesList';
import BookingForm from '@/components/BookingForm';
import MyVehicle from '@/components/MyVehicle';
import { useToast } from '@/components/hooks/use-toast';


const Index = () => {
  // États pour gérer le mode (conducteur/client) et l'interface
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState(null);
  const { toast } = useToast();
  // Hook personnalisé pour détecter mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Basculer entre les modes conducteur et client
  const handleToggleMode = () => {
    setIsDriverMode(!isDriverMode);
    // Réinitialiser à l'onglet profil lors du changement de mode
    setActiveTab(isDriverMode ? 'profile' : 'driver-profile');
    setSelectedVehicleForBooking(null);
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    console.log('Utilisateur déconnecté');
    // Ici vous géreriez la logique de déconnexion
  };

  // Changer d'onglet actif
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // Effacer le véhicule sélectionné lors du changement d'onglet
    if (tab !== 'booking') {
      setSelectedVehicleForBooking(null);
    }
  };

  // Basculer le menu mobile
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Sélectionner un véhicule pour réservation
  const handleVehicleSelection = (vehicle) => {
    setSelectedVehicleForBooking(vehicle);
    setActiveTab('booking');
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Afficher le contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
      case 'driver-profile':
        return <Profile isDriverMode={isDriverMode} />;
      case 'reservations':
        return <Reservations isDriverMode={false} />;
      case 'assigned-bookings':
        return <Reservations isDriverMode={true} />;
      case 'vehicles':
        return <VehiclesList onSelectVehicle={handleVehicleSelection} />;
      case 'booking':
        return <BookingForm selectedVehicle={selectedVehicleForBooking} />;
      case 'my-vehicle':
        return <MyVehicle />;
      case 'driver-settings':
        return <Profile isDriverMode={true} />;
      default:
        return <Profile isDriverMode={isDriverMode} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Barre de navigation */}
      <div className="flex-shrink-0">
        <Navbar
          isDriverMode={isDriverMode}
          onToggleMode={handleToggleMode}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={handleMobileMenuToggle}
        />
      </div>
      
      {/* Contenu principal avec sidebar et zone de contenu */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (navigation latérale) */}
        <div className="flex-shrink-0">
          <Sidebar
            isDriverMode={isDriverMode}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
            isOpen={isSidebarOpen}
          />
        </div>
        
        {/* Zone de contenu principale */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full w-full overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;