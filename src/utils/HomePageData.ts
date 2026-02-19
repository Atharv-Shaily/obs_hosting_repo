// Import images
import kuariRanges from '../assets/treks/kuari/kuari-ranges.png';
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupMountain from '../assets/treks/spiti/group-mountain.png';
import groupBackpack from '../assets/treks/yulla/group-backpack.png';
import brahmatalImg from '../assets/treks/bhramtal/bhramtal.jpg';
// Placeholder images for Nagtibba and Kerala – replace when assets are ready
import nagtibbaImg from '../assets/treks/nagtibba/nag-tibba.png';
import keralaImg from '../assets/treks/kerala/kerala-trip.png';

// Featured treks data (order: 1. Brahmatal, 2. Nagtibba, 3. Kerala)
export const featuredTreks = [
  {
    id: 'brahmatal',
    title: 'Brahmatal Trek',
    subtitle: 'Frozen Lake Adventure!',
    date: 'March 26-31, 2026',
    duration: '6 Days / 5 Nights',
    location: 'Garhwal Himalayas, Uttarakhand',
    price: '₹13,300',
    priceNote: 'with transport, incl. GST',
    image: brahmatalImg,
    highlights: ['Frozen Brahmatal Lake', '180° Himalayan views', 'Snow-covered forests'],
    color: '#0891b2',
  },
  {
    id: 'nagtibba',
    title: 'Nagtibba Trek',
    subtitle: 'All Girls Trip',
    date: 'April 3-5, 2026',
    duration: '3 Days / 2 Nights',
    location: 'Garhwal Himalayas, Uttarakhand',
    price: '₹5,500',
    priceNote: 'with transport, incl. GST',
    image: nagtibbaImg,
    highlights: ['All girls trip', 'Dehradun to Dehradun', 'Pilani to Pilani package – call 7983414419'],
    color: '#7c3aed'
  },
  {
    id: 'kerala',
    title: 'Kerala Trip',
    subtitle: 'Early Bird Discount',
    date: 'April 17-21, 2026',
    duration: '5 Days / 4 Nights',
    location: 'Kerala',
    originalPrice: '₹30,000',
    price: '₹27,000',
    priceNote: 'Early bird',
    image: keralaImg,
    highlights: ['Early bird ₹27,000', 'Only 2 seats left at discount', '₹6,750 now, rest later'],
    color: '#059669',
  },
];

export const carouselImages = [
  {
    src: kuariRanges,
    alt: 'Kuari Pass Trek'
  },
  {
    src: groupSummit,
    alt: 'Yulla Kanda Trek'
  },
  {
    src: groupMountain,
    alt: 'Spiti Valley'
  },
  {
    src: groupBackpack,
    alt: 'Yulla Kanda Trek Group with Backpack'
  }
];
