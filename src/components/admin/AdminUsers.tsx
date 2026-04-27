'use client';

import { useEffect, useState } from 'react';
import { User, Search, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { getAllUsers, banUser, unbanUser, updateUserRole } from '@/services/adminService';

export default function AdminUsers() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningUser, setActioningUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [selectedFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      if (selectedFilter !== 'all') filters.role = selectedFilter;
      const response = await getAllUsers(filters);
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) return;
    try {
      setActioningUser(userId);
      const response = await banUser(userId, "Violation des conditions d'utilisation");
      if (response.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: 'banned' } : u));
      }
    } catch (err) {
      setError('Erreur lors du bannissement');
    } finally {
      setActioningUser(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      setActioningUser(userId);
      const response = await unbanUser(userId);
      if (response.success) {
        setUsers(users.map(u => u._id === userId ? response.data : u));
      }
    } catch (err) {
      setError('Erreur lors du débannissement');
    } finally {
      setActioningUser(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      setActioningUser(userId);
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(users.map(u => u._id === userId ? response.data : u));
      }
    } catch (err) {
      setError('Erreur lors de la modification du rôle');
    } finally {
      setActioningUser(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'host':
        return <Badge className="bg-purple-100 text-purple-800">Hôte</Badge>;
      case 'provider':
        return <Badge className="bg-blue-100 text-blue-800">Prestataire</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800">Utilisateur</Badge>;
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
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banni</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-100 text-orange-800">Suspendu</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les comptes utilisateurs et leurs accès à la plateforme
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email..."
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
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="host">Hôtes</SelectItem>
                  <SelectItem value="provider">Prestataires</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-rose-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{user.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Email:</span> {user.email}
                            </div>
                            <div>
                              <span className="font-medium">Tél:</span> {user.phone || 'N/A'}
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
                      {user.createdAt && (
                        <div className="text-right hidden md:block text-sm">
                          <p className="text-muted-foreground">
                            Inscrit: {new Date(user.createdAt).toLocaleDateString('fr-TN')}
                          </p>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actioningUser === user._id}>
                            {actioningUser === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => handleBanUser(user._id)}
                              className="text-red-600"
                            >
                              Bannir le compte
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUnbanUser(user._id)}
                              className="text-green-600"
                            >
                              Débannir le compte
                            </DropdownMenuItem>
                          )}
                          {user.role !== 'admin' && (
                            <>
                              <DropdownMenuItem onClick={() => handleChangeRole(user._id, 'user')}>
                                Changer en Utilisateur
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(user._id, 'host')}>
                                Changer en Hôte
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(user._id, 'provider')}>
                                Changer en Prestataire
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}