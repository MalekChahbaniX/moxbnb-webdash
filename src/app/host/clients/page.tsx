'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockClients = [
  {
    id: '1',
    name: 'Mohamed Ben Ali',
    email: 'mohamed.benali@email.com',
    phone: '+216 55 123 456',
    totalBookings: 12,
    totalSpent: 3000,
    averageRating: 4.8,
    joinDate: '2023-06-15',
    lastBookingDate: '2024-01-15',
    status: 'active',
    properties: ['Villa de Luxe à Sidi Bou Said', 'Appartement Centre Ville'],
    avatar: '/api/placeholder/100/100'
  },
  {
    id: '2',
    name: 'Sarra Trabelsi',
    email: 'sarra.trabelsi@email.com',
    phone: '+216 98 765 432',
    totalBookings: 8,
    totalSpent: 1920,
    averageRating: 4.9,
    joinDate: '2023-08-20',
    lastBookingDate: '2024-01-10',
    status: 'active',
    properties: ['Appartement Centre Ville'],
    avatar: '/api/placeholder/100/100'
  },
  {
    id: '3',
    name: 'Youssef Karray',
    email: 'youssef.karray@email.com',
    phone: '+216 22 987 654',
    totalBookings: 3,
    totalSpent: 480,
    averageRating: 4.5,
    joinDate: '2023-11-10',
    lastBookingDate: '2023-12-20',
    status: 'inactive',
    properties: ['Studio Coquet Hammamet'],
    avatar: '/api/placeholder/100/100'
  }
];

export default function HostClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [filtered, setFiltered] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">Gérez vos clients et leur historique</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">Tous les clients</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Client Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Réservations</p>
                  <p className="font-semibold text-lg">{client.totalBookings}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Dépensé</p>
                  <p className="font-semibold text-lg text-green-600">{client.totalSpent.toLocaleString()} TND</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Note Moyenne</p>
                  <div className="flex items-center">
                    <span className="font-semibold text-lg">{client.averageRating}</span>
                    <span className="text-yellow-400 ml-1">⭐</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Statut</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Date d'inscription: {new Date(client.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Dernière réservation: {new Date(client.lastBookingDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Properties */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Propriétés réservées:</p>
                <div className="flex flex-wrap gap-2">
                  {client.properties.map((property, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {property}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
                <Button variant="outline" size="sm">
                  Voir le Profil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun client trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Vous n\'avez pas encore de clients'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
