import mongoose from 'mongoose';
import { User, Listing, Experience, Service, Booking, Review, Message } from '../src/models';

// Helper functions for MongoDB operations
export class MongoDBHelper {
  static async connect() {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }

  static async clearDatabase() {
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Experience.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️ Database cleared');
  }

  static async getDatabaseStats() {
    const stats = {
      users: await User.countDocuments(),
      listings: await Listing.countDocuments(),
      experiences: await Experience.countDocuments(),
      services: await Service.countDocuments(),
      bookings: await Booking.countDocuments(),
      reviews: await Review.countDocuments(),
      messages: await Message.countDocuments()
    };
    return stats;
  }

  static async printStats() {
    const stats = await this.getDatabaseStats();
    console.log('\n📊 Database Statistics:');
    Object.entries(stats).forEach(([collection, count]) => {
      console.log(`- ${collection.charAt(0).toUpperCase() + collection.slice(1)}: ${count}`);
    });
  }
}

export default MongoDBHelper;
