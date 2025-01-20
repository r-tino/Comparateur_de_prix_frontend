// app/context/UnreadMessagesContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export const UnreadMessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error('useUnreadMessages must be used within a UnreadMessagesProvider');
  }
  return context;
};