
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Users, Mail, Phone, Calendar, Star, TrendingUp } from 'lucide-react';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Données simulées
  const clients = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      company: 'Tech Solutions',
      totalReservations: 45,
      totalSpent: 12500,
      lastReservation: '2024-01-25',
      rating: 4.8,
      status: 'premium',
      joinDate: '2022-03-15',
      preferredVehicles: ['Mercedes Classe S', 'BMW Série 7']
    },
    {
      id: 2,
      name: 'Paul Martin',
      email: 'paul.martin@corporate.com',
      phone: '+33 6 98 76 54 32',
      company: 'Martin & Associés',
      totalReservations: 32,
      totalSpent: 8750,
      lastReservation: '2024-01-23',
      rating: 4.9,
      status: 'vip',
      joinDate: '2021-08-20',
      preferredVehicles: ['Audi A8', 'Tesla Model S']
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@gmail.com',
      phone: '+33 6 55 44 33 22',
      company: null,
      totalReservations: 18,
      totalSpent: 4200,
      lastReservation: '2024-01-20',
      rating: 4.6,
      status: 'regular',
      joinDate: '2023-01-10',
      preferredVehicles: ['Mercedes Classe S']
    },
    {
      id: 4,
      name: 'Lucas Garcia',
      email: 'lucas.garcia@startup.io',
      phone: '+33 6 11 22 33 44',
      company: 'InnovTech',
      totalReservations: 12,
      totalSpent: 3100,
      lastReservation: '2024-01-18',
      rating: 4.7,
      status: 'regular',
      joinDate: '2023-06-05',
      preferredVehicles: ['BMW Série 7', 'Audi A8']
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'premium': { label: 'Premium', class: 'badge-warning' },
      'vip': { label: 'VIP', class: 'badge-success' },
      'regular': { label: 'Régulier', class: 'badge-info' },
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des clients</h1>
          <p className="text-gray-600">Gérez votre portefeuille client</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Ajouter un client
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
                placeholder="Rechercher par nom, email, téléphone ou entreprise..."
                className="form-control pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={20} />
              Filtres avancés
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <Users className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
            <p className="text-sm text-gray-600">Total clients</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <Star className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{clients.filter(c => c.status === 'vip').length}</p>
            <p className="text-sm text-gray-600">Clients VIP</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <TrendingUp className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">€{clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Chiffre d'affaires</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <Calendar className="mx-auto mb-2 text-purple-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{clients.reduce((sum, c) => sum + c.totalReservations, 0)}</p>
            <p className="text-sm text-gray-600">Total réservations</p>
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Liste des clients ({filteredClients.length})</h3>
        </div>
        <div className="card-body">
          <div className="grid gap-4">
            {filteredClients.map(client => (
              <div key={client.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-gray-800">{client.name}</h4>
                      {getStatusBadge(client.status)}
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-medium text-gray-700">{client.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Contact</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <Mail size={14} />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={14} />
                          <span>{client.phone}</span>
                        </div>
                        {client.company && (
                          <p className="text-sm text-gray-600 mt-1">{client.company}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Statistiques</p>
                        <p className="text-sm text-gray-700 mb-1">{client.totalReservations} réservations</p>
                        <p className="text-sm text-gray-700 mb-1">€{client.totalSpent.toLocaleString()} dépensés</p>
                        <p className="text-sm text-gray-600">Dernière: {client.lastReservation}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Préférences</p>
                        <div className="flex flex-wrap gap-1">
                          {client.preferredVehicles.slice(0, 2).map(vehicle => (
                            <span key={vehicle} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {vehicle}
                            </span>
                          ))}
                          {client.preferredVehicles.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{client.preferredVehicles.length - 2}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Client depuis {client.joinDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Panier moyen: €{Math.round(client.totalSpent / client.totalReservations).toLocaleString()}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajouter un nouveau client</h2>
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
                <input type="text" className="form-control" placeholder="Marie Dubois" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="marie.dubois@email.com" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-control" placeholder="+33 6 12 34 56 78" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Entreprise (optionnel)</label>
                <input type="text" className="form-control" placeholder="Tech Solutions" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Type de client</label>
                <select className="form-control">
                  <option value="regular">Régulier</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Source d'acquisition</label>
                <select className="form-control">
                  <option>Site web</option>
                  <option>Recommandation</option>
                  <option>Publicité</option>
                  <option>Partenaire</option>
                </select>
              </div>
              
              <div className="form-group col-span-2">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="3" placeholder="Informations complémentaires sur le client..."></textarea>
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
                  Ajouter le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
