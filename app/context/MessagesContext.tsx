// app/context/MessagesContext.tsx

'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

export type Message = {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  category: 'primary' | 'promotions' | 'social';
  isNew?: boolean;
  archived?: boolean;
  email?: string;
  content?: string;
};

type MessagesContextType = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  updateMessage: (id: number, updates: Partial<Message>) => void;
  deleteMessage: (id: number) => void;
  archiveMessage: (id: number) => void;
  markAsRead: (id: number) => void;
  toggleStar: (id: number) => void;
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Google Play",
    email: "googleplay-noreply@google.com",
    subject: "Modifications apportées aux paramètres de validation des achats sur Google Play",
    preview: "Vous avez mis à jour vos paramètres de validation des achats Google Play...",
    timestamp: new Date('2023-12-14T08:53:00'),
    read: false,
    starred: false,
    category: 'primary',
    isNew: true,
    content: `Bonjour Olivarèss Augustino,

Vous avez mis à jour vos paramètres de validation des achats Google Play avec r.olivaress.tino@gmail.com sur votre Nokia 3.4. Vous devrez désormais utiliser votre empreinte faciale ou digitale sur votre appareil pour confirmer votre identité chaque fois que vous effectuerez un achat sur Google Play.

Vos paramètres de validation s'appliquent à votre compte, uniquement sur l'appareil où ils ont été mis à jour. Toutes les données biométriques stockées sur votre appareil pour vous-même ou pour d'autres personnes peuvent servir à valider les achats effectués avec ce compte. Gardez cela à l'esprit si vous partagez votre appareil avec d'autres personnes, en particulier des enfants. Vous pouvez modifier vos paramètres de validation des achats à tout moment sur Google Play. Vous pouvez aussi supprimer à tout moment n'importe quelle empreinte faciale ou digitale sur votre appareil.`
  },
  // ... autres messages
];

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const updateMessage = (id: number, updates: Partial<Message>) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, ...updates } : message
      )
    );
  };

  const deleteMessage = (id: number) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
  };

  const archiveMessage = (id: number) => {
    updateMessage(id, { archived: true });
  };

  const markAsRead = (id: number) => {
    updateMessage(id, { read: true, isNew: false });
  };

  const toggleStar = (id: number) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, starred: !message.starred } : message
      )
    );
  };

  return (
    <MessagesContext.Provider value={{
      messages,
      setMessages,
      updateMessage,
      deleteMessage,
      archiveMessage,
      markAsRead,
      toggleStar
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}

