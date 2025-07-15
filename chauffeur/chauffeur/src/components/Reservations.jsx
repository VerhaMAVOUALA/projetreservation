import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Car, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Reservations = ({ isDriverMode }) => {
  const [toasts, setToasts] = useState([]);
  const [reservations, setReservations] = useState([
    {
      id: '1',
      clientName: 'Ahmed Benali',
      clientPhone: '+212 6 12 34 56 78',
      vehicleName: 'Mercedes Classe S',
      startLocation: 'Casablanca',
      endLocation: 'Rabat',
      date: '2024-06-30',
      time: '14:00',
      status: 'confirmed',
      price: 900,
      specialRequests: 'Arrêt à l\'aéroport Mohammed V'
    },
    {
      id: '2',
      clientName: 'Fatima Zahra',
      clientPhone: '+212 6 87 65 43 21',
      vehicleName: 'BMW Série 7',
      startLocation: 'Marrakech',
      endLocation: 'Agadir',
      date: '2024-07-02',
      time: '09:30',
      status: 'pending',
      price: 1260,
    },
    {
      id: '3',
      clientName: 'Omar Alami',
      clientPhone: '+212 6 55 44 33 22',
      vehicleName: 'Dacia Logan',
      startLocation: 'Fès',
      endLocation: 'Meknes',
      date: '2024-06-28',
      time: '16:45',
      status: 'completed',
      price: 360,
    }
  ]);

  const showToast = (title, description, duration = 5000) => {
    const id = Date.now();
    const newToast = { id, title, description };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      case 'completed':
        return 'Terminée';
      default:
        return 'Inconnue';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleConfirmBooking = (reservationId) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: 'confirmed' }
          : reservation
      )
    );

    showToast(
      "Réservation confirmée",
      `La réservation #${reservationId} a été confirmée avec succès.`,
      5000
    );

    setTimeout(() => {
      showToast(
        "Notification client",
        "Le client a été notifié de la confirmation de sa réservation.",
        3000
      );
    }, 1000);

    console.log(`Confirming booking ${reservationId}`);
  };

  React.useEffect(() => {
    if (isDriverMode) {
      const interval = setInterval(() => {
        const pendingReservations = reservations.filter(r => r.status === 'pending');
        if (pendingReservations.length > 0) {
          showToast(
            "Nouvelles réservations disponibles",
            `Vous avez ${pendingReservations.length} réservation(s) en attente de confirmation.`,
            4000
          );
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isDriverMode, reservations]);

  const title = isDriverMode ? 'Réservations Assignées' : 'Mes Réservations';

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
          >
            <h4 className="font-semibold text-gray-900 mb-1">{toast.title}</h4>
            <p className="text-sm text-gray-600">{toast.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="text-sm text-gray-600">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-6">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900">
                  Réservation #{reservation.id}
                </h2>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                  {getStatusIcon(reservation.status)}
                  <span>{getStatusText(reservation.status)}</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Client Info - Only show in driver mode */}
              {isDriverMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-teal-600" />
                    <div>
                      <span className="text-sm text-gray-600">Client</span>
                      <p className="font-medium">{reservation.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-teal-600" />
                    <div>
                      <span className="text-sm text-gray-600">Téléphone</span>
                      <p className="font-medium">{reservation.clientPhone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Départ</p>
                    <p className="font-medium text-gray-900">{reservation.startLocation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium text-gray-900">{reservation.endLocation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(reservation.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Heure</p>
                    <p className="font-medium text-gray-900">{reservation.time}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle and Price */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Véhicule</p>
                    <p className="font-medium text-gray-900">{reservation.vehicleName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Prix total</p>
                  <p className="text-xl font-bold text-teal-600">{reservation.price} MAD</p>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.specialRequests && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Demandes spéciales</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {reservation.specialRequests}
                  </p>
                </div>
              )}

              {/* Action Buttons - Only show for drivers on pending bookings */}
              {isDriverMode && reservation.status === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleConfirmBooking(reservation.id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirmer la course</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune réservation
          </h3>
          <p className="text-gray-600">
            {isDriverMode 
              ? "Aucune réservation ne vous a été assignée pour le moment."
              : "Vous n'avez pas encore effectué de réservation."
            }
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Reservations;