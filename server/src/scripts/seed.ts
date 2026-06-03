/**
 * Seed script — inserts test treks into MongoDB.
 * Run with: npx ts-node src/scripts/seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trek from '../models/Trek';

dotenv.config();

const testTreks = [
  {
    title: 'Valley of Flowers',
    description: 'Trek through a UNESCO World Heritage Site in Uttarakhand.',
    loyaltyReward: 500,
  },
  {
    title: 'Kuari Pass',
    description: 'A stunning Himalayan ridge walk with panoramic views.',
    loyaltyReward: 750,
  },
  {
    title: 'Yulla Kanda',
    description: 'A hidden gem in Himachal Pradesh with alpine meadows.',
    loyaltyReward: 1000,
  },
];

const seed = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB.');

  // Check if treks already exist
  const existing = await Trek.countDocuments();
  if (existing > 0) {
    console.log(`${existing} trek(s) already exist. Listing them:\n`);
    const treks = await Trek.find();
    treks.forEach((t) => {
      console.log(`  ID: ${t._id}`);
      console.log(`  Title: ${t.title} | Reward: ${t.loyaltyReward} pts\n`);
    });
  } else {
    const created = await Trek.insertMany(testTreks);
    console.log(`Seeded ${created.length} treks:\n`);
    created.forEach((t) => {
      console.log(`  ID: ${t._id}`);
      console.log(`  Title: ${t.title} | Reward: ${t.loyaltyReward} pts\n`);
    });
  }

  await mongoose.disconnect();
  console.log('Done.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
