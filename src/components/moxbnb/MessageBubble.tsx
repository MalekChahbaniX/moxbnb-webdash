'use client';

import { MessageSquare, Image as ImageIcon, File, MapPin } from 'lucide-react';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION';
    createdAt: string;
    isMine: boolean;
    isRead?: boolean;
    senderName?: string;
  };
  showTimestamp?: boolean;
  showReadStatus?: boolean;
}

export default function MessageBubble({ 
  message, 
  showTimestamp = true, 
  showReadStatus = true 
}: MessageBubbleProps) {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'IMAGE':
        return (
          <div className="space-y-2">
            <div className="relative group">
              <img 
                src={message.content} 
                alt="Image partagée" 
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(message.content, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {message.content.split('/').pop() && (
              <p className="text-xs opacity-70">
                📎 {message.content.split('/').pop()}
              </p>
            )}
          </div>
        );
      
      case 'FILE':
        return (
          <div className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded-lg">
            <File className="h-4 w-4" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                📎 {message.content.split('/').pop() || 'Fichier partagé'}
              </p>
            </div>
            <button
              onClick={() => window.open(message.content, '_blank')}
              className="text-xs underline hover:no-underline"
            >
              Télécharger
            </button>
          </div>
        );
      
      case 'LOCATION':
        return (
          <div className="flex items-start space-x-2 p-2 bg-white bg-opacity-20 rounded-lg">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm">{message.content}</p>
              <button
                onClick={() => {
                  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(message.content)}`;
                  window.open(mapsUrl, '_blank');
                }}
                className="text-xs underline hover:no-underline"
              >
                Voir sur la carte
              </button>
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.isMine ? 'order-2' : 'order-1'}`}>
        {!message.isMine && message.senderName && (
          <p className="text-xs text-gray-600 mb-1 ml-1">{message.senderName}</p>
        )}
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.isMine
              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
          }`}
        >
          {renderMessageContent()}
          
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            message.isMine ? 'text-rose-100' : 'text-gray-500'
          }`}>
            {showTimestamp && (
              <span className="text-xs">
                {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
            
            {showReadStatus && message.isMine && (
              <span className="ml-1">
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>
        
        {showTimestamp && (
          <p className={`text-xs text-gray-500 mt-1 ${
            message.isMine ? 'text-right' : 'text-left'
          }`}>
            {new Date(message.createdAt).toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </p>
        )}
      </div>
    </div>
  );
}
