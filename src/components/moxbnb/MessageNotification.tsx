'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MessageNotificationProps {
  className?: string;
}

export default function MessageNotification({ className }: MessageNotificationProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/messages/conversations');
        const conversations = response.data.data || [];
        const totalUnread = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        setUnreadCount(totalUnread);

        // Get recent messages (last 3)
        const recent = conversations
          .filter((conv: any) => conv.unreadCount > 0)
          .slice(0, 3)
          .map((conv: any) => ({
            id: conv.id,
            userName: conv.userName,
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageTime,
            unreadCount: conv.unreadCount,
            userAvatar: conv.userAvatar,
            listingTitle: conv.listingTitle
          }));
        setRecentMessages(recent);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (conversationId: string) => {
    try {
      // Find conversation by ID to get userId
      const conversation = recentMessages.find(msg => msg.id === conversationId);
      if (conversation) {
        await api.patch(`/messages/conversations/${conversationId}/read`);
        setUnreadCount(prev => Math.max(0, prev - conversation.unreadCount));
        setRecentMessages(prev => prev.filter(msg => msg.id !== conversationId));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleViewAllMessages = () => {
    router.push('/messages');
    setIsOpen(false);
  };

  if (!user || unreadCount === 0) {
    return (
      <Button variant="ghost" size="sm" onClick={() => router.push('/messages')} className={className}>
        <MessageSquare className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative ${className}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Messages non lus</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucun message non lu</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    router.push(`/messages?conversation=${message.id}`);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {message.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {message.userName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.lastMessageTime).toLocaleDateString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {message.listingTitle && (
                        <p className="text-xs text-gray-600 truncate">{message.listingTitle}</p>
                      )}
                      <p className="text-sm text-gray-600 truncate mt-1">{message.lastMessage}</p>
                      {message.unreadCount > 0 && (
                        <Badge variant="destructive" className="mt-2 text-xs">
                          {message.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleViewAllMessages}
            >
              Voir tous les messages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
