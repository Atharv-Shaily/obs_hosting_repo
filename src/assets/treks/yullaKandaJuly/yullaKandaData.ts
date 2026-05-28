import yullaRanges from '../yulla/grassland-mountain.jpg';
import trekPath from '../yulla/trek-path.jpg';
import YullaScenery from '../yulla/scenery-otw.jpg';
import groupPrevious from '../yulla/group-summit.png';
import YullaJulyBrochure from './Yulla Kanda Trek Brochure (July Batch).pdf';
import type { TrekData } from '../TrekData';
import reelPreview from './ChatGPT Image May 26, 2026, 11_31_39 AM.png'
export const YullaJulyData: TrekData = {
  id: 'Yulla-July',
  title: 'Yulla Kanda Trek (July) - Oh-Bhaisahab Experience',
  date: 'July 1-4, 2026',
  duration: '4 Days / 3 Nights',
  difficulty: 'Moderate',
  location: 'Yulla Khas , Himachal Pradesh',
  images: [
    groupPrevious,
    yullaRanges,
    trekPath,
    YullaScenery,
  ],
  registrationLink: 'https://u.payu.in/PAYUMN/JIFR6dxFKoCX',
  brochure: YullaJulyBrochure,
  description:
'Join the unforgettable trek with from 1–4 July 2026. More than just a trek, this journey blends adventure, self-reflection, and meaningful human connection amidst the serene Himalayas. Explore the sacred trail leading to the world’s highest Krishna temple, experience peaceful alpine landscapes, meditation, journaling, fun group activities, and create memories that last a lifetime. Perfect for adventure seekers looking for both thrill and personal growth in the heart of Himachal Pradesh.',
  highlights: [
    'Stunning Himalayan landscapes, alpine meadows, and sacred high-altitude lake',
    'Peaceful alpine meadows filled with wild mountain flora',
    'Panoramic views of the snow-covered Himalayas',
    'Happiness Sharing sessions',
    'Meditation & Journaling',
    'Traditional wooden houses',
    'Alpine Olympics',
    'Surprise Activity',
    'Welcome & Farewell gifts + Winner gifts',
  ],
  itinerary: [
  {
    day: 'Day 1',
    title: 'Shimla to Yulla Khas Village',
    description:
      'Group meetup and departure from Shimla to Yulla Khas Village. The scenic drive through the beautiful Kinnaur valley offers breathtaking Himalayan landscapes, riverside roads, apple orchards, and traditional mountain villages. Evening: Welcome session and Happiness Sharing.',
    type: 'Travel',
  },
  {
    day: 'Day 2',
    title: 'Yulla Khas to Base Camp',
    description:
      'Begin the trek from Yulla Khas towards the alpine campsites of Yulla Kanda. The trail passes through dense forests, mountain streams, and open meadows with stunning valley views. Evening: Meditation, Journaling & OBS Signature Activities.',
    type: 'Trek',
  },
  {
    day: 'Day 3',
    title: 'Yulla Kanda Summit & Krishna Temple',
    description:
      'Summit Day — trek to the sacred Yulla Kanda Lake and the world’s highest Krishna temple. Experience panoramic Himalayan views, peaceful alpine landscapes, and moments of reflection beside the sacred lake. Evening: Alpine Olympics, Surprise Activity & Happiness Sharing.',
    type: 'Trek',
  },
  {
    day: 'Day 4',
    title: 'Base Camp to Shimla',
    description:
      'Morning descent trek back to Yulla Khas Village followed by drive to Shimla. Farewell session and departure with unforgettable memories, friendships, and experiences from the mountains.',
    type: 'Trek + Travel',
  },
],
  inclusions: [
    'Stay for 3 nights',
    'Entry/permit fees',
    'Local guide fee',
    'All meals from dinner on Day 1 to breakfast on Day 4',
    'Signature OBS (Oh-Bhaisahab) Experiences',
    'Welcome & Farewell gifts + Winner gifts',
    'Memories for a lifetime ;)',
  ],
  exclusions: [
    'Backpack offloading (if you opt for this)',
    'Medical certificate',
    'Any costs arising due to unforeseen circumstances like landslides, road blocks, etc.',
    'Any kind of personal expenses like tips, laundry, etc.',
    'Anything not mentioned under Trip Inclusions',
  ],
  pricing: {
    trekFee: 11111,
    transportationFee: 0,
    totalCostWithTransport: 11111,
    totalCostWithoutTransport: 11111,
    registrationFee: 2000,
    remainingAmountWithTransport: 9111,
    remainingAmountWithoutTransport: 9111,
    paymentDeadline: '14 June',
  },

paymentLinks: {
    fullPaymentWithTransport: '#',
    fullPaymentWithoutTransport: '#',
    registrationOnly: '#',
    remainingDuesWithTransport: '#',
    remainingDuesWithoutTransport: '#',
},

cancellationPolicy: [
  {
    period: 'Before 14 June',
    fee: '₹2,000',
    refund: 'Remaining amount',
  },
  {
    period: '15 June – 21 June',
    fee: '30% of total fee',
    refund: '70%',
  },
  {
    period: '22 June – 28 June',
    fee: '50% of total fee',
    refund: '50%',
  },
  {
    period: 'On or after 29 June',
    fee: '100%',
    refund: 'Non-refundable',
  },
],
  videoUrl: 'https://www.instagram.com/reels/DNx4Tv4ZraG/',
  videoCoverImage: reelPreview,
  transportationRoute: 'Shimla to Shimla',
};
