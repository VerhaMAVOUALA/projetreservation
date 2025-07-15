import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, Car, Check, User, Phone, Navigation } from 'lucide-react';

const BookingForm = ({ selectedVehicle }) => {
  // Données client simulées
  const clientData = {
    name: "Ahmed Benali",
    phone: "+212 6 12 34 56 78"
  };

  // États pour la gestion du formulaire
  const [bookingData, setBookingData] = useState({
    startLocation: '',
    endLocation: '',
    date: '',
    time: '',
    vehicleId: selectedVehicle?.id || '',
    vehicleName: selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : '',
    vehiclePrice: selectedVehicle?.pricePerHour || 0,
    specialRequests: '',
    clientName: clientData.name,
    clientPhone: clientData.phone
  });

  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [startLocationType, setStartLocationType] = useState('city');
  const [endLocationType, setEndLocationType] = useState('city');
  const [currentLocation, setCurrentLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef(null);
  const modalRef = useRef(null);

  // Liste des véhicules disponibles
  const vehicles = [
    { id: '1', name: 'Mercedes Classe S', pricePerHour: 450, image: '/mercedes-s-class.jpg' },
    { id: '2', name: 'BMW Série 7', pricePerHour: 420, image: '/bmw-7-series.jpg' },
    { id: '3', name: 'Audi A8', pricePerHour: 400, image: '/audi-a8.jpg' },
    { id: '4', name: 'Mercedes Vito', pricePerHour: 350, image: '/mercedes-vito.jpg' },
    { id: '5', name: 'Dacia Logan', pricePerHour: 180, image: '/dacia-logan.jpg' }
  ];

  // Villes marocaines disponibles
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tangier', 'Meknes', 
    'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'El Jadida',
    'Beni Mellal', 'Errachidia', 'Taza', 'Essaouira', 'Agadir', 'Ouarzazate'
  ];

  // Fonction pour afficher une notification (simulation)
  const showToast = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // Vous pouvez implémenter une vraie notification ici
  };

  // Mise à jour des données véhicule quand sélectionné
  useEffect(() => {
    if (selectedVehicle) {
      setBookingData(prev => ({
        ...prev,
        vehicleId: selectedVehicle.id,
        vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
        vehiclePrice: selectedVehicle.pricePerHour
      }));
    }
  }, [selectedVehicle]);

  // Fonction pour obtenir la position actuelle
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Position actuelle)`;
          setCurrentLocation(mockAddress);
          setBookingData(prev => ({ ...prev, startLocation: mockAddress }));
          setIsGettingLocation(false);
          
          showToast("Votre position actuelle a été utilisée comme point de départ.", "success");
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsGettingLocation(false);
          showToast("Impossible d'obtenir votre position. Veuillez saisir votre adresse manuellement.", "error");
        }
      );
    } else {
      setIsGettingLocation(false);
      showToast("Votre navigateur ne supporte pas la géolocalisation.", "error");
    }
  };

  // Gestion du type de localisation de départ
  const handleStartLocationTypeChange = (type) => {
    setStartLocationType(type);
    if (type === 'current' && currentLocation) {
      setBookingData(prev => ({ ...prev, startLocation: currentLocation }));
    } else if (type !== 'current') {
      setBookingData(prev => ({ ...prev, startLocation: '' }));
    }
  };

  // Gestion du type de localisation d'arrivée
  const handleEndLocationTypeChange = (type) => {
    setEndLocationType(type);
    setBookingData(prev => ({ ...prev, endLocation: '' }));
  };

  // Soumission du formulaire
  const handleSubmit = () => {
    // Validation des champs requis
    if (!bookingData.startLocation || !bookingData.endLocation || !bookingData.date || !bookingData.time) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (!selectedVehicle && !bookingData.vehicleId) {
      showToast("Veuillez sélectionner un véhicule", "error");
      return;
    }
    
    // Calcul du prix estimé (2 heures minimum)
    if (selectedVehicle) {
      setEstimatedPrice(selectedVehicle.pricePerHour * 2);
    } else {
      const selectedVehicleData = vehicles.find(v => v.id === bookingData.vehicleId);
      if (selectedVehicleData) {
        setEstimatedPrice(selectedVehicleData.pricePerHour * 2);
      }
    }
    
    setShowConfirmation(true);
  };

  // Confirmation de la réservation
  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    
    // Animation de soumission
    if (formRef.current) {
      formRef.current.classList.add('animate-pulse');
    }
    
    console.log('Réservation confirmée:', bookingData);
    
    // Notification de succès
    setTimeout(() => {
      showToast("Votre réservation a été enregistrée. Vous recevrez une notification dès qu'un chauffeur la confirmera.", "success");
      
      // Simulation de notification au chauffeur
      setTimeout(() => {
        showToast("Les chauffeurs disponibles ont été notifiés de votre nouvelle réservation.", "info");
      }, 1500);
      
      setShowConfirmation(false);
      setIsSubmitting(false);
      
      // Réinitialisation du formulaire
      setBookingData({
        startLocation: '',
        endLocation: '',
        date: '',
        time: '',
        vehicleId: selectedVehicle?.id || '',
        vehicleName: selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : '',
        vehiclePrice: selectedVehicle?.pricePerHour || 0,
        specialRequests: '',
        clientName: clientData.name,
        clientPhone: clientData.phone
      });
      setStartLocationType('city');
      setEndLocationType('city');
      setCurrentLocation('');
      
      if (formRef.current) {
        formRef.current.classList.remove('animate-pulse');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Réservez Votre Véhicule Premium
          </h1>
          <p className="text-gray-600 mt-3">
            Voyagez en toute élégance avec notre service de chauffeur privé
          </p>
        </div>
        
        <div 
          ref={formRef}
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-teal-100 p-2 rounded-full">
                <Car className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Détails de la réservation</h2>
            </div>
            
            <div className="space-y-8">
              {/* Section Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 text-teal-600 mr-1" />
                    Nom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookingData.clientName}
                      disabled
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="h-4 w-4 text-teal-600 mr-1" />
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={bookingData.clientPhone}
                      disabled
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Section Véhicule sélectionné */}
              {selectedVehicle && (
                <div className="p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100 transform transition-all hover:scale-[1.01]">
                  <h3 className="text-lg font-semibold text-teal-800 mb-3">Véhicule sélectionné</h3>
                  <div className="flex items-center space-x-5">
                    <div className="overflow-hidden rounded-lg shadow-md w-24 h-16">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                        {selectedVehicle.name}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{selectedVehicle.brand} {selectedVehicle.model}</p>
                      <p className="text-sm text-gray-600">{selectedVehicle.seats} places • {selectedVehicle.type}</p>
                      <p className="text-xl font-bold text-teal-600 mt-1">{selectedVehicle.pricePerHour} MAD/heure</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sélection du véhicule si non pré-sélectionné */}
              {!selectedVehicle && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Car className="h-4 w-4 text-teal-600 mr-1" />
                    Choix du véhicule
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={bookingData.vehicleId}
                      onChange={(e) => {
                        const vehicle = vehicles.find(v => v.id === e.target.value);
                        setBookingData({ 
                          ...bookingData, 
                          vehicleId: e.target.value,
                          vehicleName: vehicle?.name || '',
                          vehiclePrice: vehicle?.pricePerHour || 0
                        });
                      }}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Sélectionner un véhicule</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.pricePerHour} MAD/heure
                        </option>
                      ))}
                    </select>
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Section Lieu de départ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 text-green-500 mr-1" />
                  Lieu de départ
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => handleStartLocationTypeChange('current')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      startLocationType === 'current' 
                        ? 'bg-green-600 text-black shadow-md' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    Ma position actuelle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartLocationTypeChange('manual')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      startLocationType === 'manual' 
                        ? 'bg-blue-600 text-black shadow-md' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    Saisir une adresse
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartLocationTypeChange('city')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      startLocationType === 'city' 
                        ? 'bg-purple-600 text-black shadow-md' 
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    Choisir une ville
                  </button>
                </div>

                {startLocationType === 'current' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                      <Navigation className="h-5 w-5 mr-2 animate-pulse" />
                      {isGettingLocation ? 'Localisation en cours...' : 'Utiliser ma position'}
                    </button>
                    {currentLocation && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
                        <p className="text-sm text-green-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Position: {currentLocation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {startLocationType === 'manual' && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Entrez votre adresse complète"
                      required
                      value={bookingData.startLocation}
                      onChange={(e) => setBookingData({ ...bookingData, startLocation: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                )}

                {startLocationType === 'city' && (
                  <div className="relative">
                    <select
                      required
                      value={bookingData.startLocation}
                      onChange={(e) => setBookingData({ ...bookingData, startLocation: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Sélectionner une ville</option>
                      {moroccanCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Section Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 text-red-500 mr-1" />
                  Destination
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => handleEndLocationTypeChange('manual')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      endLocationType === 'manual' 
                        ? 'bg-blue-600 text-black shadow-md' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    Saisir une adresse
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEndLocationTypeChange('city')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      endLocationType === 'city' 
                        ? 'bg-purple-600 text-black shadow-md' 
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    Choisir une ville
                  </button>
                </div>

                {endLocationType === 'manual' && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Entrez l'adresse de destination"
                      required
                      value={bookingData.endLocation}
                      onChange={(e) => setBookingData({ ...bookingData, endLocation: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                )}

                {endLocationType === 'city' && (
                  <div className="relative">
                    <select
                      required
                      value={bookingData.endLocation}
                      onChange={(e) => setBookingData({ ...bookingData, endLocation: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Sélectionner une ville</option>
                      {moroccanCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Section Date et Heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 text-teal-600 mr-1" />
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 text-teal-600 mr-1" />
                    Heure
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Section Demandes spéciales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demandes spéciales (optionnel)
                </label>
                <textarea
                  placeholder="Arrêts supplémentaires, préférences particulières..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center text-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-75"
              >
                <Check className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Traitement en cours...' : 'Valider la réservation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={(e) => e.target === modalRef.current && setShowConfirmation(false)}
          ref={modalRef}
        >
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Confirmer la réservation</h3>
              <p className="text-teal-100">Vérifiez les détails de votre réservation</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Client:</span>
                </div>
                <span className="font-medium text-gray-900">{bookingData.clientName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Téléphone:</span>
                </div>
                <span className="font-medium text-gray-900">{bookingData.clientPhone}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Départ:</span>
                </div>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{bookingData.startLocation}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-gray-600">Destination:</span>
                </div>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{bookingData.endLocation}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                  <span className="text-gray-600">Date:</span>
                </div>
                <span className="font-medium">{new Date(bookingData.date).toLocaleDateString('fr-FR')}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-teal-500 mr-2" />
                  <span className="text-gray-600">Heure:</span>
                </div>
                <span className="font-medium">{bookingData.time}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-600">Véhicule:</span>
                </div>
                <span className="font-medium">
                  {bookingData.vehicleName || vehicles.find(v => v.id === bookingData.vehicleId)?.name}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-gray-900 font-semibold text-lg">Prix estimé:</span>
                <span className="text-teal-600 font-bold text-xl">{estimatedPrice} MAD</span>
              </div>
            </div>

            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-4 text-gray-700 font-medium transition-all hover:bg-gray-50"
              >
                Modifier
              </button>
              <button
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium py-4 transition-all hover:opacity-90 disabled:opacity-75"
              >
                {isSubmitting ? 'Confirmation...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;