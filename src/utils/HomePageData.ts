// Import images
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupMountain from '../assets/treks/spiti/group-mountain.png';
import groupBackpack from '../assets/treks/yulla/group-backpack.png';
import kuariJuneImg from '../assets/treks/kuari/kuari-ranges.png';
import YullaJulyImg from '../assets/treks/yulla/grassland-mountain.jpg'
import trekGroup from '../assets/trek_group.png';
import bhramtalGroup from '../assets/treks/bhramtal/bhrama_group.png';
import nagTibbaGroup1 from '../assets/treks/nagtibba/nag_group.png'
import nagTibbaGroup2 from '../assets/treks/nagtibba/nag_group_2.png'


export const featuredTreks = [
  {
    id: 'Yulla-July',
    title: 'Yulla Kanda Trek',
    subtitle: 'Trekking Club x OBS Experience',
    date: 'July 1-4, 2026',
    duration: '4 Days / 3 Nights',
    location: 'Yulla Khas , Himachal Pradesh',
    price: '₹11,111',
    priceNote: 'with transport, incl. GST',
    image: YullaJulyImg,
    highlights: [
 'Stunning Himalayan landscapes, alpine meadows, and sacred high-altitude lake',
    'Peaceful alpine meadows filled with wild mountain flora',
    'Panoramic views of the snow-covered Himalayas',],
    color: '#0891b2',
  },
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
  {
    id: 'ValleyofFlowers-July',
    title: 'Valley of Flowers Trek',
    subtitle: 'Summer Himalayan Adventure',
    date: 'July 14-19, 2026',
    duration: '6 Days / 5 Nights',
    location: 'Garhwal Hills, Uttarakhand',
    price: '₹13,750',
    priceNote: 'with transport, incl. GST',
    highlights: [
          'Trek through the Valley of Flowers, a UNESCO World Heritage Site',
    'Visit Hemkund Sahib, the world\'s highest Gurudwara at 14,100 ft',
    'Visit the sacred Badrinath Temple, one of the holiest pilgrimage sites',
    ],
    color: '#0891b2',
  }
];

export const carouselImages = [
  {
    src: groupMountain,
    alt: 'Spiti Valley',
  },
  {
    src: groupSummit,
    alt: 'Yulla Kanda Trek',
  },
  {
    src: trekGroup,
    alt: 'Trek Group',
  },
  {
    src: bhramtalGroup,
    alt: 'Brahmatal Group',
  },
  {
    src: groupBackpack,
    alt: 'Yulla Kanda Trek Group with Backpack',
  },
  {
    src: nagTibbaGroup1,
    alt: 'Nagtibba Group 1',
  },
  {
    src: nagTibbaGroup2,
    alt: 'Nagtibba Group 2',
  },
];
