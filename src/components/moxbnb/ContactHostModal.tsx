'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, X } from 'lucide-react';
import { api } from '@/lib/api';

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
  hostName: string;
  propertyTitle?: string;
  bookingId?: string;
  userId?: string;
}

export default function ContactHostModal({ 
  isOpen, 
  onClose, 
  hostId, 
  hostName, 
  propertyTitle,
  bookingId,
  userId 
}: ContactHostModalProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Veuillez écrire un message');
      return;
    }

    setIsSending(true);
    try {
      await api.post('/messages', {
        receiverId: hostId,
        content: message,
        type: 'TEXT',
        bookingId: bookingId || undefined
      });

      // Clear message and close modal
      setMessage('');
      onClose();
      alert('Message envoyé avec succès!');
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSending(false);
    }
  };

  const defaultMessage = propertyTitle 
    ? `Bonjour ${hostName},\n\nJe vous contacte concernant votre logement "${propertyTitle}".\n\n\n\nCordialement,`
    : `Bonjour ${hostName},\n\n\n\nCordialement,`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contacter l'hôte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Host Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">Envoyer un message à:</p>
            <p className="text-sm text-gray-600">{hostName}</p>
            {propertyTitle && (
              <p className="text-xs text-gray-500 mt-1">Concernant: {propertyTitle}</p>
            )}
          </div>

          {/* Message Form */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={defaultMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendMessage} 
              className="flex-1"
              disabled={isSending || !message.trim()}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Envoyer
                </div>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Les messages sont envoyés via la plateforme MoxBnB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
