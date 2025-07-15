
import React, { useState } from 'react';
import { User, Bell, Shield, Database, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    newBookings: true,
    driverUpdates: true,
    systemAlerts: true,
    emailReports: false,
    smsNotifications: false
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Database },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'general', label: 'Général', icon: Globe }
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du profil</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input type="text" className="form-control" defaultValue="Administrateur" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="admin@luxedrive.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input type="tel" className="form-control" defaultValue="+33 1 23 45 67 89" />
                </div>
                <div className="form-group">
                  <label className="form-label">Poste</label>
                  <input type="text" className="form-control" defaultValue="Directeur général" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Photo de profil</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  A
                </div>
                <div>
                  <button className="btn btn-primary btn-sm mb-2">Changer la photo</button>
                  <p className="text-sm text-gray-600">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'entreprise</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Nom de l'entreprise</label>
                  <input type="text" className="form-control" defaultValue="LuxeDrive Services" />
                </div>
                <div className="form-group">
                  <label className="form-label">SIRET</label>
                  <input type="text" className="form-control" defaultValue="12345678901234" />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Adresse</label>
                  <textarea className="form-control" rows="3" defaultValue="123 Avenue des Champs-Élysées&#10;75008 Paris, France"></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Préférences de notification</h2>
              <div className="space-y-4">
                {Object.entries({
                  newBookings: 'Nouvelles réservations',
                  driverUpdates: 'Mises à jour des chauffeurs',
                  systemAlerts: 'Alertes système',
                  emailReports: 'Rapports par email',
                  smsNotifications: 'Notifications SMS'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{label}</h4>
                      <p className="text-sm text-gray-600">Recevoir des notifications pour {label.toLowerCase()}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Canaux de notification</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="card">
                  <div className="card-body text-center">
                    <Bell className="mx-auto mb-2 text-blue-500" size={24} />
                    <h4 className="font-medium">Application</h4>
                    <p className="text-sm text-gray-600">Notifications push</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <User className="mx-auto mb-2 text-green-500" size={24} />
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-gray-600">admin@luxedrive.com</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <Bell className="mx-auto mb-2 text-purple-500" size={24} />
                    <h4 className="font-medium">SMS</h4>
                    <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sécurité du compte</h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Mot de passe actuel</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control pr-10" 
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentification à deux facteurs</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800">2FA non activée</h4>
                    <p className="text-sm text-blue-600">Activez l'authentification à deux facteurs pour sécuriser votre compte</p>
                  </div>
                  <button className="btn btn-primary btn-sm">Activer 2FA</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions actives</h3>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'Paris, France', time: 'Maintenant', current: true },
                  { device: 'iPhone 13', location: 'Paris, France', time: 'Il y a 2h', current: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{session.device}</h4>
                      <p className="text-sm text-gray-600">{session.location} • {session.time}</p>
                    </div>
                    {session.current ? (
                      <span className="badge badge-success">Session actuelle</span>
                    ) : (
                      <button className="btn btn-danger btn-sm">Déconnecter</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration système</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Devise par défaut</label>
                  <select className="form-control">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuseau horaire</label>
                  <select className="form-control">
                    <option>Europe/Paris (UTC+1)</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Format de date</label>
                  <select className="form-control">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Langue de l'interface</label>
                  <select className="form-control">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Paramètres de sauvegarde</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Sauvegarde automatique</h4>
                    <p className="text-sm text-gray-600">Sauvegarde quotidienne des données</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Dernière sauvegarde</h4>
                  <p className="text-sm text-gray-600 mb-3">26 janvier 2024 à 03:00</p>
                  <button className="btn btn-secondary btn-sm">Créer une sauvegarde maintenant</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Apparence de l'interface</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['Clair', 'Sombre', 'Auto'].map(theme => (
                  <div key={theme} className="card cursor-pointer hover:shadow-md transition-shadow">
                    <div className="card-body text-center">
                      <div className={`w-16 h-12 mx-auto mb-3 rounded-lg ${
                        theme === 'Clair' ? 'bg-white border-2 border-gray-200' :
                        theme === 'Sombre' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                      }`}></div>
                      <h4 className="font-medium">{theme}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personnalisation</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Couleur d'accent</label>
                  <div className="flex gap-3">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                      <button 
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Animations réduites</h4>
                    <p className="text-sm text-gray-600">Diminue les animations pour améliorer les performances</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres généraux</h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Nom de l'application</label>
                  <input type="text" className="form-control" defaultValue="LuxeDrive Admin" />
                </div>
                <div className="form-group">
                  <label className="form-label">URL de base</label>
                  <input type="url" className="form-control" defaultValue="https://admin.luxedrive.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email de contact</label>
                  <input type="email" className="form-control" defaultValue="contact@luxedrive.com" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Intégrations</h3>
              <div className="space-y-3">
                {[
                  { name: 'Google Maps API', status: 'Connecté', color: 'green' },
                  { name: 'Stripe Payments', status: 'Connecté', color: 'green' },
                  { name: 'SMS Gateway', status: 'Non configuré', color: 'yellow' },
                  { name: 'Email Service', status: 'Connecté', color: 'green' }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{integration.name}</h4>
                      <span className={`badge badge-${integration.color === 'green' ? 'success' : 'warning'}`}>
                        {integration.status}
                      </span>
                    </div>
                    <button className="btn btn-secondary btn-sm">Configurer</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Zone de danger</h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Réinitialiser l'application</h4>
                <p className="text-sm text-red-600 mb-4">Cette action supprimera toutes les données et ne peut pas être annulée.</p>
                <button className="btn btn-danger btn-sm">Réinitialiser</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-gray-600">Configurez votre application LuxeDrive</p>
        </div>
        <button className="btn btn-primary">
          <Save size={20} />
          Enregistrer les modifications
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Menu latéral */}
        <div className="card">
          <div className="card-body p-0">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="col-span-3">
          <div className="card">
            <div className="card-body">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
