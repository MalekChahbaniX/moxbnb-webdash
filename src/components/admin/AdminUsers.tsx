'use client';

import { useState } from 'react';
import { Shield, User, Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsers() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    {
      id: 'USR-001',
      name: 'Fatma Ben Ali',
      email: 'fatma@email.com',
      phone: '+216 71 123 456',
      role: 'host',
      status: 'active',
      listingsCount: 5,
      bookingsCount: 0,
      joinedAt: '2024-08-15',
      lastLogin: '2025-01-12 14:30'
    },
    {
      id: 'USR-002',
      name: 'Ahmed Kaddour',
      email: 'ahmed@email.com',
      phone: '+216 72 234 567',
      role: 'host',
      status: 'active',
      listingsCount: 3,
      bookingsCount: 2,
      joinedAt: '2024-09-20',
      lastLogin: '2025-01-11 09:15'
    },
    {
      id: 'USR-003',
      name: 'Mohamed Trabelsi',
      email: 'mohamed@email.com',
      phone: '+216 73 345 678',
      role: 'traveler',
      status: 'active',
      listingsCount: 0,
      bookingsCount: 8,
      joinedAt: '2024-10-05',
      lastLogin: '2025-01-12 16:45'
    },
    {
      id: 'USR-004',
      name: 'Leila Messaoudi',
      email: 'leila@email.com',
      phone: '+216 74 456 789',
      role: 'serviceProvider',
      status: 'active',
      listingsCount: 0,
      bookingsCount: 0,
      servicesCount: 2,
      joinedAt: '2024-11-12',
      lastLogin: '2025-01-10 11:20'
    },
    {
      id: 'USR-005',
      name: 'Omar Ben Salah',
      email: 'omar@email.com',
      phone: '+216 75 567 890',
      role: 'traveler',
      status: 'suspended',
      listingsCount: 0,
      bookingsCount: 3,
      joinedAt: '2024-07-25',
      lastLogin: '2025-01-05 08:00'
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'host':
        return <Badge className="bg-purple-100 text-purple-800">Hôte</Badge>;
      case 'serviceProvider':
        return <Badge className="bg-blue-100 text-blue-800">Prestataire</Badge>;
      case 'traveler':
        return <Badge className="bg-green-100 text-green-800">Voyageur</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSuspendUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir suspendre cet utilisateur ?')) {
      console.log('Suspending user:', userId);
      // API call to suspend user
    }
  };

  const handleActivateUser = (userId: string) => {
    console.log('Activating user:', userId);
    // API call to activate user
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les comptes utilisateurs et leurs accès à la plateforme
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="traveler">Voyageurs</SelectItem>
                  <SelectItem value="host">Hôtes</SelectItem>
                  <SelectItem value="serviceProvider">Prestataires</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
                <p className="text-2xl font-bold">2,458</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hôtes</p>
                <p className="text-2xl font-bold text-purple-600">856</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voyageurs</p>
                <p className="text-2xl font-bold text-green-600">1,458</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prestataires</p>
                <p className="text-2xl font-bold text-blue-600">144</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{user.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Email:</span> {user.email}
                          </div>
                          <div>
                            <span className="font-medium">Tél:</span> {user.phone}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {user.id}
                          </div>
                          <div>
                            <span className="font-medium">Inscrit le:</span> {user.joinedAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-muted-foreground">
                        {user.role === 'host' ? `${user.listingsCount} annonces` : 
                         user.role === 'serviceProvider' ? `${user.servicesCount} services` :
                         `${user.bookingsCount} réservations`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dernière connexion: {user.lastLogin}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Modifier les informations
                        </DropdownMenuItem>
                        {user.status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600"
                          >
                            Suspendre le compte
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600"
                          >
                            Réactiver le compte
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Supprimer le compte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
