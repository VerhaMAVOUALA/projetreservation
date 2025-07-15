
import React, { useState } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react';
import Chart from '../components/Dashboard/Chart';

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Données simulées pour les graphiques
  const revenueData = [
    { label: 'Jan', value: 45000, color: '#3b82f6' },
    { label: 'Fév', value: 38000, color: '#3b82f6' },
    { label: 'Mar', value: 52000, color: '#3b82f6' },
    { label: 'Avr', value: 61000, color: '#3b82f6' },
    { label: 'Mai', value: 48000, color: '#3b82f6' },
    { label: 'Jun', value: 67000, color: '#3b82f6' },
  ];

  const ridesData = [
    { label: 'Jan', value: 245 },
    { label: 'Fév', value: 198 },
    { label: 'Mar', value: 287 },
    { label: 'Avr', value: 324 },
    { label: 'Mai', value: 267 },
    { label: 'Jun', value: 356 },
  ];

  const driverPerformanceData = [
    { label: 'Jean Dupont', value: 89, color: '#10b981' },
    { label: 'Pierre Moreau', value: 76, color: '#3b82f6' },
    { label: 'Michel Blanc', value: 93, color: '#f59e0b' },
    { label: 'Antoine Roux', value: 68, color: '#ef4444' },
  ];

  const vehicleUsageData = [
    { label: 'Mercedes Classe S', value: 35, color: '#3b82f6' },
    { label: 'BMW Série 7', value: 28, color: '#10b981' },
    { label: 'Audi A8', value: 22, color: '#f59e0b' },
    { label: 'Tesla Model S', value: 15, color: '#8b5cf6' },
  ];

  const hourlyDistributionData = [
    { label: '6h', value: 12 },
    { label: '8h', value: 25 },
    { label: '10h', value: 18 },
    { label: '12h', value: 32 },
    { label: '14h', value: 28 },
    { label: '16h', value: 35 },
    { label: '18h', value: 42 },
    { label: '20h', value: 38 },
    { label: '22h', value: 15 },
  ];

  const kpiData = [
    {
      title: 'Chiffre d\'affaires',
      value: '€67,340',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Courses totales',
      value: '356',
      change: '+8.3%',
      changeType: 'positive',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Taux d\'occupation',
      value: '78.2%',
      change: '+5.1%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Note moyenne',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Statistiques avancées</h1>
          <p className="text-gray-600">Analysez les performances de votre activité</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="form-control w-40"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="btn btn-primary">
            <Calendar size={20} />
            Exporter rapport
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`card hover:shadow-lg transition-shadow`}>
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${kpi.color}-100`}>
                  <kpi.icon className={`text-${kpi.color}-600`} size={24} />
                </div>
                <span className={`text-sm font-medium ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Chart 
          type="bar" 
          data={revenueData} 
          title="Évolution du chiffre d'affaires" 
          height={350}
        />
        <Chart 
          type="line" 
          data={ridesData} 
          title="Nombre de courses par mois" 
          height={350}
        />
      </div>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Chart 
          type="pie" 
          data={vehicleUsageData} 
          title="Utilisation des véhicules (%)" 
          height={300}
        />
        
        <Chart 
          type="bar" 
          data={driverPerformanceData} 
          title="Performance des chauffeurs" 
          height={300}
        />

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Métriques clés</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Panier moyen</span>
              <span className="font-semibold text-gray-800">€189</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Distance moyenne</span>
              <span className="font-semibold text-gray-800">28.5 km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Durée moyenne</span>
              <span className="font-semibold text-gray-800">42 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux d'annulation</span>
              <span className="font-semibold text-red-600">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clients récurrents</span>
              <span className="font-semibold text-green-600">67%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution horaire */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">Distribution des courses par heure</h3>
        </div>
        <div className="card-body">
          <Chart 
            type="line" 
            data={hourlyDistributionData} 
            title="" 
            height={250}
          />
        </div>
      </div>

      {/* Tableaux de données */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top clients du mois</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {[
                { name: 'Marie Dubois', rides: 12, amount: '€2,340' },
                { name: 'Paul Martin', rides: 9, amount: '€1,890' },
                { name: 'Sophie Bernard', rides: 7, amount: '€1,456' },
                { name: 'Lucas Garcia', rides: 6, amount: '€1,234' },
              ].map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.rides} courses</p>
                  </div>
                  <span className="font-semibold text-green-600">{client.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Destinations populaires</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {[
                { destination: 'Aéroport CDG', count: 45, percentage: '32%' },
                { destination: 'Aéroport Orly', count: 32, percentage: '23%' },
                { destination: 'Gare du Nord', count: 28, percentage: '20%' },
                { destination: 'La Défense', count: 18, percentage: '13%' },
              ].map((dest, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{dest.destination}</p>
                    <p className="text-sm text-gray-600">{dest.count} courses</p>
                  </div>
                  <span className="font-semibold text-blue-600">{dest.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
