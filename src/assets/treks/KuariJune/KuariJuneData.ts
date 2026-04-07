import kuariRanges from '../kuari/kuari-ranges.png';
import kuariTaliLake from '../kuari/Kuari-Pass-Trek-Tali-Lake.webp';
import kuariScenery from '../kuari/kuari-scenery.avif';
import groupPrevious from '../kuari/group-previous.png';
import kuariJuneBrochure from './Kuari Pass 5June Brochure (OBS Experience).pdf';
import type { TrekData } from '../TrekData';

export const kuariJuneData: TrekData = {
  id: 'kuari-june',
  title: 'Kuari Pass Trek - Oh-Bhaisahab Experience',
  date: 'June 5-10, 2026',
  duration: '6 Days / 5 Nights',
  difficulty: 'Moderate',
  location: 'Garhwal Himalayas, Uttarakhand',
  images: [
    groupPrevious,
    kuariRanges,
    kuariTaliLake,
    kuariScenery,
  ],
  brochure: kuariJuneBrochure,
  description:
    'Step into the legendary Kuari Pass trail — often called the Curzon Trail — where lush alpine meadows, ancient oak forests, and a panoramic 360° Himalayan skyline welcome every wanderer with open arms. This summer edition of the OBS Kuari Pass experience blends trekking adventure with curated activities focused on reflection, fun, and human connection.',
  highlights: [
    '360° Himalayan panorama from Kuari Pass (12,500 ft)',
    'Views of Nanda Devi, Kamet, Chaukhamba, Trishul & Neelkanth',
    'Lush alpine meadows and ancient oak forests',
    'Campsites with breathtaking views of Mt. Dronagiri',
    'Happiness Sharing sessions',
    'Meditation & Journaling',
    'Alpine Olympics',
    'Astro Nite (telescope experience)',
    'Surprise Activity',
    'Welcome & Farewell gifts + Winner gifts',
  ],
  itinerary: [
    {
      day: 'Day 1',
      title: 'Dehradun to Joshimath',
      description:
        'Group meetup and goodies distribution. Drive from Dehradun to Joshimath (280 km, 8–9 hr). The road follows the Ganga and Alaknanda rivers, offering spectacular valley views.',
      type: 'Travel',
    },
    {
      day: 'Day 2',
      title: 'Joshimath to Gulling',
      description:
        'Drive from Joshimath to Tugasi (16 km), then trek from Tugasi to Gulling (3 km, ~2–3 hrs). A steady climb on a defined trail rewarding you with glimpses of distant peaks. Evening: Alpine Olympics & Happiness Sharing.',
      type: 'Travel + Trek',
    },
    {
      day: 'Day 3',
      title: 'Gulling to Khullara',
      description:
        'Trek from Gulling to Khullara campsite (3 km). Trail moves through alpine forests into open clearings. Khullara greets you with vast meadows and breathtaking vistas of Mt. Dronagiri. Evening: Alpine Circuit, Mandala Art Workshop & Astro Nite.',
      type: 'Trek',
    },
    {
      day: 'Day 4',
      title: 'Khullara to Kuari Pass & back',
      description:
        'Summit Day — trek to Kuari Pass (10 km round trek). A thrilling climb to Kuari Pass (12,500 ft) where a 360° Himalayan panorama unfolds: Nanda Devi, Kamet, Chaukhamba, Trishul, Neelkanth and many more peaks stand tall. Descent back to Khullara campsite.',
      type: 'Trek',
    },
    {
      day: 'Day 5',
      title: 'Khullara to Joshimath',
      description:
        'Morning Meditation & Journaling. Trek from Khullara to Tugasi (6 km), then drive from Tugasi to Joshimath (16 km, ~1 hr). Night halt in Joshimath.',
      type: 'Trek + Travel',
    },
    {
      day: 'Day 6',
      title: 'Joshimath to Dehradun',
      description:
        'Farewell and drive from Joshimath to Dehradun (280 km, 8–9 hr). The return journey follows the scenic Chamoli–Rudraprayag–Rishikesh highway along the Alaknanda and Ganga rivers.',
      type: 'Travel',
    },
  ],
  inclusions: [
    'Stay for 5 nights',
    'Entry/permit fees',
    'Local guide fee',
    'All meals from dinner on Day 1 to breakfast on Day 6',
    'Transportation from Dehradun to Dehradun (if you opt for this)',
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
    trekFee: 10499,
    transportationFee: 2500,
    totalCostWithTransport: 12999,
    totalCostWithoutTransport: 10499,
    registrationFee: 2999,
    remainingAmountWithTransport: 10000,
    remainingAmountWithoutTransport: 7500,
    paymentDeadline: '5 May',
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
      period: 'Before 5 May',
      fee: '₹2,999',
      refund: 'Remaining amount',
    },
    {
      period: '6 May – 21 May',
      fee: '30% of total fee',
      refund: '70%',
    },
    {
      period: '22 May – 2 June',
      fee: '50% of total fee',
      refund: '50%',
    },
    {
      period: 'On or after 3 June',
      fee: '100%',
      refund: 'Non-refundable',
    },
  ],
  videoUrl: 'https://www.youtube.com/embed/9czKeIJJGjQ',
  transportationRoute: 'Dehradun to Dehradun',
};
