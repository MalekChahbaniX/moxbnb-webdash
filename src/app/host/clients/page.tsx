'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { fetchHostClients } from '@/services/hostService';

type ClientRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  joinDate: string;
  lastBookingDate: string;
  status: string;
  properties: string[];
};

export default function HostClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHostClients();
      setClients(
        (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          totalBookings: c.totalBookings,
          totalSpent: c.totalSpent,
          averageRating: c.averageRating ?? 0,
          joinDate: c.joinDate,
          lastBookingDate: c.lastBookingDate,
          status: c.status,
          properties: c.properties || [],
        }))
      );
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = clients;
    if (statusFilter !== 'all') {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list;
  }, [clients, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">Clients ayant réservé vos propriétés</p>
      </div>

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

      {loading && <p className="text-gray-600">Chargement…</p>}
      {error && !loading && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {client.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 truncate">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{client.phone || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Réservations</p>
                  <p className="font-semibold text-lg">{client.totalBookings}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total dépensé</p>
                  <p className="font-semibold text-lg text-green-600">{client.totalSpent.toLocaleString()} TND</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Statut</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 shrink-0" />
                  <span>Dernière réservation : {new Date(client.lastBookingDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {client.properties.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Propriétés :</p>
                  <div className="flex flex-wrap gap-2">
                    {client.properties.map((property, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {property}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Link href={`/host/messages?with=${client.id}`}>
                  <Button variant="outline" size="sm" type="button">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Modifiez votre recherche' : "Vous n'avez pas encore de réservations"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
