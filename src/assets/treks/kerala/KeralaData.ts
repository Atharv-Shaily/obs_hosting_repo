// Placeholder images – replace with Kerala trip images when available
import kerala1 from './kerala_1.webp';
import kerala2 from './kerala_2.jpg';
import kerala3 from './kerala_3.jpg';
import kerala4 from './kerala_4.jpg';
import kerala5 from './kerala_5.jpg';

import type { TrekData } from '../TrekData';

export const keralaData: TrekData = {
  id: 'kerala',
  title: 'Kerala Trip - Oh-Bhaisahab Experience',
  date: 'April 17-21, 2026',
  duration: '5 Days / 4 Nights',
  difficulty: 'Easy',
  location: 'Kerala',
  images: [kerala5, kerala2, kerala4, kerala1, kerala3],
  // No brochure for Kerala
  description:
    'Explore the backwaters, hills and culture of Kerala with OBS. Early bird price ₹27,000 (original ₹30,000). Only 2 seats left at this discount. Pay ₹6,750 now and the rest later.',
  highlights: [
    'Alpine Olympics',
    'Happiness Sharing',
    'Meet up and Intro in OBS style 😎',
    'Aline Circuit',
    'Backwaters, hills and cultural experiences'
  ],
  itinerary: [
    {
      day: 'Day 1',
      title: 'Kochi → Munnar',
      description: 'Arrival at Kochi, meet up and intro. with Yatharth. Drive to Munnar.',
      type: 'Travel',
    },
    {
      day: 'Day 2',
      title: 'Exploration & Sightseeing in Munnar',
      description: 'Explore Munnar with visits to Eravikulam National Park, Echo Point, Kundala Lake, and the Rose Garden. Enjoy OBS activities before returning to your hotel for an overnight stay.',
      type: 'Sightseeing',
    },
    {
      day: 'Day 3',
      title: 'Trek to Chokramudi Peak',
      description: 'Start with breakfast and trek Chokramudi Peak for scenic views. Visit Gap Road, Lock Heart View Point, Blossom Park, and Pothamedu View Point, with free time in the evening for local shopping.',
      type: 'Trek',
    },
    {
      day: 'Day 4',
      title: 'Munnar → Alleppey Houseboat Stay',
      description: 'After breakfast, enjoy meditation and journaling, then drive to Alleppey for a houseboat stay. Cruise the serene backwaters with meals onboard and an overnight stay by the waters.',
      type: 'Travel',
    },
    {
      day: 'Day 5',
      title: 'Alleppey → Fort Kochi',
      description: 'Enjoy a houseboat breakfast cruise, then drive to Fort Kochi to visit key landmarks and the beach. Conclude your Kerala trip with a farewell, award ceremony, and memorable moments.',
      type: 'Travel',
    },
  ],
  inclusions: [
    '4-night stay in hotels and a traditional houseboat',
    'Meals as per itinerary',
    'Private A/C vehicle with driver for transfers and sightseeing',
    'Driver\'s allowance, toll fees, parking, and all applicable taxes',
    'Entry ticket to Eravikulam National Park',
    'Boating at Echo Point',
    'All OBS Signature Activities',
    'Welcome & Farewell gifts',
    'Gifts for Winners',
    'Memories for a lifetime ;)'
  ],
  exclusions: [
    'Airfare or train tickets to/from Kerala',
    'Personal expenses',
    'Any meals not mentioned in the meal plan',
    'Any boating or activity charges not specifically included in the itinerary',
    'Any costs arising due to unforeseen circumstances like landslides, road blocks, etc.',
    'Anything not listed in inclusions'
  ],
  pricing: {
    trekFee: 27000,
    transportationFee: 0,
    totalCostWithTransport: 27000,
    totalCostWithoutTransport: 0,
    registrationFee: 6750,
    remainingAmountWithTransport: 20250,
    remainingAmountWithoutTransport: 0,
    paymentDeadline: '1 April 2026',
    originalPrice: 30000,
    earlyBirdSeatsLeft: 2,
  },
  paymentLinks: {
    fullPaymentWithTransport: '#',
    fullPaymentWithoutTransport: '#',
    registrationOnly: '#',
    remainingDuesWithTransport: '#',
    remainingDuesWithoutTransport: '#',
  },
  cancellationPolicy: [],
};
