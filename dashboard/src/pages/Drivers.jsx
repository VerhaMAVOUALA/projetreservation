
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, UserCheck, Phone, MapPin, Star, Clock, User } from 'lucide-react';

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Données simulées
  const drivers = [
    {
      id: 1,
      name: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
      email: 'jean.dupont@luxedrive.com',
      license: 'FR123456789',
      zone: 'Paris Centre',
      status: 'available',
      rating: 4.8,
      totalRides: 245,
      experience: '5 ans',
      languages: ['Français', 'Anglais'],
      avatar: '/placeholder.svg',
      joinDate: '2019-03-15'
    },
    {
      id: 2,
      name: 'Pierre Moreau',
      phone: '+33 6 98 76 54 32',
      email: 'pierre.moreau@luxedrive.com',
      license: 'FR987654321',
      zone: 'La Défense',
      status: 'busy',
      rating: 4.9,
      totalRides: 189,
      experience: '3 ans',
      languages: ['Français', 'Espagnol'],
      avatar: '/placeholder.svg',
      joinDate: '2021-01-20'
    },
    {
      id: 3,
      name: 'Michel Blanc',
      phone: '+33 6 55 44 33 22',
      email: 'michel.blanc@luxedrive.com',
      license: 'FR456789123',
      zone: 'Aéroport CDG',
      status: 'available',
      rating: 4.7,
      totalRides: 312,
      experience: '7 ans',
      languages: ['Français', 'Anglais', 'Allemand'],
      avatar: '/placeholder.svg',
      joinDate: '2017-09-10'
    },
    {
      id: 4,
      name: 'Antoine Roux',
      phone: '+33 6 11 22 33 44',
      email: 'antoine.roux@luxedrive.com',
      license: 'FR789123456',
      zone: 'Versailles',
      status: 'offline',
      rating: 4.6,
      totalRides: 156,
      experience: '2 ans',
      languages: ['Français'],
      avatar: '/placeholder.svg',
      joinDate: '2022-06-01'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { label: 'Disponible', class: 'badge-success' },
      'busy': { label: 'Occupé', class: 'badge-warning' },
      'offline': { label: 'Hors ligne', class: 'badge-danger' },
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des chauffeurs</h1>
          <p className="text-gray-600">Gérez votre équipe de chauffeurs professionnels</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Ajouter un chauffeur
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
                placeholder="Rechercher par nom, téléphone ou zone..."
                className="form-control pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="form-control w-48"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="busy">Occupé</option>
              <option value="offline">Hors ligne</option>
            </select>
            <button className="btn btn-secondary">
              <Filter size={20} />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <UserCheck className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{drivers.length}</p>
            <p className="text-sm text-gray-600">Total chauffeurs</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{drivers.filter(d => d.status === 'available').length}</p>
            <p className="text-sm text-gray-600">Disponibles</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{drivers.filter(d => d.status === 'busy').length}</p>
            <p className="text-sm text-gray-600">En service</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <Star className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">4.8</p>
            <p className="text-sm text-gray-600">Note moyenne</p>
          </div>
        </div>
      </div>

      {/* Liste des chauffeurs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Équipe de chauffeurs ({filteredDrivers.length})</h3>
        </div>
        <div className="card-body">
          <div className="grid gap-6">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-800">{driver.name}</h4>
                      {getStatusBadge(driver.status)}
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-medium text-gray-700">{driver.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Contact</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <Phone size={14} />
                          <span>{driver.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600">{driver.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Zone de service</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin size={14} />
                          <span>{driver.zone}</span>
                        </div>
                        <p className="text-sm text-gray-600">Permis: {driver.license}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Statistiques</p>
                        <p className="text-sm text-gray-700">{driver.totalRides} courses</p>
                        <p className="text-sm text-gray-600">{driver.experience} d'expérience</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {driver.languages.map(lang => (
                          <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout (modal simulé) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajouter un nouveau chauffeur</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input type="text" className="form-control" placeholder="Jean Dupont" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="jean.dupont@luxedrive.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-control" placeholder="+33 6 12 34 56 78" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Numéro de permis</label>
                <input type="text" className="form-control" placeholder="FR123456789" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Zone de service</label>
                <select className="form-control">
                  <option>Paris Centre</option>
                  <option>La Défense</option>
                  <option>Aéroport CDG</option>
                  <option>Aéroport Orly</option>
                  <option>Versailles</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Expérience (années)</label>
                <input type="number" className="form-control" placeholder="5" />
              </div>
              
              <div className="form-group col-span-2">
                <label className="form-label">Langues parlées</label>
                <div className="flex gap-3 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Français</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Anglais</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Espagnol</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Allemand</span>
                  </label>
                </div>
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
                  Ajouter le chauffeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
