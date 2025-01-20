// app/dashboard/admin/messages/[id]/page.tsx

'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Archive, ArrowLeft, ArrowRight, Clock, Forward, MoreVertical, Printer, Reply, Send, Star, Trash2, User2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Exemple de données de message enrichies
const messageThreads: {
  [key: string]: {
    subject: string;
    messages: Array<{
      id: number;
      from: string;
      email: string;
      to: string;
      content: string;
      timestamp: Date;
      attachments?: Array<{ name: string; type: string; size: string }>;
    }>;
  };
} = {
  "1": {
    subject: "Modifications apportées aux paramètres de validation des achats sur Google Play",
    messages: [
      {
        id: 1,
        from: "Google Play",
        email: "googleplay-noreply@google.com",
        to: "moi",
        content: `Bonjour Olivarèss Augustino,

Vous avez mis à jour vos paramètres de validation des achats Google Play avec r.olivaress.tino@gmail.com sur votre Nokia 3.4. Vous devrez désormais utiliser votre empreinte faciale ou digitale sur votre appareil pour confirmer votre identité chaque fois que vous effectuerez un achat sur Google Play.

Vos paramètres de validation s'appliquent à votre compte, uniquement sur l'appareil où ils ont été mis à jour. Toutes les données biométriques stockées sur votre appareil pour vous-même ou pour d'autres personnes peuvent servir à valider les achats effectués avec ce compte. Gardez cela à l'esprit si vous partagez votre appareil avec d'autres personnes, en particulier des enfants. Vous pouvez modifier vos paramètres de validation des achats à tout moment sur Google Play. Vous pouvez aussi supprimer à tout moment n'importe quelle empreinte faciale ou digitale sur votre appareil.`,
        timestamp: new Date('2023-12-14T08:53:00'),
      }
    ]
  },
};

export default function MessageThread() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const thread = messageThreads[id as string];
  const currentMessage = thread?.messages[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  if (!thread || !currentMessage) {
    return (
      <div className="h-full flex items-center justify-center bg-night-blue">
        <p className="text-text-primary">Message non trouvé</p>
      </div>
    );
  }

  const formatMessageDate = (date: Date) => {
    return format(date, "d MMM yyyy, HH:mm", { locale: fr });
  };

  return (
    <div className="h-full flex flex-col bg-night-blue">
      {/* Header avec actions */}
      <div className="flex items-center justify-between p-4 bg-dark-blue border-b border-light-blue/10">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/messages">
            <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <Archive className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <Clock className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">5 sur 24</span>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
            <Forward className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Contenu du message */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          {/* En-tête du message */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-text-primary">{thread.subject}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-text-primary hover:text-yellow-400">
                  <Star className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-text-primary hover:text-light-blue">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-dark-blue text-text-primary border-light-blue">
                    <DropdownMenuItem className="hover:bg-light-blue/10">
                      <Reply className="mr-2 h-4 w-4" />
                      <span>Répondre</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-light-blue/10">
                      <Forward className="mr-2 h-4 w-4" />
                      <span>Transférer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-light-blue/10">
                      <Printer className="mr-2 h-4 w-4" />
                      <span>Imprimer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-light-blue/10 text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-light-blue/10 flex items-center justify-center flex-shrink-0">
                <User2 className="w-6 h-6 text-light-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium text-text-primary">{currentMessage.from}</span>
                    <span className="text-text-secondary ml-2">{`<${currentMessage.email}>`}</span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {formatMessageDate(currentMessage.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  à <span className="text-text-primary">{currentMessage.to}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-light-blue/10" />

          {/* Corps du message */}
          <div className="text-text-primary whitespace-pre-line">
            {currentMessage.content}
          </div>

          {/* Zone de réponse */}
          <div className="mt-6 pt-6 border-t border-light-blue/10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Répondre..." 
                className="flex-1 bg-dark-blue text-text-primary border-dark-blue focus:ring-light-blue"
              />
              <Button type="submit" className="bg-light-blue text-night-blue hover:bg-blue-600">
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </form>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

