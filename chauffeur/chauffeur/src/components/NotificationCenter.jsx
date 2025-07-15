import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';

const NotificationCenter = ({ isDriverMode }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mockNotifications = isDriverMode ? [
      {
        id: '1',
        type: 'new_booking',
        title: 'Nouvelle réservation',
        message: 'Une nouvelle réservation de Casablanca vers Rabat vous a été assignée.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        reservationId: '2'
      },
      {
        id: '2',
        type: 'new_booking',
        title: 'Nouvelle réservation',
        message: 'Une nouvelle réservation de Marrakech vers Agadir vous attend.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: true,
        reservationId: '3'
      }
    ] : [
      {
        id: '3',
        type: 'booking_confirmed',
        title: 'Réservation confirmée',
        message: 'Votre réservation #1 pour le 30/06/2024 à 14:00 a été confirmée par le chauffeur.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        reservationId: '1'
      },
      {
        id: '4',
        type: 'booking_pending',
        title: 'Réservation en attente',
        message: 'Votre réservation #2 est en attente de validation par un chauffeur.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        reservationId: '2'
      }
    ];

    setNotifications(mockNotifications);
  }, [isDriverMode]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'new_booking':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-transparent hover:bg-gray-100 rounded-md transition-colors duration-200"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 ring-1 ring-black ring-opacity-5">
            <div className="p-0">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-teal-600 hover:text-teal-700 text-sm px-2 py-1 rounded-md hover:bg-teal-50 transition-colors duration-200"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 h-auto bg-transparent hover:bg-gray-100 rounded-md transition-colors duration-200"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 h-auto text-gray-400 hover:text-red-500 bg-transparent hover:bg-gray-100 rounded-md transition-colors duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;