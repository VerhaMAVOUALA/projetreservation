import React from 'react';
import { User, Phone } from 'lucide-react';


const ClientInfoSection = ({
  clientName,
  clientPhone
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <User className="h-4 w-4 text-teal-600 mr-1" />
          Nom complet
        </label>
        <input
          type="text"
          value={clientName}
          disabled
          className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Phone className="h-4 w-4 text-teal-600 mr-1" />
          Téléphone
        </label>
        <input
          type="tel"
          value={clientPhone}
          disabled
          className="w-full bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

export default ClientInfoSection;