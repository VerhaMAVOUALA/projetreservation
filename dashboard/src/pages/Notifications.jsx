
import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, Search, Filter, Settings } from 'lucide-react';

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'Nouvelle réservation',
      message: 'Marie Dubois a effectué une nouvelle réservation pour le 28/01/2024 à 14:30',
      time: '5 min',
      read: false,
      priority: 'high',
      icon: Bell,
      color: 'blue'
    },
    {
      id: 2,
      type: 'driver',
      title: 'Chauffeur disponible',
      message: 'Jean Dupont vient de terminer sa course et est maintenant disponible',
      time: '12 min',
      read: false,
      priority: 'medium',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance prévue',
      message: 'Mercedes Classe S (AA-123-BB) a une maintenance programmée demain à 9h',
      time: '1h',
      read: true,
      priority: 'medium',
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Paiement reçu',
      message: 'Paiement de €185 reçu pour la réservation #RES001',
      time: '2h',
      read: true,
      priority: 'low',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 5,
      type: 'system',
      title: 'Mise à jour système',
      message: 'Une nouvelle version de l\'application est disponible',
      time: '3h',
      read: false,
      priority: 'low',
      icon: Info,
      color: 'blue'
    },
    {
      id: 6,
      type: 'booking',
      title: 'Réservation annulée',
      message: 'Paul Martin a annulé sa réservation prévue pour aujourd\'hui',
      time: '4h',
      read: true,
      priority: 'medium',
      icon: X,
      color: 'red'
    }
  ];

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    const colorClasses = {
      blue: 'text-blue-500 bg-blue-100',
      green: 'text-green-500 bg-green-100',
      yellow: 'text-yellow-500 bg-yellow-100',
      red: 'text-red-500 bg-red-100'
    };

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[notification.color]}`}>
        <IconComponent size={20} />
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { label: 'Haute', class: 'badge-danger' },
      'medium': { label: 'Moyenne', class: 'badge-warning' },
      'low': { label: 'Basse', class: 'badge-info' }
    };

    const config = priorityConfig[priority] || { label: priority, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.read) ||
                         (selectedFilter === 'read' && notification.read) ||
                         notification.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Centre de notifications</h1>
          <p className="text-gray-600">
            Gérez vos notifications • {unreadCount} non lues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <Settings size={20} />
            Paramètres
          </button>
          <button className="btn btn-primary">
            <CheckCircle size={20} />
            Marquer tout comme lu
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher dans les notifications..."
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

          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'unread', label: 'Non lues' },
              { value: 'booking', label: 'Réservations' },
              { value: 'driver', label: 'Chauffeurs' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'payment', label: 'Paiements' },
              { value: 'system', label: 'Système' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <Bell className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
            <p className="text-sm text-gray-600">Total notifications</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{unreadCount}</p>
            <p className="text-sm text-gray-600">Non lues</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <AlertCircle className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{notifications.filter(n => n.priority === 'high').length}</p>
            <p className="text-sm text-gray-600">Priorité haute</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-2xl font-bold text-gray-800">{notifications.filter(n => n.read).length}</p>
            <p className="text-sm text-gray-600">Traitées</p>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Notifications ({filteredNotifications.length})</h3>
        </div>
        <div className="card-body">
          <div className="space-y-1">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                {getNotificationIcon(notification)}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    {getPriorityBadge(notification.priority)}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                  <p className="text-gray-500 text-xs">Il y a {notification.time}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button className="btn btn-primary btn-sm">
                      <CheckCircle size={14} />
                      Marquer comme lu
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm">
                    <X size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">Aucune notification ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;