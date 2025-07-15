
import React from 'react';
import { Car, Users, UserCheck, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import Chart from '../components/Dashboard/Chart';

const Dashboard = () => {
  // Données simulées
  const statsData = [
    { title: 'Total Voitures', value: '24', icon: Car, change: '+2', changeType: 'positive', color: 'blue' },
    { title: 'Total Clients', value: '156', icon: Users, change: '+12', changeType: 'positive', color: 'green' },
    { title: 'Chauffeurs Actifs', value: '18', icon: UserCheck, change: '-1', changeType: 'negative', color: 'yellow' },
    { title: 'Réservations du jour', value: '8', icon: Calendar, change: '+3', changeType: 'positive', color: 'red' },
  ];

  const barChartData = [
    { label: 'Jan', value: 45, color: '#3b82f6' },
    { label: 'Fév', value: 38, color: '#3b82f6' },
    { label: 'Mar', value: 52, color: '#3b82f6' },
    { label: 'Avr', value: 61, color: '#3b82f6' },
    { label: 'Mai', value: 48, color: '#3b82f6' },
    { label: 'Jun', value: 67, color: '#3b82f6' },
  ];

  const lineChartData = [
    { label: 'Lun', value: 12 },
    { label: 'Mar', value: 19 },
    { label: 'Mer', value: 15 },
    { label: 'Jeu', value: 25 },
    { label: 'Ven', value: 22 },
    { label: 'Sam', value: 30 },
    { label: 'Dim', value: 18 },
  ];

  const pieChartData = [
    { label: 'Berlines', value: 12, color: '#3b82f6' },
    { label: 'SUV', value: 8, color: '#10b981' },
    { label: 'Luxe', value: 4, color: '#f59e0b' },
  ];

  const recentReservations = [
    { id: 1, client: 'Marie Dubois', car: 'Mercedes Classe S', driver: 'Jean Dupont', status: 'confirmed', time: '14:30' },
    { id: 2, client: 'Paul Martin', car: 'BMW Série 7', driver: 'Pierre Moreau', status: 'in-progress', time: '15:45' },
    { id: 3, client: 'Sophie Bernard', car: 'Audi A8', driver: 'Michel Blanc', status: 'pending', time: '16:20' },
    { id: 4, client: 'Lucas Garcia', car: 'Tesla Model S', driver: 'Antoine Roux', status: 'completed', time: '17:15' },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { label: 'Confirmée', class: 'badge-info' },
      'in-progress': { label: 'En cours', class: 'badge-warning' },
      'pending': { label: 'En attente', class: 'badge-warning' },
      'completed': { label: 'Terminée', class: 'badge-success' },
    };
    
    const config = statusConfig[status] || { label: status, class: 'badge-info' };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="text-blue-500" size={16} />;
      case 'in-progress': return <Clock className="text-yellow-500" size={16} />;
      case 'pending': return <AlertCircle className="text-orange-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp size={16} />
            <span>Dernière mise à jour: il y a 5 min</span>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Chart 
          type="bar" 
          data={barChartData} 
          title="Réservations par mois" 
          height={300}
        />
        <Chart 
          type="line" 
          data={lineChartData} 
          title="Activité de la semaine" 
          height={300}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Chart 
            type="pie" 
            data={pieChartData} 
            title="Répartition des véhicules" 
            height={300}
          />
        </div>
        
        {/* Réservations récentes */}
        <div className="col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Réservations récentes</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(reservation.status)}
                      <div>
                        <p className="font-semibold text-gray-800">{reservation.client}</p>
                        <p className="text-sm text-gray-600">{reservation.car} • {reservation.driver}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{reservation.time}</span>
                      {getStatusBadge(reservation.status)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="btn btn-primary btn-sm">Voir toutes les réservations</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
