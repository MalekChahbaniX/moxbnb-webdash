'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Shield, Bell, Globe, CreditCard, Mail, Lock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminSettings() {
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>('');
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Moxbnb',
    siteDescription: 'Platforme de réservation de logements, expériences et services',
    contactEmail: 'contact@moxbnb.tn',
    supportPhone: '+216 71 234 567',
    defaultLanguage: language,
    timezone: 'Africa/Tunis',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmation: true,
    paymentReceived: true,
    newReview: true,
    systemAlerts: true,
    marketingEmails: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 24,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    requireStrongPassword: true,
    enableCaptcha: true,
    logFailedAttempts: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    commissionRate: 10,
    paymentGateway: 'stripe',
    currency: 'TND',
    refundPolicy: '14d',
    autoRefundEnabled: true,
    minimumPayout: 50
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      const settings = response.data;
      
      if (settings.general) setGeneralSettings(settings.general);
      if (settings.notifications) setNotificationSettings(settings.notifications);
      if (settings.security) setSecuritySettings(settings.security);
      if (settings.payments) setPaymentSettings(settings.payments);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      // Don't show error for network issues, just use default settings
      // The settings are already initialized with default values
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (category: string, settings: any) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await api.put(`/admin/settings/${category}`, settings);
      setSuccess(`Paramètres ${category} sauvegardés avec succès`);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmAction = (action: string) => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleLanguageChange = (newLanguage: string) => {
    // Update the general settings
    setGeneralSettings(prev => ({ ...prev, defaultLanguage: newLanguage as 'fr' | 'en' | 'ar' }));
    // Actually change the system language
    setLanguage(newLanguage as 'fr' | 'en' | 'ar');
    setSuccess('Langue changée avec succès');
  };

  const executeAction = async () => {
    try {
      setSaving(true);
      
      switch (confirmAction) {
        case 'clearCache':
          await api.post('/admin/settings/clear-cache');
          setSuccess('Cache vidé avec succès');
          break;
        case 'backup':
          await api.post('/admin/settings/backup');
          setSuccess('Sauvegarde créée avec succès');
          break;
        case 'restore':
          await api.post('/admin/settings/restore');
          setSuccess('Restauration effectuée avec succès');
          break;
        default:
          break;
      }
      
      setShowConfirmDialog(false);
      setConfirmAction('');
    } catch (err: any) {
      console.error('Error executing action:', err);
      setError(err.message || 'Action failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres Administrateur</h1>
          <p className="text-muted-foreground">
            Configuration de la plateforme et préférences système
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres Généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nom du site</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email de contact</label>
                  <Input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Téléphone support</label>
                  <Input
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Langue par défaut</label>
                  <Select value={generalSettings.defaultLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description du site</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Mode maintenance</label>
                    <p className="text-xs text-muted-foreground">Désactive temporairement l'accès au site</p>
                  </div>
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Autoriser les inscriptions</label>
                    <p className="text-xs text-muted-foreground">Permet aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch
                    checked={generalSettings.allowRegistrations}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, allowRegistrations: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Vérification email requise</label>
                    <p className="text-xs text-muted-foreground">Les utilisateurs doivent vérifier leur email</p>
                  </div>
                  <Switch
                    checked={generalSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('general', generalSettings)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notifications email</label>
                    <p className="text-xs text-muted-foreground">Activer les notifications par email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notifications SMS</label>
                    <p className="text-xs text-muted-foreground">Activer les notifications par SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Confirmation de réservation</label>
                    <Badge variant="outline">Email</Badge>
                  </div>
                  <Switch
                    checked={notificationSettings.bookingConfirmation}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, bookingConfirmation: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Paiement reçu</label>
                    <Badge variant="outline">Email</Badge>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentReceived}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentReceived: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Nouvel avis</label>
                    <Badge variant="outline">Email</Badge>
                  </div>
                  <Switch
                    checked={notificationSettings.newReview}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newReview: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Alertes système</label>
                    <p className="text-xs text-muted-foreground">Notifications importantes pour les administrateurs</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Emails marketing</label>
                    <p className="text-xs text-muted-foreground">Emails promotionnels et newsletters</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('notifications', notificationSettings)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Timeout de session (heures)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Longueur min. mot de passe</label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tentatives de connexion max</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Durée de blocage (minutes)</label>
                  <Input
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Authentification à deux facteurs</label>
                    <p className="text-xs text-muted-foreground">Renforce la sécurité des comptes</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Mot de passe fort requis</label>
                    <p className="text-xs text-muted-foreground">Exige des mots de passe complexes</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireStrongPassword}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireStrongPassword: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">CAPTCHA activé</label>
                    <p className="text-xs text-muted-foreground">Protection contre les robots</p>
                  </div>
                  <Switch
                    checked={securitySettings.enableCaptcha}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableCaptcha: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Journaliser les tentatives échouées</label>
                    <p className="text-xs text-muted-foreground">Enregistre les tentatives de connexion infructueuses</p>
                  </div>
                  <Switch
                    checked={securitySettings.logFailedAttempts}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, logFailedAttempts: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('security', securitySettings)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paramètres de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Taux de commission (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={paymentSettings.commissionRate}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Passerelle de paiement</label>
                  <Select value={paymentSettings.paymentGateway} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, paymentGateway: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="paymee">Paymee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Devise</label>
                  <Select value={paymentSettings.currency} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TND">TND - Dinar Tunisien</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="USD">USD - Dollar Américain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Politique de remboursement</label>
                  <Select value={paymentSettings.refundPolicy} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, refundPolicy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 heures</SelectItem>
                      <SelectItem value="3d">3 jours</SelectItem>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="14d">14 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Seuil de paiement minimum (DT)</label>
                  <Input
                    type="number"
                    value={paymentSettings.minimumPayout}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, minimumPayout: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Remboursement automatique</label>
                    <p className="text-xs text-muted-foreground">Traite automatiquement les demandes de remboursement</p>
                  </div>
                  <Switch
                    checked={paymentSettings.autoRefundEnabled}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, autoRefundEnabled: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('payments', paymentSettings)} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Paramètres Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleConfirmAction('clearCache')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vider le cache
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supprime les fichiers temporaires et cache système
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Sauvegarde</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleConfirmAction('backup')}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Créer une sauvegarde
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Sauvegarde la base de données et les fichiers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Restauration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleConfirmAction('restore')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restaurer
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Restaure depuis la dernière sauvegarde
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" disabled>
                      <Mail className="h-4 w-4 mr-2" />
                      Exporter les logs
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Exporte les logs système (bientôt disponible)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Informations Système</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Version:</span> 1.0.0
                  </div>
                  <div>
                    <span className="font-medium">Node.js:</span> v18.x
                  </div>
                  <div>
                    <span className="font-medium">Base de données:</span> MongoDB
                  </div>
                  <div>
                    <span className="font-medium">Dernière sauvegarde:</span> Il y a 2 heures
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir effectuer cette action ? Cette opération peut affecter le fonctionnement de la plateforme.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={executeAction} disabled={saving}>
              {saving ? 'Exécution...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
