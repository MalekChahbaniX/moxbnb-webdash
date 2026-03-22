import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { User, Listing, Experience, Service, Booking, Review, Message } from '../models';

const prisma = new PrismaClient();

async function migrateData() {
  console.log('🚀 Starting migration from Prisma to MongoDB...');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing MongoDB data...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Experience.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});

    // Migrate Users
    console.log('👥 Migrating Users...');
    const prismaUsers = await prisma.user.findMany();
    const users = await User.insertMany(
      prismaUsers.map(user => ({
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        avatar: user.avatar,
        language: user.language,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    );
    console.log(`✅ Migrated ${users.length} users`);

    // Create user mapping for reference
    const userMap = new Map();
    prismaUsers.forEach((prismaUser, index) => {
      userMap.set(prismaUser.id, users[index]._id);
    });

    // Migrate Listings
    console.log('🏠 Migrating Listings...');
    const prismaListings = await prisma.listing.findMany();
    const listings = await Listing.insertMany(
      prismaListings.map(listing => ({
        title: listing.title,
        description: listing.description,
        type: listing.type,
        location: listing.location,
        city: listing.city,
        price: listing.price,
        currency: listing.currency,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        maxGuests: listing.maxGuests,
        amenities: listing.amenities ? JSON.parse(listing.amenities) : [],
        houseRules: listing.houseRules,
        images: listing.images ? JSON.parse(listing.images) : [],
        hostId: userMap.get(listing.hostId),
        rating: listing.rating,
        reviewsCount: listing.reviewsCount,
        isActive: listing.isActive,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt
      }))
    );
    console.log(`✅ Migrated ${listings.length} listings`);

    // Create listing mapping
    const listingMap = new Map();
    prismaListings.forEach((prismaListing, index) => {
      listingMap.set(prismaListing.id, listings[index]._id);
    });

    // Migrate Experiences
    console.log('🎯 Migrating Experiences...');
    const prismaExperiences = await prisma.experience.findMany();
    const experiences = await Experience.insertMany(
      prismaExperiences.map(experience => ({
        title: experience.title,
        description: experience.description,
        category: experience.category,
        location: experience.location,
        city: experience.city,
        price: experience.price,
        currency: experience.currency,
        duration: experience.duration,
        maxGuests: experience.maxGuests,
        requirements: experience.requirements,
        images: experience.images ? JSON.parse(experience.images) : [],
        hostId: userMap.get(experience.hostId),
        rating: experience.rating,
        reviewsCount: experience.reviewsCount,
        isActive: experience.isActive,
        createdAt: experience.createdAt,
        updatedAt: experience.updatedAt
      }))
    );
    console.log(`✅ Migrated ${experiences.length} experiences`);

    // Create experience mapping
    const experienceMap = new Map();
    prismaExperiences.forEach((prismaExperience, index) => {
      experienceMap.set(prismaExperience.id, experiences[index]._id);
    });

    // Migrate Services
    console.log('🛠️  Migrating Services...');
    const prismaServices = await prisma.service.findMany();
    const services = await Service.insertMany(
      prismaServices.map(service => ({
        title: service.title,
        description: service.description,
        type: service.type,
        location: service.location,
        city: service.city,
        price: service.price,
        currency: service.currency,
        duration: service.duration,
        providerId: userMap.get(service.providerId),
        rating: service.rating,
        reviewsCount: service.reviewsCount,
        isAvailable: service.isAvailable,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    );
    console.log(`✅ Migrated ${services.length} services`);

    // Create service mapping
    const serviceMap = new Map();
    prismaServices.forEach((prismaService, index) => {
      serviceMap.set(prismaService.id, services[index]._id);
    });

    // Migrate Bookings
    console.log('📅 Migrating Bookings...');
    const prismaBookings = await prisma.booking.findMany();
    const bookings = await Booking.insertMany(
      prismaBookings.map(booking => {
        let itemId: mongoose.Types.ObjectId;
        
        if (booking.type === 'property') {
          itemId = listingMap.get(booking.itemId);
        } else if (booking.type === 'experience') {
          itemId = experienceMap.get(booking.itemId);
        } else {
          itemId = serviceMap.get(booking.itemId);
        }

        return {
          type: booking.type,
          itemId,
          userId: userMap.get(booking.userId),
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          totalPrice: booking.totalPrice,
          status: booking.status,
          specialRequests: booking.specialRequests,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        };
      })
    );
    console.log(`✅ Migrated ${bookings.length} bookings`);

    // Create booking mapping
    const bookingMap = new Map();
    prismaBookings.forEach((prismaBooking, index) => {
      bookingMap.set(prismaBooking.id, bookings[index]._id);
    });

    // Migrate Reviews
    console.log('⭐ Migrating Reviews...');
    const prismaReviews = await prisma.review.findMany();
    const reviews = await Review.insertMany(
      prismaReviews.map(review => ({
        rating: review.rating,
        comment: review.comment,
        userId: userMap.get(review.userId),
        bookingId: bookingMap.get(review.bookingId),
        listingId: review.listingId ? listingMap.get(review.listingId) : undefined,
        experienceId: review.experienceId ? experienceMap.get(review.experienceId) : undefined,
        serviceId: review.serviceId ? serviceMap.get(review.serviceId) : undefined,
        createdAt: review.createdAt
      }))
    );
    console.log(`✅ Migrated ${reviews.length} reviews`);

    // Migrate Messages
    console.log('💬 Migrating Messages...');
    const prismaMessages = await prisma.message.findMany();
    const messages = await Message.insertMany(
      prismaMessages.map(message => ({
        senderId: userMap.get(message.senderId),
        receiverId: userMap.get(message.receiverId),
        bookingId: message.bookingId ? bookingMap.get(message.bookingId) : undefined,
        content: message.content,
        isRead: message.isRead,
        createdAt: message.createdAt
      }))
    );
    console.log(`✅ Migrated ${messages.length} messages`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Listings: ${listings.length}`);
    console.log(`- Experiences: ${experiences.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- Bookings: ${bookings.length}`);
    console.log(`- Reviews: ${reviews.length}`);
    console.log(`- Messages: ${messages.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('✅ Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration process failed:', error);
    process.exit(1);
  });
