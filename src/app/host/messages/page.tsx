'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Search, Send, Clock, Filter, CheckCircle, Loader2 } from 'lucide-react';
import {
  ConversationSummary,
  fetchConversations,
  fetchMessageThread,
  markConversationRead,
  resolveMediaUrl,
  sendHostMessage,
} from '@/services/hostService';

type ThreadMsg = {
  id: string;
  sender: 'host' | 'client';
  content: string;
  timestamp: string;
  read: boolean;
};

export default function HostMessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ThreadMsg[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    try {
      setLoadingList(true);
      const list = await fetchConversations();
      setConversations(list);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Impossible de charger les conversations');
      setConversations([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    const q = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('with') : null;
    if (q && conversations.some((c) => c.id === q)) {
      setSelectedId(q);
    }
  }, [conversations]);

  const loadThread = useCallback(async (otherUserId: string) => {
    try {
      setLoadingThread(true);
      const raw = await fetchMessageThread(otherUserId);
      setMessages(
        raw.map((m) => ({
          id: m.id,
          sender: m.isMine ? 'host' : 'client',
          content: m.content,
          timestamp: m.createdAt,
          read: true,
        }))
      );
      await markConversationRead(otherUserId);
      loadList();
    } catch {
      setMessages([]);
    } finally {
      setLoadingThread(false);
    }
  }, [loadList]);

  useEffect(() => {
    if (selectedId) loadThread(selectedId);
    else setMessages([]);
  }, [selectedId, loadThread]);

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  );

  const filteredConversations = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return conversations.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        (c.listingTitle || '').toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchTerm]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedId) return;
    try {
      setSending(true);
      await sendHostMessage(selectedId, newMessage.trim());
      setNewMessage('');
      await loadThread(selectedId);
      await loadList();
    } catch (e: any) {
      alert(e?.message || 'Envoi impossible');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communiquez avec vos clients</p>
      </div>

      {error && (
        <p className="text-red-600 mb-4 text-sm">{error}</p>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par client ou propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48 flex items-center text-sm text-gray-500">
              <Filter className="mr-2 h-4 w-4" />
              Toutes les conversations
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-[600px] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>
                {loadingList ? '…' : `${filteredConversations.length} conversation(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {loadingList && (
                <div className="flex justify-center py-8 text-gray-500 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
              <div className="space-y-1">
                {!loadingList &&
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedId === conversation.id ? 'bg-rose-50 border-l-4 border-l-rose-500' : ''
                      }`}
                      onClick={() => setSelectedId(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {conversation.userAvatar ? (
                          <img
                            src={resolveMediaUrl(conversation.userAvatar)}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-gray-600">
                              {conversation.userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm truncate">{conversation.userName}</h3>
                            <span className="text-xs text-gray-500 shrink-0">
                              {new Date(conversation.lastMessageTime).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{conversation.listingTitle || '—'}</p>
                          <p className="text-sm text-gray-700 truncate mt-1">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline">Active</Badge>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {selected.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{selected.userName}</h3>
                      <p className="text-sm text-gray-600">{selected.listingTitle || ''}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                {loadingThread ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'host' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center mt-1 text-xs ${
                              message.sender === 'host' ? 'text-rose-100' : 'text-gray-500'
                            }`}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {message.sender === 'host' && message.read && (
                              <CheckCircle className="ml-1 h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardContent className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="bg-rose-600 hover:bg-rose-700 self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-600">
                  Choisissez une conversation dans la liste pour commencer à discuter
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
