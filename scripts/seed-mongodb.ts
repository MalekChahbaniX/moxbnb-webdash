import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Listing, Experience, Service } from '../src/models';

async function seedMongoDB() {
  console.log('🌱 Starting MongoDB seed...');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Experience.deleteMany({});
    await Service.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const fatma = await User.create({
      email: 'fatma@example.com',
      name: 'Fatma Ben Ali',
      password: 'password123',
      phone: '+216 71 123 456',
      language: 'fr',
      role: 'host'
    });

    const ahmed = await User.create({
      email: 'ahmed@example.com',
      name: 'Ahmed Kaddour',
      password: 'password123',
      phone: '+216 72 234 567',
      language: 'fr',
      role: 'host'
    });

    const leila = await User.create({
      email: 'leila@example.com',
      name: 'Leila Messaoudi',
      password: 'password123',
      phone: '+216 73 345 678',
      language: 'fr',
      role: 'host'
    });

    const omar = await User.create({
      email: 'omar@example.com',
      name: 'Omar Ben Salah',
      password: 'password123',
      phone: '+216 74 456 789',
      language: 'fr',
      role: 'host'
    });

    const chefMansouri = await User.create({
      email: 'chef@example.com',
      name: 'Chef Fatma Mansouri',
      password: 'password123',
      phone: '+216 75 567 890',
      language: 'fr',
      role: 'serviceProvider'
    });

    console.log('✅ Created 5 users');

    // Create listings
    console.log('🏠 Creating listings...');
    await Listing.create({
      title: 'Appartement de Charme à Sidi Bou Said',
      description: 'Magnifique appartement avec vue mer, décoré dans le style traditionnel tunisien. À 5 minutes de la plage.',
      type: 'apartment',
      location: 'Sidi Bou Said',
      city: 'Tunis',
      price: 350,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ['WiFi', 'Climatisation', 'Vue mer', 'Cuisine équipée', 'Parking'],
      houseRules: 'Non fumeur, Pas de fêtes, Animaux non autorisés',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      hostId: fatma._id,
      rating: 4.9,
      reviewsCount: 127
    });

    await Listing.create({
      title: 'Villa avec Piscine à Hammamet',
      description: 'Superbe villa avec piscine privée, jardin et terrasse. Parfait pour les vacances en famille.',
      type: 'villa',
      location: 'Hammamet',
      city: 'Nabeul',
      price: 750,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      amenities: ['Piscine', 'Jardin', 'WiFi', 'Climatisation', 'Cuisine équipée', 'Parking', 'Barbecue'],
      houseRules: 'Non fumeur à l\'intérieur',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
      hostId: ahmed._id,
      rating: 4.8,
      reviewsCount: 89
    });

    await Listing.create({
      title: 'Maison Traditionnelle Djerbienne',
      description: 'Authentique maison djerbienne avec architecture traditionnelle et patio central.',
      type: 'house',
      location: 'Djerba',
      city: 'Medenine',
      price: 280,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      amenities: ['Patio', 'WiFi', 'Climatisation', 'Cuisine traditionnelle', 'Parking'],
      houseRules: 'Respect des traditions locales',
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
      hostId: fatma._id,
      rating: 4.95,
      reviewsCount: 203
    });

    await Listing.create({
      title: 'Studio Vue Mer à Monastir',
      description: 'Coquet studio avec vue imprenable sur la mer et la plage Ribat.',
      type: 'privateRoom',
      location: 'Monastir',
      city: 'Monastir',
      price: 180,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ['Vue mer', 'WiFi', 'Climatisation', 'Kitchenette'],
      houseRules: 'Arrivée flexible possible',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      hostId: leila._id,
      rating: 4.7,
      reviewsCount: 56
    });

    await Listing.create({
      title: 'Cabane dans les Palmiers Tozeur',
      description: 'Expérience unique dans une cabane traditionnelle au milieu des palmeraies de Tozeur.',
      type: 'cabin',
      location: 'Tozeur',
      city: 'Tozeur',
      price: 420,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ['Vue désert', 'WiFi', 'Terrasse', 'Petit-déjeuner inclus'],
      houseRules: 'Pas d\'animaux',
      images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800'],
      hostId: omar._id,
      rating: 4.92,
      reviewsCount: 78
    });

    await Listing.create({
      title: 'Pentasse Moderne Tunis Centre',
      description: 'Luxe et confort au cœur de Tunis avec vue panoramique sur la ville.',
      type: 'apartment',
      location: 'Tunis',
      city: 'Tunis',
      price: 450,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      amenities: ['Vue ville', 'WiFi', 'Climatisation', 'Cuisine équipée', 'Parking', 'Ascenseur'],
      houseRules: 'Non fumeur',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      hostId: ahmed._id,
      rating: 4.85,
      reviewsCount: 145
    });

    console.log('✅ Created 6 listings');

    // Create experiences
    console.log('🎯 Creating experiences...');
    await Experience.create({
      title: 'Dégustation de Cuisine Traditionnelle Tunisienne',
      description: 'Apprenez à préparer les plats tunisiens emblématiques avec une chef locale. Dégustation incluse.',
      category: 'culinary',
      location: 'Tunis',
      city: 'Tunis',
      price: 150,
      duration: '4 heures',
      maxGuests: 8,
      requirements: 'Aucun niveau requis',
      images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
      hostId: fatma._id,
      rating: 4.9,
      reviewsCount: 234
    });

    await Experience.create({
      title: 'Visite Guidée de la Médina de Tunis',
      description: 'Découvrez l\'histoire et la culture de la médina avec un guide expert.',
      category: 'guidedTour',
      location: 'Médina de Tunis',
      city: 'Tunis',
      price: 80,
      duration: '3 heures',
      maxGuests: 10,
      requirements: 'Marche modérée',
      images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800'],
      hostId: ahmed._id,
      rating: 4.8,
      reviewsCount: 512
    });

    await Experience.create({
      title: 'Atelier de Poterie à Sejnane',
      description: 'Apprenez les techniques ancestrales de poterie de Sejnane, patrimoine UNESCO.',
      category: 'artistic',
      location: 'Sejnane',
      city: 'Bizerte',
      price: 200,
      duration: '5 heures',
      maxGuests: 6,
      requirements: 'Vêtements pouvant être tachés',
      images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
      hostId: leila._id,
      rating: 4.95,
      reviewsCount: 89
    });

    await Experience.create({
      title: 'Balade en Chameau dans le Sahara',
      description: 'Aventure inoubliable dans le désert tunisien avec guide bédouin et coucher de soleil.',
      category: 'adventure',
      location: 'Douz',
      city: 'Kebili',
      price: 350,
      duration: '1 journée',
      maxGuests: 4,
      requirements: 'Condition physique moyenne',
      images: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800'],
      hostId: omar._id,
      rating: 4.97,
      reviewsCount: 345
    });

    console.log('✅ Created 4 experiences');

    // Create services
    console.log('🛠️  Creating services...');
    await Service.create({
      title: 'Cuisine Traditionnelle à Domicile',
      description: 'Chef professionnel qui cuisine pour vous à domicile avec des produits locaux frais.',
      type: 'privateChef',
      location: 'Tunis',
      city: 'Tunis',
      price: 500,
      duration: '4 heures',
      providerId: chefMansouri._id,
      rating: 4.9,
      reviewsCount: 78,
      isAvailable: true
    });

    await Service.create({
      title: 'Soin Massage Relaxant',
      description: 'Massage professionnel pour relaxation et bien-être.',
      type: 'massage',
      location: 'Hammamet',
      city: 'Nabeul',
      price: 200,
      duration: '1 heure',
      providerId: chefMansouri._id,
      rating: 4.8,
      reviewsCount: 156,
      isAvailable: true
    });

    await Service.create({
      title: 'Coaching Sportif Personnalisé',
      description: 'Séances de sport personnalisées selon vos objectifs.',
      type: 'sportsCoach',
      location: 'Sousse',
      city: 'Sousse',
      price: 150,
      duration: '1 heure',
      providerId: ahmed._id,
      rating: 4.95,
      reviewsCount: 203,
      isAvailable: true
    });

    await Service.create({
      title: 'Séance Photo Voyage',
      description: 'Photographe professionnel pour capturer vos meilleurs moments en Tunisie.',
      type: 'photography',
      location: 'Tunis',
      city: 'Tunis',
      price: 350,
      duration: '2 heures',
      providerId: leila._id,
      rating: 4.92,
      reviewsCount: 89,
      isAvailable: true
    });

    await Service.create({
      title: 'Service de Traiteur pour Événements',
      description: 'Traiteur haut de gamme pour vos événements spéciaux.',
      type: 'catering',
      location: 'Sfax',
      city: 'Sfax',
      price: 1500,
      duration: 'Sur demande',
      providerId: chefMansouri._id,
      rating: 4.85,
      reviewsCount: 67,
      isAvailable: false
    });

    await Service.create({
      title: 'Coiffure et Maquillage Mariage',
      description: 'Service complet de beauté pour mariées et événements.',
      type: 'hairdressing',
      location: 'Djerba',
      city: 'Medenine',
      price: 600,
      duration: '3 heures',
      providerId: leila._id,
      rating: 4.88,
      reviewsCount: 134,
      isAvailable: true
    });

    console.log('✅ Created 6 services');

    console.log('\n🎉 MongoDB seed completed successfully!');
    console.log('\n📊 Seed Summary:');
    console.log('- Users: 5');
    console.log('- Listings: 6');
    console.log('- Experiences: 4');
    console.log('- Services: 6');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// Run seed
seedMongoDB()
  .then(() => {
    console.log('✅ Seed process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  });
