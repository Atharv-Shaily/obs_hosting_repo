// Import images
import kuariRanges from '../assets/treks/kuari/kuari-ranges.png';
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupMountain from '../assets/treks/spiti/group-mountain.png';
import groupBackpack from '../assets/treks/yulla/group-backpack.png';
import sandakphuImg from '../assets/treks/sandakhpu/sandakhpu.jpg';
import brahmatalImg from '../assets/treks/bhramtal/bhramtal.jpg';

// Featured treks data
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
    color: '#0891b2'
  },
  {
    id: 'sandakphu',
    title: 'Sandakphu-Phalut Trek',
    subtitle: 'See 4 of World\'s Tallest Peaks!',
    date: 'February 14-20, 2026',
    duration: '7 Days',
    location: 'West Bengal-Nepal Border',
    price: '₹13,545',
    priceNote: 'incl. GST',
    image: sandakphuImg,
    highlights: ['Everest, Lhotse, Makalu, Kanchenjunga views', 'Walk along India-Nepal border', 'Sleeping Buddha formation'],
    color: '#1e3a8a'
  } 
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
