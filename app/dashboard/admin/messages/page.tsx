// app/dashboard/admin/messages/page.tsx

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, MoreHorizontal, RefreshCcw, Trash2, MoreVertical, CheckSquare, Loader2, StarOff } from 'lucide-react';
import { useToast } from "@/components/use-toast";
import { useUnreadMessages } from "@/app/context/UnreadMessagesContext";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Message = {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  category: 'primary' | 'promotions' | 'social';
  isNew?: boolean; // Nouvelle propriété
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Vercel",
    subject: "016799 - Vercel Sign-in Verification",
    preview: "Verify your email to sign in to Vercel Hello mampytino-gmailcom, We have received a sign-in...",
    timestamp: new Date('2023-12-20T09:46:00'),
    read: false,
    starred: false,
    category: 'primary',
    isNew: true
  },
  {
    id: 2,
    sender: "Vercel",
    subject: "v0 Product Update",
    preview: "Full-stack support | Import from Figma | Deploy to Vercel",
    timestamp: new Date('2023-12-20T03:26:00'),
    read: false,
    starred: false,
    category: 'promotions',
    isNew: true
  },
  {
    id: 3,
    sender: "WhatTheAI",
    subject: "Instagram's AI Video feature Is Coming; What You Need to Know!",
    preview: "Plus: Meet Genesis that generates 4D worlds",
    timestamp: new Date('2023-12-19T23:02:00'),
    read: false,
    starred: false,
    category: 'social',
    isNew: true
  },
  // Ajoutez d'autres messages ici pour avoir une liste plus complète
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'primary' | 'promotions' | 'social'>('primary');
  const { toast } = useToast();
  const { setUnreadCount } = useUnreadMessages();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(initialMessages);
      setIsLoading(false);
      
      // Mettre à jour le nombre de messages non lus
      const unreadCount = initialMessages.filter(m => !m.read).length;
      setUnreadCount(unreadCount);
    };

    fetchMessages();

    // Effet pour effacer le statut "nouveau" après le chargement initial
    return () => {
      setMessages(prevMessages => 
        prevMessages.map(message => ({
          ...message,
          isNew: false
        }))
      );
    };
  }, [setUnreadCount]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(messages.filter(m => m.category === activeTab).map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id]);
    } else {
      setSelectedMessages(selectedMessages.filter(mId => mId !== id));
    }
  };

  const handleStarMessage = (id: number) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, starred: !message.starred }
        : message
    ));
  };

  const handleMessageClick = (id: number) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, read: true }
        : message
    ));
    
    // Mettre à jour le nombre de messages non lus
    const unreadCount = messages.filter(m => !m.read && m.id !== id).length;
    setUnreadCount(unreadCount);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(initialMessages);
    setSelectedMessages([]);
    setIsLoading(false);
    toast({
      title: "Actualisé",
      description: "Les messages ont été actualisés.",
    });
  };

  const handleDeleteSelected = () => {
    const newMessages = messages.filter(m => !selectedMessages.includes(m.id));
    setMessages(newMessages);
    setSelectedMessages([]);
    
    // Mettre à jour le nombre de messages non lus
    const unreadCount = newMessages.filter(m => !m.read).length;
    setUnreadCount(unreadCount);
    
    toast({
      title: "Supprimé",
      description: `${selectedMessages.length} message(s) ont été supprimés.`,
    });
  };

  const handleMarkAllAsRead = () => {
    setMessages(messages.map(m => ({ ...m, read: true })));
    setUnreadCount(0);
    toast({
      title: "Marqué comme lu",
      description: "Tous les messages ont été marqués comme lus.",
    });
  };

  const handleDeleteConversation = (id: number) => {
    const newMessages = messages.filter(m => m.id !== id);
    setMessages(newMessages);
    setSelectedMessages(selectedMessages.filter(mId => mId !== id));
    
    // Mettre à jour le nombre de messages non lus
    const unreadCount = newMessages.filter(m => !m.read).length;
    setUnreadCount(unreadCount);
    
    toast({
      title: "Supprimé",
      description: "La conversation a été supprimée.",
    });
  };

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd MMM.', { locale: fr });
    }
  };

  const filteredMessages = messages.filter(m => m.category === activeTab);

  return (
    <div className="h-full flex flex-col bg-night-blue p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-text-primary hover:text-light-blue" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <label htmlFor="select-all" className="text-sm text-text-secondary">Tout sélectionner</label>
          </div>
          {selectedMessages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-text-primary hover:text-red-500"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-dark-blue text-text-primary border-light-blue">
              <DropdownMenuItem className="hover:bg-light-blue/10" onSelect={handleMarkAllAsRead}>
                <CheckSquare className="mr-2 h-4 w-4" />
                <span>Tout marquer comme lu</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="primary" className="flex-1">
        <TabsList className="bg-dark-blue border-b border-dark-blue">
          <TabsTrigger 
            value="primary"
            onClick={() => setActiveTab('primary')}
            className="data-[state=active]:bg-light-blue/10"
          >
            Principal
          </TabsTrigger>
          <TabsTrigger 
            value="promotions"
            onClick={() => setActiveTab('promotions')}
            className="data-[state=active]:bg-light-blue/10"
          >
            Promotions
          </TabsTrigger>
          <TabsTrigger 
            value="social"
            onClick={() => setActiveTab('social')}
            className="data-[state=active]:bg-light-blue/10"
          >
            Réseaux sociaux
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="flex-1 mt-0">
          <MessageList 
            messages={filteredMessages}
            selectedMessages={selectedMessages}
            onSelect={handleSelectMessage}
            onStar={handleStarMessage}
            onClick={handleMessageClick}
            isLoading={isLoading}
            formatDate={formatMessageDate}
            onDeleteConversation={handleDeleteConversation}
          />
        </TabsContent>
        <TabsContent value="promotions" className="flex-1 mt-0">
          <MessageList 
            messages={filteredMessages}
            selectedMessages={selectedMessages}
            onSelect={handleSelectMessage}
            onStar={handleStarMessage}
            onClick={handleMessageClick}
            isLoading={isLoading}
            formatDate={formatMessageDate}
            onDeleteConversation={handleDeleteConversation}
          />
        </TabsContent>
        <TabsContent value="social" className="flex-1 mt-0">
          <MessageList 
            messages={filteredMessages}
            selectedMessages={selectedMessages}
            onSelect={handleSelectMessage}
            onStar={handleStarMessage}
            onClick={handleMessageClick}
            isLoading={isLoading}
            formatDate={formatMessageDate}
            onDeleteConversation={handleDeleteConversation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
  selectedMessages: number[];
  onSelect: (id: number, checked: boolean) => void;
  onStar: (id: number) => void;
  onClick: (id: number) => void;
  isLoading: boolean;
  formatDate: (date: Date) => string;
  onDeleteConversation: (id: number) => void;
}

function MessageList({ 
  messages, 
  selectedMessages, 
  onSelect, 
  onStar, 
  onClick,
  isLoading,
  formatDate,
  onDeleteConversation
}: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-light-blue" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-15rem)]">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-center p-4 hover:bg-light-blue/5 border-b border-dark-blue transition-colors ${
            !message.read ? 'bg-dark-blue/30' : ''
          }`}
        >
          <Checkbox
            checked={selectedMessages.includes(message.id)}
            onCheckedChange={(checked) => onSelect(message.id, checked as boolean)}
            className="mr-4"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`mr-4 ${
              message.starred 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-text-secondary hover:text-yellow-400'
            }`}
            onClick={() => onStar(message.id)}
          >
            {message.starred ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
          </Button>
          <Link 
            href={`/dashboard/admin/messages/${message.id}`} 
            className="flex-1 min-w-0 flex items-center"
            onClick={() => onClick(message.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${message.read ? 'text-text-secondary' : 'text-text-primary'} truncate`}>
                    {message.sender}
                  </p>
                  {message.isNew && (
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      Nouveau
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-secondary ml-4">
                  {formatDate(message.timestamp)}
                </p>
              </div>
              <p className={`text-sm ${message.read ? 'text-text-secondary' : 'text-text-primary'} truncate`}>
                {message.subject}
              </p>
              <p className="text-sm text-text-secondary truncate">
                {message.preview}
              </p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 text-text-secondary hover:text-light-blue">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-dark-blue text-text-primary border-light-blue">
              <DropdownMenuItem 
                className="hover:bg-light-blue/10" 
                onSelect={() => onDeleteConversation(message.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer la conversation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </ScrollArea>
  );
}