import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const DateTimeSelector = ({
  date,
  time,
  onDateChange,
  onTimeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Calendar className="h-4 w-4 text-teal-600 mr-1" />
          Date
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Clock className="h-4 w-4 text-teal-600 mr-1" />
          Heure
        </label>
        <input
          type="time"
          required
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateTimeSelector;