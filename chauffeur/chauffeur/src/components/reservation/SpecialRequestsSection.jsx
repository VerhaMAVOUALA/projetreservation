import React from 'react';

const SpecialRequestsSection = ({
  specialRequests,
  onSpecialRequestsChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Demandes spéciales (optionnel)
      </label>
      <textarea
        placeholder="Arrêts supplémentaires, préférences particulières..."
        value={specialRequests}
        onChange={(e) => onSpecialRequestsChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 resize-none"
        rows={3}
      />
    </div>
  );
};

export default SpecialRequestsSection;