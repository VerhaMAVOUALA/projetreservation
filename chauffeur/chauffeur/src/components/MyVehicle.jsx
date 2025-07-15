import React, { useState, useEffect, useRef } from 'react';
import { Car, Edit, Trash2, Camera, Check, X, Plus, ChevronRight, Star, Wifi, Snowflake, Users, Droplet, Fuel, Settings, AirVent } from 'lucide-react';

const MyVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    brand: 'Mercedes-Benz',
    model: 'Classe E',
    year: '2022',
    licensePlate: 'ABC-123',
    color: 'Noir',
    seats: 5,
    category: 'luxury',
    pricePerHour: 85,
    features: ['Climatisation', 'GPS', 'Sièges chauffants', 'Caméra de recul', 'Bluetooth'],
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    ],
    available: true,
    description: 'Mercedes Classe E 2022 en parfait état. Intérieur cuir noir, système audio premium, sièges massants. Parfait pour les trajets longue distance.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [vehicleId, setVehicleId] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef(null);

  // Simulation de chargement des données
  const fetchVehicleData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowDeleteConfirm(false);
    setIsLoading(false);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = [...vehicleData.images];
      for (let i = 0; i < Math.min(3, files.length); i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages[i] = e.target?.result;
          setVehicleData({ ...vehicleData, images: [...newImages] });
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...vehicleData.images];
    newImages.splice(index, 1);
    setVehicleData({ ...vehicleData, images: newImages });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setVehicleData({
        ...vehicleData,
        features: [...vehicleData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = vehicleData.features.filter((_, i) => i !== index);
    setVehicleData({ ...vehicleData, features: newFeatures });
  };

  const renderFeatureIcon = (feature) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('climat')) return <Snowflake className="h-4 w-4 mr-2 text-blue-500" />;
    if (lowerFeature.includes('gps')) return <Settings className="h-4 w-4 mr-2 text-purple-500" />;
    if (lowerFeature.includes('wifi') || lowerFeature.includes('bluetooth')) return <Wifi className="h-4 w-4 mr-2 text-indigo-500" />;
    if (lowerFeature.includes('siège') || lowerFeature.includes('siege')) return <Users className="h-4 w-4 mr-2 text-amber-500" />;
    return <Star className="h-4 w-4 mr-2 text-yellow-500" />;
  };

  const renderCategoryIcon = () => {
    switch(vehicleData.category) {
      case 'economy': return <Fuel className="h-5 w-5 mr-2 text-green-500" />;
      case 'luxury': return <Star className="h-5 w-5 mr-2 text-yellow-500" />;
      case 'van': return <Users className="h-5 w-5 mr-2 text-blue-500" />;
      default: return <Car className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };

  const renderCategoryText = () => {
    switch(vehicleData.category) {
      case 'economy': return 'Économique';
      case 'standard': return 'Standard';
      case 'luxury': return 'Luxe';
      case 'van': return 'Van';
      default: return vehicleData.category;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ma Voiture</h1>
            <p className="text-gray-600 mt-2">
              Gérez et personnalisez les détails de votre véhicule
            </p>
          </div>
          
          {!isEditing && (
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 shadow-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
              activeTab === 'details' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Détails du véhicule
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
              activeTab === 'stats' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Statistiques
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-medium text-sm transition-all duration-300 ${
              activeTab === 'settings' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paramètres
          </button>
        </div>

        {/* Main Card */}
        <div 
          ref={formRef}
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-teal-100 p-3 rounded-xl mr-4">
                  <Car className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {vehicleData.brand} {vehicleData.model}
                  </h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    {renderCategoryIcon()}
                    {renderCategoryText()} • {vehicleData.year}
                  </p>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                vehicleData.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  vehicleData.available ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {vehicleData.available ? 'Disponible' : 'Indisponible'}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicleData.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48">
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <label className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition-all duration-300 group">
                    <div className="text-center p-4">
                      <div className="bg-teal-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-200 transition-colors">
                        <Camera className="h-6 w-6 text-teal-600" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium group-hover:text-teal-600">
                        Ajouter des photos
                      </span>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 text-teal-600 mr-2" />
                  Informations principales
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Marque</label>
                    {isEditing ? (
                      <input
                        value={vehicleData.brand}
                        onChange={(e) => setVehicleData({ ...vehicleData, brand: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium p-2 rounded-lg bg-white border border-gray-200">
                        {vehicleData.brand}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Modèle</label>
                    {isEditing ? (
                      <input
                        value={vehicleData.model}
                        onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium p-2 rounded-lg bg-white border border-gray-200">
                        {vehicleData.model}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Année</label>
                      {isEditing ? (
                        <input
                          value={vehicleData.year}
                          onChange={(e) => setVehicleData({ ...vehicleData, year: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium p-2 rounded-lg bg-white border border-gray-200">
                          {vehicleData.year}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Plaque d'immatriculation</label>
                      {isEditing ? (
                        <input
                          value={vehicleData.licensePlate}
                          onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium p-2 rounded-lg bg-white border border-gray-200">
                          {vehicleData.licensePlate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-teal-600 mr-2" />
                  Spécifications
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Couleur</label>
                      {isEditing ? (
                        <input
                          value={vehicleData.color}
                          onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: vehicleData.color === 'Noir' ? '#111827' : 
                              vehicleData.color === 'Blanc' ? '#f3f4f6' : 
                              vehicleData.color === 'Rouge' ? '#ef4444' : 
                              vehicleData.color === 'Bleu' ? '#3b82f6' : '#e5e7eb' 
                            }}
                          ></div>
                          <p className="text-gray-900 font-medium">
                            {vehicleData.color}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Sièges</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={vehicleData.seats}
                          onChange={(e) => setVehicleData({ ...vehicleData, seats: parseInt(e.target.value) || 4 })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          {vehicleData.seats} places
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Catégorie</label>
                      {isEditing ? (
                        <select
                          value={vehicleData.category}
                          onChange={(e) => setVehicleData({ ...vehicleData, category: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="economy">Économique</option>
                          <option value="standard">Standard</option>
                          <option value="luxury">Luxe</option>
                          <option value="van">Van</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium flex items-center">
                          {renderCategoryIcon()}
                          {renderCategoryText()}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Tarif horaire</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={vehicleData.pricePerHour}
                          onChange={(e) => setVehicleData({ ...vehicleData, pricePerHour: parseFloat(e.target.value) || 0 })}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium text-lg">
                          {vehicleData.pricePerHour} €/h
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Disponibilité</label>
                    {isEditing ? (
                      <label className="flex items-center space-x-3">
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={vehicleData.available}
                            onChange={(e) => setVehicleData({ ...vehicleData, available: e.target.checked })}
                            className="opacity-0 w-0 h-0 peer"
                          />
                          <div className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300 peer-checked:bg-teal-500 peer-checked:shadow-md"></div>
                          <div className="absolute h-4 w-4 bg-white rounded-full transition-all duration-300 top-1 left-1 peer-checked:translate-x-6"></div>
                        </div>
                        <span className="text-gray-700">
                          {vehicleData.available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </label>
                    ) : (
                      <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        vehicleData.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicleData.available ? 'Disponible pour location' : 'Non disponible'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 text-teal-600 mr-2" />
                Équipements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
                      isEditing 
                        ? 'border-red-100 bg-red-50 hover:bg-red-100' 
                        : 'border-teal-100 bg-white hover:bg-teal-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {renderFeatureIcon(feature)}
                      <span className="font-medium">{feature}</span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex mt-6">
                  <input
                    placeholder="Ajouter un équipement..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={addFeature}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 rounded-r-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit className="h-5 w-5 text-teal-600 mr-2" />
                Description
              </h3>
              
              {isEditing ? (
                <textarea
                  value={vehicleData.description}
                  onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none min-h-[120px]"
                  placeholder="Décrivez votre véhicule en détail..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {vehicleData.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg ${
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Annuler
                </button>
              </div>
            )}

            {/* Stats Section */}
            {activeTab === 'stats' && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Star className="h-6 w-6 text-blue-600" />
                  </span>
                  Statistiques de Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
                    <div className="text-gray-600">Locations effectuées</div>
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
                    <div className="text-gray-600">Note moyenne</div>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="text-3xl font-bold text-gray-900 mb-2">1,850€</div>
                    <div className="text-gray-600">Revenus totaux</div>
                    <div className="h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mt-3"></div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Prochaines réservations</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                          <div className="font-medium">Jean Dupont</div>
                          <div className="text-sm text-gray-600">15 oct. 2023 • 14:00 - 18:00</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">85€</div>
                          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Confirmée</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 mb-4">
                <Trash2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Confirmer la suppression</h3>
              <p className="text-red-100">Cette action est irréversible</p>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Êtes-vous sûr de vouloir supprimer votre véhicule ? Toutes les données associées seront perdues.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={`flex-1 py-3 text-white rounded-lg font-medium transition-all ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                  }`}
                >
                  {isLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicle;