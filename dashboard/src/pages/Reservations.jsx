
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, MapPin, User, Car, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Données simulées
  const reservations = [
    {
      id: 'RES001',
      client: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      driver: 'Jean Dupont',
      vehicle: 'Mercedes Classe S',
      pickup: 'Aéroport Charles de Gaulle',
      destination: 'Hotel Le Bristol, Paris',
      date: '2024-01-27',
      time: '14:30',
      duration: '45 min',
      distance: '32 km',
      price: 180,
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Client VIP - Accueil personnalisé demandé'
    },
    {
      id: 'RES002',
      client: 'Paul Martin',
      clientEmail: 'paul.martin@corporate.com',
      driver: 'Pierre Moreau',
      vehicle: 'BMW Série 7',
      pickup: 'La Défense',
      destination: 'Aéroport Orly',
      date: '2024-01-27',
      time: '16:00',
      duration: '50 min',
      distance: '28 km',
      price: 165,
      status: 'in-progress',
      paymentStatus: 'pending',
      notes: 'Attendre dans le hall d\'arrivée'
    },
    {
      id: 'RES003',
      client: 'Sophie Bernard',
      clientEmail: 'sophie.bernard@gmail.com',
      driver: 'Michel Blanc',
      vehicle: 'Audi A8',
      pickup: 'Gare du Nord',
      destination: 'Château de Versailles',
      date: '2024-01-28',
      time: '10:00',
      duration: '1h 15min',
      distance: '42 km',
      price: 220,
      status: 'pending',
      paymentStatus: 'pending',
      notes: 'Visite guidée prévue - Attendre le client'
    },
    {
      id: 'RES004',
      client: 'Lucas Garcia',
      clientEmail: 'lucas.garcia@startup.io',
      driver: 'Antoine Roux',
      vehicle: 'Tesla Model S',
      pickup: 'Place Vendôme',
      destination: 'Aéroport Charles de Gaulle',
      date: '2024-01-26',
      time: '08:30',
      duration: '55 min',
      distance: '35 km',
      price: 190,
      status: 'completed',
      paymentStatus: 'paid',
      notes: 'Vol international - Terminal 2E'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { label: 'Confirmée', class: 'badge-info', icon: CheckCircle },
      'in-progress': { label: 'En cours', class: 'badge-warning', icon: Clock },
      'pending': { label: 'En attente', class: 'badge-warning', icon: AlertCircle },
      'completed': { label: 'Terminée', class: 'badge-success', icon: CheckCircle },
      'cancelled': { label: 'Annulée', class: 'badge-danger', icon: XCircle },
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-info', icon: AlertCircle };
    const IconComponent = config.icon;
    return (
      <span className={`badge ${config.class} flex items-center gap-1`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const config = {
      'paid': { label: 'Payé', class: 'badge-success' },
      'pending': { label: 'En attente', class: 'badge-warning' },
      'failed': { label: 'Échec', class: 'badge-danger' },
    };
    
    const statusConfig = config[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${statusConfig.class}`}>{statusConfig.label}</span>;
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des réservations</h1>
          <p className="text-gray-600">Suivez et gérez toutes vos réservations</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Nouvelle réservation
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
                placeholder="Rechercher par client, ID, chauffeur ou véhicule..."
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
              <option value="confirmed">Confirmée</option>
              <option value="in-progress">En cours</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
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
            <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
            <p className="text-sm text-gray-600">Total réservations</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <Clock className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{reservations.filter(r => r.status === 'in-progress').length}</p>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{reservations.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm text-gray-600">Terminées</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="mx-auto mb-2 text-purple-500">€</div>
            <p className="text-2xl font-bold text-gray-800">{reservations.reduce((sum, r) => sum + r.price, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Chiffre d'affaires</p>
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Réservations ({filteredReservations.length})</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {filteredReservations.map(reservation => (
              <div key={reservation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">#{reservation.id}</h4>
                      {getStatusBadge(reservation.status)}
                      {getPaymentBadge(reservation.paymentStatus)}
                    </div>
                    <p className="text-gray-600">{reservation.date} à {reservation.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">€{reservation.price}</p>
                    <p className="text-sm text-gray-600">{reservation.duration}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Client</p>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} />
                      <span className="font-medium text-gray-800">{reservation.client}</span>
                    </div>
                    <p className="text-sm text-gray-600">{reservation.clientEmail}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Chauffeur & Véhicule</p>
                    <p className="font-medium text-gray-800 mb-1">{reservation.driver}</p>
                    <div className="flex items-center gap-2">
                      <Car size={14} />
                      <span className="text-sm text-gray-600">{reservation.vehicle}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Trajet</p>
                    <div className="flex items-start gap-2 mb-1">
                      <MapPin size={14} className="mt-0.5 text-green-500" />
                      <span className="text-sm text-gray-800">{reservation.pickup}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 text-red-500" />
                      <span className="text-sm text-gray-800">{reservation.destination}</span>
                    </div>
                  </div>
                </div>

                {reservation.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{reservation.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Distance: {reservation.distance}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      <Eye size={16} />
                      Détails
                    </button>
                    {reservation.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm">
                          <CheckCircle size={16} />
                          Confirmer
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <XCircle size={16} />
                          Annuler
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de détails de réservation */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Détails de la réservation #{selectedReservation.id}</h2>
              <button 
                onClick={() => setSelectedReservation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Informations client</h3>
                  <p><strong>Nom:</strong> {selectedReservation.client}</p>
                  <p><strong>Email:</strong> {selectedReservation.clientEmail}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Service</h3>
                  <p><strong>Chauffeur:</strong> {selectedReservation.driver}</p>
                  <p><strong>Véhicule:</strong> {selectedReservation.vehicle}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Détails du trajet</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-green-500" size={16} />
                    <span><strong>Départ:</strong> {selectedReservation.pickup}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-red-500" size={16} />
                    <span><strong>Arrivée:</strong> {selectedReservation.destination}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-blue-500" size={16} />
                    <span><strong>Date:</strong> {selectedReservation.date} à {selectedReservation.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-purple-500" size={16} />
                    <span><strong>Durée estimée:</strong> {selectedReservation.duration} ({selectedReservation.distance})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Statut</h3>
                  {getStatusBadge(selectedReservation.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Paiement</h3>
                  <div className="flex items-center gap-3">
                    {getPaymentBadge(selectedReservation.paymentStatus)}
                    <span className="text-xl font-bold text-green-600">€{selectedReservation.price}</span>
                  </div>
                </div>
              </div>

              {selectedReservation.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-gray-700">{selectedReservation.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedReservation(null)}
              >
                Fermer
              </button>
              <button className="btn btn-primary">
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
