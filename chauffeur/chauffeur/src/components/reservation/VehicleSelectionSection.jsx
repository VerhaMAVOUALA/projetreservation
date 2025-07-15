import React from 'react';
import { Car } from 'lucide-react';

const VehicleSelectionSection = ({
  selectedVehicle,
  vehicleId,
  onVehicleChange
}) => {
  const vehicles = [
    { id: '1', name: 'Mercedes Classe S', pricePerHour: 450 },
    { id: '2', name: 'BMW Série 7', pricePerHour: 420 },
    { id: '3', name: 'Audi A8', pricePerHour: 400 },
    { id: '4', name: 'Mercedes Vito', pricePerHour: 350 },
    { id: '5', name: 'Dacia Logan', pricePerHour: 180 }
  ];

  if (selectedVehicle) {
    return (
      <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 className="text-lg font-semibold text-teal-800 mb-2">Véhicule sélectionné</h3>
        <div className="flex items-center space-x-4">
          <img 
            src={selectedVehicle.image} 
            alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
            className="w-20 h-15 object-cover rounded"
          />
          <div>
            <p className="font-medium text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</p>
            <p className="text-sm text-gray-600">{selectedVehicle.seats} places • {selectedVehicle.type}</p>
            <p className="text-lg font-bold text-teal-600">{selectedVehicle.pricePerHour} MAD/heure</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Car className="h-4 w-4 text-teal-600 mr-1" />
        Choix du véhicule
      </label>
      <select
        required
        value={vehicleId}
        onChange={(e) => {
          const vehicle = vehicles.find(v => v.id === e.target.value);
          onVehicleChange(
            e.target.value,
            vehicle?.name || '',
            vehicle?.pricePerHour || 0
          );
        }}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
      >
        <option value="">Sélectionner un véhicule</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.name} - {vehicle.pricePerHour} MAD/heure
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelectionSection;