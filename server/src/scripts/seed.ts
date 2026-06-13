/**
 * Seed / sync script — upserts all trek records into MongoDB.
 * Run with: npx ts-node src/scripts/seed.ts
 *
 * Safe to re-run: uses upsert so existing records are updated, not duplicated.
 * Pricing here is the authoritative server-side source of truth.
 * The frontend TrekData files are for display only — prices are resolved from this DB.
 *
 * null  = this payment option is not available for the trek.
 * number = the real price in INR for that option.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trek from '../models/Trek';

dotenv.config();

const treks = [
  // ── Kuari Pass (December, past) ──────────────────────────────────────────
  {
    title: 'Kuari Pass Trek - Winter Wonderland',
    description: 'Experience the magic of winter in the Garhwal Himalayas with our signature Kuari Pass trek.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 2999,
      paymentDeadline: '25 November',
      totalCostWithTransport: 12999,
      remainingAmountWithTransport: 10000,
      totalCostWithoutTransport: 10499,
      remainingAmountWithoutTransport: 7500,
      originalPrice: null,
    },
  },
  // ── Kuari Pass (May batch) ────────────────────────────────────────────────
  {
    title: 'Kuari Pass Trek (May) - Trekking Club x OBS Experience',
    description: 'Step into the legendary Kuari Pass trail — summer edition with OBS signature activities.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 2999,
      paymentDeadline: '1 May',
      totalCostWithTransport: 12999,
      remainingAmountWithTransport: 10000,
      totalCostWithoutTransport: 10499,
      remainingAmountWithoutTransport: 7500,
      originalPrice: null,
    },
  },
  // ── Kuari Pass (June batch) ───────────────────────────────────────────────
  {
    title: 'Kuari Pass Trek (June) - Oh-Bhaisahab Experience',
    description: 'Step into the legendary Kuari Pass trail — June edition with OBS signature activities.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 2999,
      paymentDeadline: '5 May',
      totalCostWithTransport: 12999,
      remainingAmountWithTransport: 10000,
      totalCostWithoutTransport: 10499,
      remainingAmountWithoutTransport: 7500,
      originalPrice: null,
    },
  },
  // ── Valley of Flowers (July) ──────────────────────────────────────────────
  {
    title: 'Valley of Flowers Trek',
    description: 'Trek through the Valley of Flowers, a UNESCO World Heritage Site.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 2750,
      paymentDeadline: '14 June',
      // Transport is bundled — no separate without-transport option
      totalCostWithTransport: 13750,
      remainingAmountWithTransport: 11000,
      totalCostWithoutTransport: null,
      remainingAmountWithoutTransport: null,
      originalPrice: null,
    },
  },
  // ── Yulla Kanda (July) ────────────────────────────────────────────────────
  {
    title: 'Yulla Kanda Trek (July) - Oh-Bhaisahab Experience',
    description: 'Trek to the sacred Yulla Kanda Lake and the world\'s highest Krishna temple.',
    loyaltyReward: 1000,
    pricing: {
      registrationFee: 2000,
      paymentDeadline: '14 June',
      // Same cost with or without transport — trek fee is all-inclusive
      totalCostWithTransport: 11111,
      remainingAmountWithTransport: 9111,
      totalCostWithoutTransport: 11111,
      remainingAmountWithoutTransport: 9111,
      originalPrice: null,
    },
  },
  // ── Brahmatal ─────────────────────────────────────────────────────────────
  {
    title: 'Brahmatal Trek - Oh-Bhaisahab Experience',
    description: 'An enchanting winter Himalayan trek featuring a frozen alpine lake.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 3300,
      paymentDeadline: '1 March',
      totalCostWithTransport: 13300,
      remainingAmountWithTransport: 10000,
      totalCostWithoutTransport: 10900,
      remainingAmountWithoutTransport: 7600,
      originalPrice: null,
    },
  },
  // ── Sandakphu-Phalut ──────────────────────────────────────────────────────
  {
    title: 'Sandakphu-Phalut Trek - Oh-Bhaisahab Experience',
    description: 'A legendary ridge walk offering views of four of the world\'s tallest mountains.',
    loyaltyReward: 1000,
    pricing: {
      registrationFee: 2900,
      paymentDeadline: '14 January',
      // No transport included — own arrangement from NJP/Bagdogra
      totalCostWithTransport: null,
      remainingAmountWithTransport: null,
      totalCostWithoutTransport: 13545, // ₹12,900 + 5% GST
      remainingAmountWithoutTransport: 10645,
      originalPrice: null,
    },
  },
  // ── Nagtibba ──────────────────────────────────────────────────────────────
  {
    title: 'Nagtibba Trek - Oh-Bhaisahab Experience',
    description: 'A perfect weekend trek to Nagtibba with stunning Himalayan views.',
    loyaltyReward: 500,
    pricing: {
      registrationFee: 1500,
      paymentDeadline: '15 March',
      // Transport bundled — no without-transport option
      totalCostWithTransport: 5500,
      remainingAmountWithTransport: 4000,
      totalCostWithoutTransport: null,
      remainingAmountWithoutTransport: null,
      originalPrice: 5999,
    },
  },
  // ── Kedarkantha ───────────────────────────────────────────────────────────
  {
    title: 'Kedarkantha Trek - Oh-Bhaisahab Experience',
    description: 'An iconic winter summit trek famous for sunrise from Kedarkantha Peak.',
    loyaltyReward: 750,
    pricing: {
      registrationFee: 2000,
      paymentDeadline: '20 December',
      // Only transport-included option available
      totalCostWithTransport: 12000,
      remainingAmountWithTransport: 10000,
      totalCostWithoutTransport: null,
      remainingAmountWithoutTransport: null,
      originalPrice: null,
    },
  },
  // ── Kerala ────────────────────────────────────────────────────────────────
  {
    title: 'Kerala Trip - Oh-Bhaisahab Experience',
    description: 'Explore the backwaters, hills and culture of Kerala with OBS.',
    loyaltyReward: 1000,
    pricing: {
      registrationFee: 6750,
      paymentDeadline: '1 April 2026',
      // All-inclusive package — no without-transport option
      totalCostWithTransport: 27000,
      remainingAmountWithTransport: 20250,
      totalCostWithoutTransport: null,
      remainingAmountWithoutTransport: null,
      originalPrice: 30000,
    },
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

  let upserted = 0;
  let updated = 0;

  for (const trek of treks) {
    const result = await Trek.updateOne(
      { title: trek.title },           // match by exact title
      { $set: trek },                   // update all fields including pricing
      { upsert: true }                  // insert if not found
    );
    if (result.upsertedCount > 0) upserted++;
    else updated++;
    console.log(`  ${result.upsertedCount > 0 ? '[CREATED]' : '[UPDATED]'} ${trek.title}`);
  }

  console.log(`\nDone. ${upserted} created, ${updated} updated.`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

