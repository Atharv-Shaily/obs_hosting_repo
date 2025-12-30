import React from 'react';
import { Row, Col, Typography, Card, Rate, Avatar, Tag, Space } from 'antd';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';

import { useDarkMode } from '../contexts/DarkModeContext';
import '../styles/components/HeroSection.less';
import '../styles/components/DiariesPage.less';
import sceneryOtw from '../assets/treks/yulla/scenery-otw.jpg';
import groupSummit from '../assets/treks/yulla/group-summit.png';
import groupSummitSpiti from '../assets/treks/spiti/group-mountain.png';
import dayaraGroup from '../assets/treks/dayara/dayara_group.jpg';
import groupPreviousKuari from '../assets/treks/kuari/group-previous.png';
import tejasviTestimonial from '../assets/testimonials/tejasvi.jpg';
import pranathiTestimonial from '../assets/testimonials/pranathi.jpg';

const { Title, Paragraph } = Typography;

const DiariesPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();

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
    <div style={{ 
      background: isDarkMode ? '#0f0f0f' : '#f5f5f5', 
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
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
        background: isDarkMode ? '#1a1a1a' : 'white', 
        padding: '80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        transition: 'background-color 0.3s ease'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          What Our Adventurers Say
        </Title>
        <Row gutter={[24, 24]}>
          {reviews.map((review) => (
            <Col xs={24} md={12} lg={8} key={review.id}>
              <Card 
                style={{ 
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar size={48} icon={<UserOutlined />} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{review.name}</Title>
                      <Paragraph style={{ margin: 0, color: '#666' }}>
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
            </Col>
          ))}
        </Row>
        
        {/* Featured Testimonials - Social Media Posts */}
        <div style={{ marginTop: '60px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '40px', color: isDarkMode ? '#fff' : '#000' }}>
            Stories That Speak Volumes
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12} lg={10}>
              <Card
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: 'none',
                  background: isDarkMode ? '#2a2a2a' : '#fff'
                }}
                bodyStyle={{ padding: 0 }}
              >
                <img
                  src={tejasviTestimonial}
                  alt="Tejasvi's testimonial from @sahtejasvi"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px'
                  }}
                />
              </Card>
            </Col>
            
            <Col xs={24} md={12} lg={10}>
              <Card
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: 'none',
                  background: isDarkMode ? '#2a2a2a' : '#fff'
                }}
                bodyStyle={{ padding: 0 }}
              >
                <img
                  src={pranathiTestimonial}
                  alt="Pranathi's testimonial from @pranathi_punjaala"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px'
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DiariesPage;
