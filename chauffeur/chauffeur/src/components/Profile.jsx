import React, { useState } from 'react';
import { Edit, Trash2, Camera, Check, X, User, Mail, Phone, MapPin, Shield, Award, Clock, ArrowRight } from 'lucide-react';

const Profile = ({ isDriverMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, Paris',
    avatar: null,
    // Driver specific fields
    licenseNumber: 'DL123456789',
    experience: '5 ans',
    status: 'Disponible',
    rating: 4.8,
    tripsCompleted: 124
  });

  const handleSave = () => {
    setIsEditing(false);
    // Simulation de sauvegarde
    setTimeout(() => {
      console.log('Saving profile data:', profileData);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, avatar: e.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = () => {
    // Simulation de suppression
    setTimeout(() => {
      console.log('Profile deleted');
      setShowDeleteConfirm(false);
    }, 1000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              {isDriverMode ? 'Mon Profil Chauffeur' : 'Mon Profil Client'}
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="mt-4 md:mt-0 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg"
            >
              <Edit className="h-5 w-5" />
              <span>Modifier le profil</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar and Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white p-2 rounded-full cursor-pointer hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md">
                        <Camera className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 text-center">{profileData.name}</h2>
                  <p className="text-gray-600 text-center mt-1">{profileData.email}</p>
                  
                  {isDriverMode && (
                    <div className="mt-4 flex items-center space-x-1">
                      {renderStars(profileData.rating)}
                      <span className="ml-2 text-gray-700 font-medium">{profileData.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
              
              {isDriverMode && (
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-gray-900">{profileData.tripsCompleted}</div>
                      <div className="text-sm text-gray-600 mt-1">Courses</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-gray-900">{profileData.experience}</div>
                      <div className="text-sm text-gray-600 mt-1">Expérience</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isDriverMode && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Award className="h-5 w-5 text-amber-500 mr-2" />
                    Statistiques
                  </h3>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Satisfaction clients</span>
                        <span className="text-sm font-medium text-gray-700">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Ponctualité</span>
                        <span className="text-sm font-medium text-gray-700">96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Propreté</span>
                        <span className="text-sm font-medium text-gray-700">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-teal-600 mr-2" />
                  Informations personnelles
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      Nom complet
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center min-h-[44px]">
                        {profileData.name}
                      </div>
                    )}
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center min-h-[44px]">
                        {profileData.email}
                      </div>
                    )}
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      Téléphone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center min-h-[44px]">
                        {profileData.phone}
                      </div>
                    )}
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      Adresse
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center min-h-[44px]">
                        {profileData.address}
                      </div>
                    )}
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* Driver specific fields */}
                  {isDriverMode && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Shield className="h-4 w-4 text-gray-500 mr-2" />
                          Numéro de permis
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.licenseNumber}
                            onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        ) : (
                          <div className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center min-h-[44px]">
                            {profileData.licenseNumber}
                          </div>
                        )}
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          Statut
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.status}
                            onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="Occupé">Occupé</option>
                            <option value="Hors service">Hors service</option>
                          </select>
                        ) : (
                          <div className={`w-full p-3 pl-10 rounded-lg flex items-center min-h-[44px] ${
                            profileData.status === 'Disponible' 
                              ? 'bg-green-50 border border-green-200 text-green-800' 
                              : profileData.status === 'Occupé'
                                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                          }`}>
                            {profileData.status}
                          </div>
                        )}
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </>
                  )}
                </div>
                
                {/* Action buttons */}
                {isEditing ? (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <button 
                      onClick={handleSave} 
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg"
                    >
                      <Check className="h-5 w-5" />
                      <span>Enregistrer les modifications</span>
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 transition-colors duration-300"
                    >
                      <X className="h-5 w-5" />
                      <span>Annuler</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Supprimer le profil</span>
                    </button>
                    
                    <button className="flex items-center text-teal-600 font-medium group">
                      <span>Voir l'historique complet</span>
                      <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
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
                Êtes-vous sûr de vouloir supprimer votre profil ? Toutes vos données seront définitivement perdues.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all"
                >
                  Supprimer le profil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;