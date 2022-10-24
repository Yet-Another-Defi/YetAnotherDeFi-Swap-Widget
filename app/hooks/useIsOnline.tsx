import React, { useState, useEffect, useContext } from 'react';
import { isServer } from '~/helpers/helpers';

const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider: React.FC = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(isServer ? true : navigator.onLine);

  const setOffline = () => {
    setOnlineStatus(false);
  };

  const setOnline = () => {
    setOnlineStatus(true);
  };

  useEffect(() => {
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);

    return () => {
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('online', setOnline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>{children}</OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const status = useContext(OnlineStatusContext);
  return status;
};
