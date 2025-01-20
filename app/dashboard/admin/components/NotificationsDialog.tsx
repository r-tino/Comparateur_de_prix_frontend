// app/dashboard/admin/components/NotificationsDialog.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface NotificationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

export function NotificationsDialog({ isOpen, onClose, notifications, onMarkAsRead }: NotificationsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800">Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border border-blue-200 p-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between py-2 border-b border-blue-100 last:border-b-0">
              <p className={`text-sm ${notification.read ? 'text-blue-500' : 'text-blue-800 font-medium'}`}>
                {notification.message}
              </p>
              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  Marquer comme lu
                </Button>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}