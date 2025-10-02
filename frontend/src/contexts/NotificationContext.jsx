import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  };

  const showInfo = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
    });
  };

  const showWarning = (message) => {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      icon: '⚠️',
    });
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      <Toaster />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
