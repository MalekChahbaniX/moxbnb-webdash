'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Bell, 
  User, 
  Home,
  Calendar,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  createdAt: string;
  isMine: boolean;
  isRead?: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  listingTitle?: string;
  listingImage?: string;
  isHost: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'hosts' | 'guests'>('all');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/messages/conversations');
        setConversations(response.data.data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/messages/thread/${selectedConversation.userId}`);
          setMessages(response.data.data.messages || []);
          
          // Mark conversation as read
          await api.patch(`/messages/conversations/${selectedConversation.userId}/read`);
          
          // Update unread count
          setConversations(prev => 
            prev.map(conv => 
              conv.id === selectedConversation.id 
                ? { ...conv, unreadCount: 0 }
                : conv
            )
          );
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      await api.post('/messages', {
        receiverId: selectedConversation.userId,
        content: newMessage.trim(),
        type: 'TEXT'
      });

      // Add message to local state
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        type: 'TEXT',
        createdAt: new Date().toISOString(),
        isMine: true,
        isRead: false
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.listingTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0;
      case 'hosts':
        return matchesSearch && conv.isHost;
      case 'guests':
        return matchesSearch && !conv.isHost;
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-rose-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">Communiquez avec vos hôtes et voyageurs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Navigation Button based on user role */}
            {user?.role === 'HOST' || user?.role === 'PROVIDER' ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(user?.role === 'HOST' ? '/host/dashboard' : '/provider/dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Tous
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Non lus
              </Button>
              <Button
                variant={filter === 'hosts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('hosts')}
              >
                Hôtes
              </Button>
              <Button
                variant={filter === 'guests' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('guests')}
              >
                Voyageurs
              </Button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune conversation trouvée</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-rose-50 border-l-4 border-l-rose-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.userAvatar} />
                        <AvatarFallback>
                          {conversation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{conversation.userName}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessageTime).toLocaleDateString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {conversation.listingTitle && (
                        <p className="text-sm text-gray-600 truncate">{conversation.listingTitle}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.userAvatar} />
                      <AvatarFallback>
                        {selectedConversation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{selectedConversation.userName}</p>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.isOnline ? 'En ligne' : 'Hors ligne'}
                        {selectedConversation.listingTitle && ` • ${selectedConversation.listingTitle}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedConversation.isHost && (
                      <Badge variant="outline" className="text-xs">
                        <Home className="h-3 w-3 mr-1" />
                        Hôte
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMine
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.isMine ? 'text-rose-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.isMine && (
                          message.isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Textarea
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="px-4"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez une conversation dans la liste pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
