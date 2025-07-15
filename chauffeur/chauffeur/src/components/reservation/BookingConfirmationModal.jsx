import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookingConfirmationModal = ({
  isOpen,
  bookingData,
  estimatedPrice,
  onConfirm,
  onCancel
}) => {
  const vehicles = [
    { id: '1', name: 'Mercedes Classe S', pricePerHour: 450 },
    { id: '2', name: 'BMW Série 7', pricePerHour: 420 },
    { id: '3', name: 'Audi A8', pricePerHour: 400 },
    { id: '4', name: 'Mercedes Vito', pricePerHour: 350 },
    { id: '5', name: 'Dacia Logan', pricePerHour: 180 }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la réservation</h3>
          <p className="text-gray-600">Vérifiez les détails de votre réservation</p>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Client:</span>
            <span className="font-medium text-right">{bookingData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Téléphone:</span>
            <span className="font-medium text-right">{bookingData.clientPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Départ:</span>
            <span className="font-medium text-right">{bookingData.startLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Destination:</span>
            <span className="font-medium text-right">{bookingData.endLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date(bookingData.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Heure:</span>
            <span className="font-medium">{bookingData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Véhicule:</span>
            <span className="font-medium">
              {bookingData.vehicleName || vehicles.find(v => v.id === bookingData.vehicleId)?.name}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-900 font-semibold">Prix estimé:</span>
            <span className="text-teal-600 font-bold text-lg">{estimatedPrice} MAD</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            Confirmer
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;