# 🏠 Moxbnb - Website & Dashboard

Bienvenue dans le frontend de Moxbnb ! Notre plateforme de location, expériences et services en Tunisie avec une interface moderne et intuitive.

> **Note pour l'équipe** : Ce frontend est composé de deux parties principales : le site public pour les utilisateurs et le dashboard d'administration. Il communique avec notre backend API pour toutes les opérations.

## 🛠️ Stack Technique

Notre frontend utilise les meilleures technologies modernes :

### 🎯 Framework & Base
- **⚡ Next.js 15** : Framework React avec App Router pour performances optimales
- **📘 TypeScript 5** : Code typé et sécurisé pour éviter les erreurs
- **🎨 Tailwind CSS 4** : Design rapide et responsive

### 🧩 Composants & UI
- **🧩 shadcn/ui** : Composants de haute qualité basés sur Radix UI
- **🎯 Lucide React** : Icônes modernes et cohérentes
- **🌈 Framer Motion** : Animations fluides et micro-interactions
- **🎨 Next Themes** : Mode sombre/clair en 2 lignes de code

### 📋 Formulaires & Validation
- **🎣 React Hook Form** : Formulaires performants avec validation facile
- **✅ Zod** : Validation de schémas type-safe

### 🔄 State Management & API
- **🐻 Zustand** : State management simple et scalable
- **🔄 TanStack Query** : Synchronisation des données avec notre backend
- **🌐 Fetch** : Requêtes HTTP optimisées

### 🎨 Fonctionnalités Avancées
- **📊 TanStack Table** : Tableaux et datagrids puissants
- **🖱️ DND Kit** : Drag & drop moderne
- **📊 Recharts** : Graphiques et visualisations
- **🖼️ Sharp** : Optimisation des images

### 🌍 Internationalisation & Utils
- **🌍 Next Intl** : Support multilingue (Français/Arabe/Anglais)
- **📅 Date-fns** : Manipulation de dates
- **🪝 ReactUse** : Hooks essentiels pour le développement

## 🎯 Ce que notre frontend offre

- **🏎️ Développement Rapide** : Outils pré-configurés et meilleures pratiques
- **🎨 UI Magnifique** : Bibliothèque complète shadcn/ui avec interactions avancées
- **🔒 Type Safety** : Configuration TypeScript complète avec validation Zod
- **📱 Responsive** : Design mobile-first avec animations fluides
- **🔐 Authentification** : Connexion sécurisée avec notre backend API
- **📊 Visualisation** : Graphiques, tableaux, et fonctionnalités drag & drop
- **🌍 Multilingue** : Support Français/Arabe/Anglais avec Next Intl
- **🚀 Production Ready** : Build optimisé et configuration déploiement
- **🤖 AI-Friendly** : Code structuré parfait pour l'assistance IA

## 🏠 Architecture Moxbnb

Notre frontend est divisé en deux parties :

### Site Public 🌐
- **Homepage** : Présentation de la plateforme
- **Recherche** : Filtrage avancé des logements
- **Détails** : Pages complètes des annonces
- **Profil Utilisateur** : Gestion compte et réservations
- **Paiement** : Intégration solutions tunisiennes

### Dashboard Admin 📊
- **Gestion Annonces** : CRUD complet pour les logements
- **Utilisateurs** : Gestion des comptes et permissions
- **Réservations** : Suivi et validation des bookings
- **Analytics** : Statistiques et rapports
- **Paiements** : Suivi des transactions
- **Settings** : Configuration plateforme

## 🚀 Démarrage Rapide (Pour l'équipe)

### Prérequis
- Node.js 18+
- npm ou yarn (utilisez ce que vous préférez)

### Installation

1. **Cloner et installer**
```bash
git clone <repository-url>
cd Moxbnb
npm install
# ou yarn install
```

2. **Configuration**
```bash
cp .env.example .env.local
# Configurez vos variables d'environnement
```

3. **Lancer le serveur**
```bash
# Développement
npm run dev
# ou yarn dev

# Build production
npm run build
# ou yarn build

# Start production
npm start
# ou yarn start
```

### URLs
- **Développement** : http://localhost:3000
- **Site Public** : http://localhost:3000
- **Dashboard Admin** : http://localhost:3000/admin

> **Conseil équipe** : Le serveur de développement redémarre automatiquement avec hot-reload. Utilisez toujours `npm run dev` pour le développement !

### Configuration Backend
Assurez-vous que le backend Moxbnb est démarré sur `http://localhost:3001` (ou configurez l'URL dans `.env.local`)

## 📁 Structure du Projet

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Pages publiques (homepage, recherche, etc.)
│   ├── (auth)/            # Pages d'authentification
│   ├── admin/             # Dashboard admin
│   └── api/               # API routes (si besoin)
├── components/            # Composants React réutilisables
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Formulaires personnalisés
│   ├── layout/           # Composants de layout
│   └── features/         # Composants par feature
├── hooks/                # Hooks React personnalisés
├── lib/                  # Utilitaires et configurations
│   ├── api/             # Client API pour notre backend
│   ├── utils/           # Fonctions utilitaires
│   └── validations/     # Schémas Zod
├── store/                # Store Zustand
├── types/                # Types TypeScript
└── styles/               # Styles globaux
```

> **Pour l'équipe** : Suivez cette structure pour maintenir le code organisé !
> - Pages dans `app/`
> - Composants réutilisables dans `components/`
> - Logique API dans `lib/api/`

## 🎨 Fonctionnalités Disponibles

### 🧩 Composants UI (shadcn/ui)
- **Layout** : Card, Separator, Aspect Ratio, Panels
- **Forms** : Input, Textarea, Select, Checkbox, Radio, Switch
- **Feedback** : Alert, Toast (Sonner), Progress, Skeleton
- **Navigation** : Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay** : Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display** : Badge, Avatar, Calendar

### 📊 Fonctionnalités Avancées
- **Tableaux** : Datatables puissantes avec tri, filtrage, pagination
- **Graphiques** : Visualisations avec Recharts pour les analytics
- **Formulaires** : Type-safe avec React Hook Form + Zod
- **Animations** : Micro-interactions fluides avec Framer Motion
- **Drag & Drop** : Fonctionnalité moderne avec DND Kit
- **Thèmes** : Mode sombre/clair intégré

### 🔐 Intégration Backend
- **Authentification** : Connexion sécurisée avec notre API Moxbnb
- **API Client** : Requêtes HTTP avec TanStack Query
- **State Management** : Simple et scalable avec Zustand
- **Validation** : Validation stricte avec Zod

### 🌍 Fonctionnalités Production
- **Multilingue** : Support Français/Arabe/Anglais avec Next Intl
- **Images** : Optimisation automatique avec Sharp
- **Type Safety** : TypeScript complet avec Zod
- **Hooks** : 100+ hooks utiles avec ReactUse

## 👥 Comment contribuer (Guide pour l'équipe)

### Notre workflow
1. **Fork** le projet sur votre GitHub
2. **Créer une branche** : `git checkout -b feature/nouvelle-feature`
3. **Développer** en suivant la structure du projet
4. **Tester** : `npm run lint` et vérifier le build
5. **Commit** : `git commit -m "feat: ajoute nouvelle feature"`
6. **Push** : `git push origin feature/nouvelle-feature`
7. **Pull Request** : Sur la branche principale

### Bonnes pratiques
- **Structure** : Respectez l'architecture app/components/lib
- **Composants** : Créez des composants réutilisables dans `components/`
- **Types** : Utilisez TypeScript pour tout
- **Styles** : Préférez Tailwind CSS aux styles inline
- **API** : Utilisez TanStack Query pour les appels backend
- **Tests** : Ajoutez des tests pour les nouvelles features

### Support équipe
- **Slack** : #frontend-moxbnb pour les questions techniques
- **Code Review** : Toute PR doit être reviewée par au moins 1 autre dev
- **Design** : Consultez Figma avant d'implémenter de nouvelles UI

## 🚀 Déploiement

### Variables d'environnement (.env.local)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentification (si NextAuth.js utilisé)
NEXTAUTH_SECRET=votre_secret
NEXTAUTH_URL=http://localhost:3000

# Autres configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build & Deploy
```bash
# Build pour production
npm run build

# Lancer en production
npm start

# Vérifier le build
npm run build:analyze  # Analyse du bundle
```

## 🌍 Internationalisation

Notre frontend supporte 3 langues :
- **Français** (défaut)
- **Arabe** 
- **Anglais**

Les traductions sont dans `src/messages/`. Ajoutez vos nouvelles clés de traduction dans les fichiers correspondants.

---

**Made with ❤️ by the Moxbnb Team**
