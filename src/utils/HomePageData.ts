// Import images
import kuariRanges from '../assets/treks/kuari/kuari-ranges.png';
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupMountain from '../assets/treks/spiti/group-mountain.png';
import groupBackpack from '../assets/treks/yulla/group-backpack.png';
import kuariJuneImg from '../assets/treks/kuari/kuari-ranges.png';

export const featuredTreks = [
  {
    id: 'kuari-june',
    title: 'Kuari Pass Trek',
    subtitle: 'Summer Himalayan Adventure',
    date: 'June 5-10, 2026',
    duration: '6 Days / 5 Nights',
    location: 'Garhwal Himalayas, Uttarakhand',
    price: '₹12,999',
    priceNote: 'with transport, incl. GST',
    image: kuariJuneImg,
    highlights: [
      '360° Himalayan panorama at 12,500 ft',
      'Views of Nanda Devi, Trishul & Chaukhamba',
      'Alpine meadows on the legendary Curzon Trail',
    ],
    color: '#0891b2',
  },
];

export const carouselImages = [
  {
    src: kuariRanges,
    alt: 'Kuari Pass Trek',
  },
  {
    src: groupSummit,
    alt: 'Yulla Kanda Trek',
  },
  {
    src: groupMountain,
    alt: 'Spiti Valley',
  },
  {
    src: groupBackpack,
    alt: 'Yulla Kanda Trek Group with Backpack',
  },
];
