import React, { useState } from 'react';
import { Car, Users, Settings, Star } from 'lucide-react';

const VehiclesList = ({ onSelectVehicle }) => {
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour le filtre de type de véhicule
  const [filterType, setFilterType] = useState('all');
  
  // Liste complète des véhicules disponibles
  const [vehicles] = useState([
    {
      id: '1',
      model: 'Classe S',
      brand: 'Mercedes',
      type: 'luxury',
      seats: 4,
      pricePerHour: 450,
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop',
      available: true,
      rating: 4.8,
      features: ['Climatisation', 'GPS', 'WiFi', 'Sièges cuir', 'Chauffeur professionnel']
    },
    {
      id: '2',
      model: 'Série 7',
      brand: 'BMW',
      type: 'luxury',
      seats: 4,
      pricePerHour: 420,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      available: true,
      rating: 4.7,
      features: ['Climatisation', 'GPS', 'Sièges chauffants', 'Toit ouvrant', 'Chauffeur expérimenté']
    },
    {
      id: '3',
      model: 'A8',
      brand: 'Audi',
      type: 'luxury',
      seats: 4,
      pricePerHour: 400,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
      available: false,
      rating: 4.6,
      features: ['Climatisation', 'GPS', 'Système audio premium', 'Service premium']
    },
    {
      id: '4',
      model: 'Vito',
      brand: 'Mercedes',
      type: 'van',
      seats: 8,
      pricePerHour: 350,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      available: true,
      rating: 4.5,
      features: ['Climatisation', 'GPS', 'Espace bagages', 'Idéal groupes']
    },
    {
      id: '5',
      model: 'Logan',
      brand: 'Dacia',
      type: 'standard',
      seats: 5,
      pricePerHour: 180,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      available: true,
      rating: 4.2,
      features: ['Climatisation', 'GPS', 'Économique', 'Ville et autoroute']
    }
  ]);

  // Filtrer les véhicules selon la recherche et le type sélectionné
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vehicle.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Gérer la réservation d'un véhicule
  const handleReserve = (vehicle) => {
    console.log(`Réservation du véhicule ${vehicle.id}`);
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et compteur */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Voitures Disponibles au Maroc</h1>
        <div className="text-sm text-gray-600">
          {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} trouvé{filteredVehicles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border">
        {/* Champ de recherche */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par marque ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        
        {/* Sélecteur de type */}
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">Tout type</option>
            <option value="luxury">Luxe</option>
            <option value="standard">Standard</option>
            <option value="van">Van</option>
          </select>
        </div>
      </div>

      {/* Grille des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Image du véhicule avec overlay si indisponible */}
            <div className="relative">
              <img
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
              
              {!vehicle.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full">
                    Non disponible
                  </span>
                </div>
              )}
              
              {/* Badge d'évaluation */}
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{vehicle.rating}</span>
              </div>
            </div>

            {/* En-tête de la carte avec informations principales */}
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{vehicle.seats} places</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Settings className="h-4 w-4" />
                      <span className="capitalize">{vehicle.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu détaillé de la carte */}
            <div className="px-6 pb-6 space-y-4">
              {/* Section des équipements */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Équipements</h4>
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pied de carte avec prix et bouton */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <span className="text-2xl font-bold text-teal-600">{vehicle.pricePerHour}</span>
                  <span className="text-gray-600 text-sm"> MAD/heure</span>
                </div>
                <button
                  onClick={() => handleReserve(vehicle)}
                  disabled={!vehicle.available}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    vehicle.available
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-gray-400 cursor-not-allowed text-white'
                  }`}
                >
                  <Car className="h-4 w-4" />
                  <span>{vehicle.available ? 'Réserver' : 'Indisponible'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message quand aucun résultat n'est trouvé */}
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun véhicule trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;