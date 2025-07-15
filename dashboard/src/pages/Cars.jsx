
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Car, Fuel, Users, Calendar } from 'lucide-react';

const Cars = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Données simulées
  const cars = [
    {
      id: 1,
      brand: 'Mercedes',
      model: 'Classe S',
      year: 2023,
      plate: 'AA-123-BB',
      type: 'Berline',
      fuel: 'Essence',
      seats: 5,
      status: 'available',
      image: '/placeholder.svg',
      mileage: 15000,
      lastMaintenance: '2024-01-15'
    },
    {
      id: 2,
      brand: 'BMW',
      model: 'Série 7',
      year: 2022,
      plate: 'BB-456-CC',
      type: 'Berline',
      fuel: 'Hybride',
      seats: 5,
      status: 'rented',
      image: '/placeholder.svg',
      mileage: 28000,
      lastMaintenance: '2024-01-20'
    },
    {
      id: 3,
      brand: 'Audi',
      model: 'A8',
      year: 2023,
      plate: 'CC-789-DD',
      type: 'Berline',
      fuel: 'Diesel',
      seats: 5,
      status: 'maintenance',
      image: '/placeholder.svg',
      mileage: 12000,
      lastMaintenance: '2024-01-25'
    },
    {
      id: 4,
      brand: 'Tesla',
      model: 'Model S',
      year: 2023,
      plate: 'DD-012-EE',
      type: 'Berline',
      fuel: 'Électrique',
      seats: 5,
      status: 'available',
      image: '/placeholder.svg',
      mileage: 8000,
      lastMaintenance: '2024-01-10'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { label: 'Disponible', class: 'badge-success' },
      'rented': { label: 'Louée', class: 'badge-warning' },
      'maintenance': { label: 'Maintenance', class: 'badge-danger' },
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredCars = cars.filter(car =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des voitures</h1>
          <p className="text-gray-600">Gérez votre flotte de véhicules</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Ajouter une voiture
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par marque, modèle ou plaque..."
                className="form-control pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={20} />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <Car className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{cars.length}</p>
            <p className="text-sm text-gray-600">Total véhicules</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{cars.filter(c => c.status === 'available').length}</p>
            <p className="text-sm text-gray-600">Disponibles</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{cars.filter(c => c.status === 'rented').length}</p>
            <p className="text-sm text-gray-600">En location</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{cars.filter(c => c.status === 'maintenance').length}</p>
            <p className="text-sm text-gray-600">En maintenance</p>
          </div>
        </div>
      </div>

      {/* Liste des voitures */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Liste des véhicules ({filteredCars.length})</h3>
        </div>
        <div className="card-body">
          <div className="grid gap-4">
            {filteredCars.map(car => (
              <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car size={32} className="text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {car.brand} {car.model} ({car.year})
                      </h4>
                      {getStatusBadge(car.status)}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span>{car.plate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel size={16} />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{car.seats} places</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary btn-sm">
                      <Edit size={16} />
                      Modifier
                    </button>
                    <button className="btn btn-danger btn-sm">
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout (modal simulé) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajouter une nouvelle voiture</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Marque</label>
                <input type="text" className="form-control" placeholder="Mercedes, BMW, Audi..." />
              </div>
              
              <div className="form-group">
                <label className="form-label">Modèle</label>
                <input type="text" className="form-control" placeholder="Classe S, Série 7..." />
              </div>
              
              <div className="form-group">
                <label className="form-label">Année</label>
                <input type="number" className="form-control" placeholder="2023" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Plaque d'immatriculation</label>
                <input type="text" className="form-control" placeholder="AA-123-BB" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control">
                  <option>Berline</option>
                  <option>SUV</option>
                  <option>Break</option>
                  <option>Coupé</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Carburant</label>
                <select className="form-control">
                  <option>Essence</option>
                  <option>Diesel</option>
                  <option>Hybride</option>
                  <option>Électrique</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Nombre de places</label>
                <input type="number" className="form-control" placeholder="5" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Kilométrage</label>
                <input type="number" className="form-control" placeholder="15000" />
              </div>
              
              <div className="form-group col-span-2">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Description du véhicule..."></textarea>
              </div>
              
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter la voiture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;