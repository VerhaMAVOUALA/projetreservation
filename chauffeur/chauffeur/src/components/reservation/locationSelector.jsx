import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationSelector = ({
  label,
  iconColor,
  location,
  locationType,
  showCurrentOption = false,
  currentLocation = '',
  isGettingLocation = false,
  onLocationChange,
  onLocationTypeChange,
  onGetCurrentLocation
}) => {
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tangier', 'Meknes', 
    'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'El Jadida',
    'Beni Mellal', 'Errachidia', 'Taza', 'Essaouira', 'Agadir', 'Ouarzazate'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
        <MapPin className={`h-4 w-4 ${iconColor} mr-1`} />
        {label}
      </label>
      
      <div className="mb-3 space-y-2">
        {showCurrentOption && (
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="current"
              name="locationType"
              value="current"
              checked={locationType === 'current'}
              onChange={(e) => onLocationTypeChange(e.target.value)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <label htmlFor="current" className="text-sm text-gray-700">
              Ma position actuelle
            </label>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="manual"
            name="locationType"
            value="manual"
            checked={locationType === 'manual'}
            onChange={(e) => onLocationTypeChange(e.target.value)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
          />
          <label htmlFor="manual" className="text-sm text-gray-700">
            Saisir une adresse
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="city"
            name="locationType"
            value="city"
            checked={locationType === 'city'}
            onChange={(e) => onLocationTypeChange(e.target.value)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
          />
          <label htmlFor="city" className="text-sm text-gray-700">
            Choisir une ville
          </label>
        </div>
      </div>

      {locationType === 'current' && showCurrentOption && onGetCurrentLocation && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isGettingLocation ? 'Localisation en cours...' : 'Utiliser ma position'}
          </button>
          {currentLocation && (
            <p className="text-sm text-gray-600 p-2 bg-green-50 rounded border">
              Position: {currentLocation}
            </p>
          )}
        </div>
      )}

      {locationType === 'manual' && (
        <input
          type="text"
          placeholder="Entrez votre adresse complète"
          required
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors duration-200"
        />
      )}

      {locationType === 'city' && (
        <select
          required
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors duration-200"
        >
          <option value="">Sélectionner une ville</option>
          {moroccanCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LocationSelector;