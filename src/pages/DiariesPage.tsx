import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Row, Col, Typography, Card, Rate, Avatar, Tag, Space } from 'antd';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

import '../styles/components/HeroSection.less';
import '../styles/components/DiariesPage.less';
import sceneryOtw from '../assets/treks/yulla/scenery-otw.jpg';
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupSummitSpiti from '../assets/treks/spiti/group-mountain.png';
import dayaraGroup from '../assets/treks/dayara/dayara_group.jpg';
import groupPreviousKuari from '../assets/treks/kuari/group-previous.png';
import tejasviTestimonial from '../assets/testimonials/tejasvi.jpg';
import pranathiTestimonial from '../assets/testimonials/pranathi.jpg';
import rohitTyagi from '../assets/testimonials/rohit_tyagi.png';
import ghouse from '../assets/testimonials/ghouse.png';
import teamThaith from '../assets/testimonials/team_thaith.png';

const { Title, Paragraph } = Typography;

// Static — defined outside to avoid re-creation on every render
const TESTIMONIALS = [
  { src: tejasviTestimonial,  alt: "Tejasvi's testimonial" },
  { src: pranathiTestimonial, alt: "Pranathi's testimonial" },
  { src: rohitTyagi,          alt: "Rohit Tyagi's testimonial" },
  { src: ghouse,              alt: "Ghouse's testimonial" },
  { src: teamThaith,          alt: "Team Thaith's testimonial" },
];

const DiariesPage: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const CARD_WIDTH = 384; // 360px card + 24px gap
  const SPEED = 0.5;

  useEffect(() => {
    const totalWidth = reviews.length * CARD_WIDTH;
    const animate = () => {
      if (!isPausedRef.current) {
        offsetRef.current -= SPEED;
        if (offsetRef.current <= -totalWidth) {
          offsetRef.current = 0;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const scrollByCard = (direction: 'left' | 'right') => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    isPausedRef.current = true;

    const totalWidth = reviews.length * CARD_WIDTH;
    offsetRef.current += direction === 'left' ? CARD_WIDTH : -CARD_WIDTH;
    if (offsetRef.current > 0) offsetRef.current -= totalWidth;
    if (offsetRef.current <= -totalWidth) offsetRef.current = 0;

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s ease';
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    }

    setTimeout(() => {
      if (trackRef.current) trackRef.current.style.transition = '';
      isTransitioningRef.current = false;
      isPausedRef.current = false;
    }, 400);
  };

  // Stories That Speak Volumes — book page-flip carousel
  const storyIndexRef = useRef(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [flipClass, setFlipClass]   = useState('');
  const storyFlipping = useRef(false);
  const storyPaused   = useRef(false);
  const touchStartX   = useRef(0);

  const doFlip = useCallback((newIndex: number, dir: 'next' | 'prev') => {
    if (storyFlipping.current) return;
    storyFlipping.current = true;
    setFlipClass(`page-fold-out-${dir}`);
    setTimeout(() => {
      storyIndexRef.current = newIndex;
      setStoryIndex(newIndex);
      setFlipClass(`page-fold-in-${dir}`);
      setTimeout(() => {
        setFlipClass('');
        storyFlipping.current = false;
      }, 300);
    }, 300);
  }, []);

  const navigateStory = useCallback((dir: 'next' | 'prev') => {
    const newIndex = dir === 'next'
      ? (storyIndexRef.current + 1) % TESTIMONIALS.length
      : (storyIndexRef.current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    doFlip(newIndex, dir);
  }, [doFlip]);

  const goToStory = useCallback((index: number) => {
    if (index === storyIndexRef.current) return;
    doFlip(index, index > storyIndexRef.current ? 'next' : 'prev');
  }, [doFlip]);

  // Auto-advance every 4 s; pauses on hover
  useEffect(() => {
    const timer = setInterval(() => {
      if (!storyPaused.current) navigateStory('next');
    }, 4000);
    return () => clearInterval(timer);
  }, [navigateStory]);

  const experiences = [
    {
      id: 1,
      title: 'Dayara Bugyal - Alpine Meadows Adventure',
      date: 'June 2025',
      location: 'Uttarkashi, Uttarakhand',
      image: dayaraGroup,
      description: 'Explored the stunning alpine meadows of Dayara Bugyal, one of India\'s most breathtaking high-altitude grasslands at 12,000 feet. Witnessed panoramic views of the Garhwal Himalayas.',
      participants: 15,
      duration: '5 days',
      difficulty: 'Easy'
    },
    {
      id: 2,
      title: `Yulla Kanda - Trek to World's Highest Krishna Temple`,
      date: 'August 2025',
      location: 'Himachal Pradesh',
      image: groupSummit,
      description: 'Witnessed the mesmerizing views of the world\'s highest Shri Krishna temple, located at an altitude of about 3,895 meters',
      participants: 6,
      duration: '5 days',
      difficulty: 'Easy to Moderate'
    },
    {
      id: 3,
      title: 'Spiti Valley - Desert Mountain Adventure',
      date: 'September 2025',
      location: 'Himachal Pradesh',
      image: groupSummitSpiti,
      description: 'Explored the high-altitude desert landscape, ancient monasteries, and crystal-clear lakes of the vast Spiti Valley.',
      participants: 7,
      duration: '8 days',
      difficulty: 'Easy to Moderate'
    },
    {
      id: 4,
      title: 'Kuari Pass - Winter Wonderland Trek',
      date: 'December 2025',
      location: 'Garhwal Himalayas, Uttarakhand',
      image: groupPreviousKuari,
      description: 'Experienced the magic of winter in the Garhwal Himalayas with breathtaking views of snow-capped peaks including Nanda Devi, Trishul, and Dronagiri. An unforgettable journey through pristine snow-covered trails.',
      participants: 20,
      duration: '5 days',
      difficulty: 'Moderate'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Satyam Bajpai',
      location: 'Gwalior',
      rating: 5,
      experience: 'Yulla Kanda Trek',
      review: 'The Yulla Kanda trek was phenomenal! Reaching the world\'s highest Krishna temple was life-changing. OBS made it more than just a trek - it was a journey of self-discovery.',
      date: 'August 2025'
    },
    {
      id: 2,
      name: 'Sahil Kattna',
      location: 'Hamirpur',
      rating: 5,
      experience: 'Yulla Kanda Trek',
      review: 'OBS redefined adventure travel for me! Perfectly organized with safety as priority. The spiritual aspect and group bonding activities were exceptional.',
      date: 'August 2025'
    },
    {
      id: 3,
      name: 'Pranathi Punjaala',
      location: 'Hyderabad',
      rating: 5,
      experience: 'Yulla Kanda Trek',
      review: 'This OBS experience introduced me to a different version of myself and expanded my comfort zone. It helped me realize my capabilities and the importance of finding like-minded people. Most importantly, it taught me self-compassion - something I\'ve always struggled with. Thank you @yatharthgairola for this transformative experience!',
      date: 'August 2025'
    },
    {
      id: 4,
      name: 'Dr. Sonali Gupta',
      location: 'Delhi',
      rating: 5,
      experience: 'Spiti Valley Adventure',
      review: 'Every step on those trails gave me joy, strength, and beautiful memories. Strangers turned into friends, creating moments I\'ll always cherish. Yatharth is such a pure soul, full of energy and innocence that instantly touches your heart. Thank you for spreading happiness wherever you go - my heart is full!',
      date: 'September 2025'
    },
    {
      id: 5,
      name: 'Bhavya Goyal',
      location: 'Ludhiana',
      rating: 5,
      experience: 'Spiti Valley Adventure',
      review: 'OBS transformed my understanding of adventure travel! Perfectly balanced between adventure and cultural exploration. Creates memories that last a lifetime!',
      date: 'September 2025'
    },
    {
      id: 6,
      name: 'Rajesh Kumar',
      location: 'Mumbai',
      rating: 5,
      experience: 'Dayara Bugyal Trek',
      review: 'The Dayara Bugyal trek was absolutely magical! Rolling alpine meadows and breathtaking views of the Garhwal Himalayas. Yatharth\'s guidance made it safe and unforgettable.',
      date: 'June 2025'
    },
    {
      id: 7,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      experience: 'Dayara Bugyal Trek',
      review: 'Amazing alpine meadow adventure! The signature OBS experiences like Happiness Sharing and Alpine Olympics made this trek truly special. Highly recommended!',
      date: 'June 2025'
    },
    {
      id: 8,
      name: 'Ankit Verma',
      location: 'Delhi',
      rating: 5,
      experience: 'Kuari Pass Trek',
      review: 'The Kuari Pass winter trek was absolutely magical! Walking through snow-covered trails with stunning views of Nanda Devi was a dream come true. Yatharth and the team ensured our safety and comfort throughout. Highly recommend OBS for an authentic Himalayan experience!',
      date: 'December 2025'
    },
    {
      id: 9,
      name: 'Neha Kapoor',
      location: 'Pune',
      rating: 5,
      experience: 'Kuari Pass Trek',
      review: 'Best winter trek experience! The snow-covered landscapes, the warmth of the group, and OBS signature activities made this trip unforgettable. From sunrise views at Kuari Pass to the cozy evenings - everything was perfect!',
      date: 'December 2025'
    }
  ];

  return (
    <div className="diaries-page">
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${sceneryOtw})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Previous OBS Diaries
          </Title>
          <Paragraph className="hero-paragraph">
            Relive the memories of our past Oh-Bhaisahab experiences and read testimonials from fellow adventurers
          </Paragraph>
        </div>
      </div>


      {/* Past Experiences */}
      <div className="experiences-section" style={{ 
        padding: '80px 24px', 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          Our Recent Adventures
        </Title>
        <Row gutter={[24, 24]}>
          {experiences.map((experience) => (
            <Col xs={24} sm={12} lg={8} key={experience.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={experience.title}
                    src={experience.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                style={{ 
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                bodyStyle={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px'
                }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%', flex: 1 }}>
                  <Title level={4} style={{ margin: 0 }}>{experience.title}</Title>
                  <Space>
                    <CalendarOutlined />
                    <span>{experience.date}</span>
                  </Space>
                  <Space>
                    <EnvironmentOutlined />
                    <span>{experience.location}</span>
                  </Space>
                  <Paragraph style={{ flex: 1 }}>{experience.description}</Paragraph>
                </Space>
                <div className="experience-tags" style={{ 
                  marginTop: 'auto', 
                  paddingTop: '12px',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  gap: '8px',
                  justifyContent: 'space-between'
                }}>
                  <Tag color="blue">{experience.duration}</Tag>
                  <Tag color="green">{experience.difficulty}</Tag>
                  <Tag color="orange">{experience.participants} participants</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" style={{ 
        padding: '80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          What Our Adventurers Say
        </Title>
        <div className="reviews-scroll-outer">
          <button
            className="reviews-arrow reviews-arrow-left"
            onClick={() => scrollByCard('left')}
            aria-label="Previous reviews"
          >
            <LeftOutlined />
          </button>

          <div
            className="reviews-scroll-wrapper"
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { if (!isTransitioningRef.current) isPausedRef.current = false; }}
          >
            <div className="reviews-scroll-track" ref={trackRef}>
              {[...reviews, ...reviews].map((review, index) => (
                <Card
                  key={`review-${index}`}
                  className="reviews-scroll-card"
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar size={48} icon={<UserOutlined />} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>{review.name}</Title>
                        <Paragraph className="review-meta">
                          {review.location} • {review.date}
                        </Paragraph>
                      </div>
                    </div>
                    <div>
                      <Rate disabled defaultValue={review.rating} style={{ fontSize: '14px' }} />
                      <Tag color="blue" style={{ marginLeft: '8px' }}>
                        {review.experience}
                      </Tag>
                    </div>
                    <Paragraph style={{ margin: 0, fontStyle: 'italic' }}>
                      "{review.review}"
                    </Paragraph>
                  </Space>
                </Card>
              ))}
            </div>
          </div>

          <button
            className="reviews-arrow reviews-arrow-right"
            onClick={() => scrollByCard('right')}
            aria-label="Next reviews"
          >
            <RightOutlined />
          </button>
        </div>
        
        {/* Featured Testimonials - Social Media Posts */}
        <div style={{ marginTop: '60px' }}>
          <Title level={3} className="stories-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
            Stories That Speak Volumes
          </Title>

          <div className="stories-viewport"
            onMouseEnter={() => { storyPaused.current = true; }}
            onMouseLeave={() => { storyPaused.current = false; }}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 50) navigateStory(delta > 0 ? 'next' : 'prev');
            }}
          >
            <div className={`stories-page-inner ${flipClass}`}>
              <img
                src={TESTIMONIALS[storyIndex].src}
                alt={TESTIMONIALS[storyIndex].alt}
                className="stories-img"
              />
            </div>
          </div>

          <div className="stories-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`stories-dot${i === storyIndex ? ' active' : ''}`}
                onClick={() => goToStory(i)}
                aria-label={`Go to story ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiariesPage;
