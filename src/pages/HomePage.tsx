import React, { useRef } from 'react';
import { Row, Col, Typography, Card, Carousel, Button, Space, Tag } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { ArrowRightOutlined, EnvironmentOutlined, TeamOutlined, SafetyOutlined, LeftOutlined, RightOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components/HomePage.less';

// Import images
import yullaPanorama1 from '../assets/cover-gen-min.png';
// Import data from utility file
import { featuredTreks, carouselImages } from '../utils/HomePageData';
// Google review screenshots
import tejasviReview  from '../assets/testimonials/tejasvi.png';
import krishiReview   from '../assets/testimonials/krishi.png';
import sonaliReview   from '../assets/testimonials/Sonali.png';
import swatiReview    from '../assets/testimonials/swati.png';
import rohitReview    from '../assets/testimonials/rohit_tyagi.png';
import ghouseReview   from '../assets/testimonials/ghouse.png';
import teamThaithReview from '../assets/testimonials/team_thaith.png';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const carouselRef = useRef<CarouselRef>(null);
  const navigate = useNavigate();
  

  const signatureActivities = [
    {
      title: '🧡 Happiness Sharing',
      description: 'A heartfelt circle where stories flow, walls fall, and strangers become a tribe.',
      icon: <TeamOutlined className={`activity-icon ${isDarkMode ? 'dark-mode' : ''}`} />
    },
    {
      title: '😌 Meditation & Journaling',
      description: 'A quiet inner journey where you pause, breathe, reflect, and reconnect with yourself amidst the serenity of nature.',
      icon: <EnvironmentOutlined className={`activity-icon ${isDarkMode ? 'dark-mode' : ''}`} />
    },
    {
      title: '🏔 Alpine Olympics',
      description: 'A playful battle of balance, strength, and laughter where the wild becomes your arena.',
      icon: <SafetyOutlined className={`activity-icon ${isDarkMode ? 'dark-mode' : ''}`} />
    },
    {
      title: '🔭 Astro Nite',
      description: 'A magical session where we observe the Moon, planets, and the night sky through a telescope.',
      icon: <EnvironmentOutlined className={`activity-icon ${isDarkMode ? 'dark-mode' : ''}`} />
    }
  ];

  const tribeReviews = [
    { src: tejasviReview,    alt: "Tejasvi Sah's review" },
    { src: rohitReview,      alt: "Rohit Tyagi's review" },
    { src: krishiReview,     alt: "Krishi Gupta's review" },
    { src: ghouseReview,     alt: "Ghouse Peer's review" },
    { src: sonaliReview,     alt: "Dr. Sonali Gupta's review" },
    { src: teamThaithReview, alt: "Team Thaith Pahadi's review" },
    { src: swatiReview,      alt: "Swati Gaur's review" },
  ];

  return (
    <div className={`homepage-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Hero Section */}
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${yullaPanorama1})` }}
      >
        {/* Overlay for text readability */}
        <div className="hero-overlay" />
        
        {/* Content with higher z-index */}
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Welcome to Oh-Bhaisahab Experiences
          </Title>
          <Paragraph className="hero-paragraph">
            Embark on unforgettable adventures in the heart of the Himalayas. 
            We specialize in creating authentic trekking and adventure experiences 
            that connect you with nature and challenge your limits.
          </Paragraph>
        </div>
      </div>

      {/* Featured Treks Section */}
      <div className="featured-treks-section">
        <Title level={2} className={`section-title ${isDarkMode ? 'dark-mode' : ''}`}>
          🏔️ Upcoming Experiences
        </Title>
        {featuredTreks.length === 1 ? (
          // Single trek layout: image left, content right
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} lg={20} xl={18}>
              <Card 
                hoverable
                className={`featured-trek-card featured-trek-card-single ${isDarkMode ? 'dark-mode' : ''}`}
                bodyStyle={{ padding: 0 }}
              >
                <Row gutter={[0, 0]}>
                  <Col xs={24} lg={12}>
                    <div className="featured-trek-image-container">
                      <img 
                        alt={featuredTreks[0].title} 
                        src={featuredTreks[0].image} 
                        className="featured-trek-image"
                      />
                      <div className="featured-trek-overlay">
                        <Tag color="#ff4d4f" className="live-tag">
                          <span className="live-dot" /> UPCOMING
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div className="featured-trek-content">
                      <Title level={3} className="featured-trek-title">
                        {featuredTreks[0].title}
                      </Title>
                      {(featuredTreks[0] as { badgeLabel?: string }).badgeLabel && (
                        <Tag color="purple" className="featured-trek-badge">
                          {(featuredTreks[0] as { badgeLabel?: string }).badgeLabel}
                        </Tag>
                      )}
                      <Paragraph className="featured-trek-subtitle">
                        {featuredTreks[0].subtitle}
                      </Paragraph>
                      
                      <Space wrap className="featured-trek-tags">
                        <Tag icon={<CalendarOutlined />} color="blue">{featuredTreks[0].date}</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="green">{featuredTreks[0].duration}</Tag>
                      </Space>
                      
                      <div className="featured-trek-location">
                        <EnvironmentOutlined /> {featuredTreks[0].location}
                      </div>
                      
                      <ul className="featured-trek-highlights">
                        {featuredTreks[0]?.highlights?.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      
                      <div className="featured-trek-footer">
                        <div className="featured-trek-price">
                          {(featuredTreks[0] as { originalPrice?: string }).originalPrice && (
                            <span className="price-original">{(featuredTreks[0] as { originalPrice?: string }).originalPrice}</span>
                          )}
                          <span className="price">{featuredTreks[0].price}</span>
                          {featuredTreks[0].priceNote && <span className="price-note">{featuredTreks[0].priceNote}</span>}
                        </div>
                        <Button 
                          type="primary" 
                          icon={<ArrowRightOutlined />}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            navigate(`/upcoming?trek=${featuredTreks[0].id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ) : (
          // Multiple treks layout: grid
          <Row gutter={[24, 24]}>
            {featuredTreks.map((trek) => (
              <Col xs={24} md={12} key={trek.id}>
                <Card 
                  hoverable
                  className={`featured-trek-card ${isDarkMode ? 'dark-mode' : ''}`}
                  cover={
                    <div className="featured-trek-image-container">
                      <img 
                        alt={trek.title} 
                        src={trek.image} 
                        className="featured-trek-image"
                      />
                      <div className="featured-trek-overlay">
                        <Tag color="#ff4d4f" className="live-tag">
                          <span className="live-dot" /> UPCOMING
                        </Tag>
                      </div>
                    </div>
                  }
                >
                  <div className="featured-trek-content">
                    <Title level={3} className="featured-trek-title">
                      {trek.title}
                    </Title>
                    {(trek as { badgeLabel?: string }).badgeLabel && (
                      <Tag color="purple" className="featured-trek-badge">
                        {(trek as { badgeLabel?: string }).badgeLabel}
                      </Tag>
                    )}
                    <Paragraph className="featured-trek-subtitle">
                      {trek.subtitle}
                    </Paragraph>
                    
                    <Space wrap className="featured-trek-tags">
                      <Tag icon={<CalendarOutlined />} color="blue">{trek.date}</Tag>
                      <Tag icon={<ClockCircleOutlined />} color="green">{trek.duration}</Tag>
                    </Space>
                    
                    <div className="featured-trek-location">
                      <EnvironmentOutlined /> {trek.location}
                    </div>
                    
                    <ul className="featured-trek-highlights">
                      {trek.highlights?.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                    
                    <div className="featured-trek-footer">
                      <div className="featured-trek-price">
                        {(trek as { originalPrice?: string }).originalPrice && (
                          <span className="price-original">{(trek as { originalPrice?: string }).originalPrice}</span>
                        )}
                        <span className="price">{trek.price}</span>
                        {trek.priceNote && <span className="price-note">{trek.priceNote}</span>}
                      </div>
                      <Button 
                        type="primary" 
                        icon={<ArrowRightOutlined />}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          navigate(`/upcoming?trek=${trek.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* About OBS Section */}
      <div className="about-section">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <Title level={2} className="about-title">About Oh-Bhaisahab Experiences</Title>
            <Paragraph className="about-paragraph">
              An Oh-Bhaisahab Experience is your passport to authentic Himalayan adventures. With a unique mix of trekking, fitness challenges, mindful practices, and cultural encounters, we create journeys that inspire both body and soul.
            </Paragraph>
            <Paragraph className="about-paragraph">
              Our aim is simple: to turn strangers into friends, mountains into teachers and every trip into a story worth telling.
            </Paragraph>
          </Col>
          <Col xs={24} lg={12}>
            <div className="youtube-short-container">
              <iframe
                src="https://www.youtube.com/embed/UCvyTOgNr8M"
                title="Oh Bhaisahab Experiences - YouTube Short"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-short-iframe"
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Signature Activities */}
      <div className={`content-section ${isDarkMode ? 'dark' : 'light'}`}>
        <Title level={2} className="section-title">
          Our Signature Activities
        </Title>
        <div className="activities-flex-container">
          {/* Video and Carousel Section - Primary Content */}
          <div className="video-carousel-primary">
            <div className="video-container">
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/DGmrc1FvoNo"
                  title="Oh Bhaisahab Experiences - Adventure Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-iframe"
                />
              </div>
            </div>
            
            {/* Carousel below video */}
            <div className="carousel-container">
              <Carousel 
                ref={carouselRef}
                autoplay 
                effect="fade"
                dots={false}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index}>
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="carousel-image"
                    />
                  </div>
                ))}
              </Carousel>
              
              {/* Navigation Buttons */}
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={() => carouselRef.current?.prev()}
                className="nav-button-left"
              />
              
              <Button
                type="text"
                icon={<RightOutlined />}
                onClick={() => carouselRef.current?.next()}
                className="nav-button-right"
              />
            </div>
          </div>
          
          {/* Activities Section - Secondary Content */}
          <div className="activities-secondary">
            <div className="activities-grid">
              {signatureActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <Card 
                    hoverable
                    className="activity-card"
                  >
                    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px' }}>{activity.title.split(' ')[0]}</div>
                      <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                        {activity.title.substring(activity.title.indexOf(' ') + 1)}
                      </Title>
                      <Paragraph style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                        {activity.description}
                      </Paragraph>
                    </Space>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose OBS */}
      <div className={`content-section ${isDarkMode ? 'dark-alt' : 'light-alt'}`}>
        <Title level={2} className="section-title">
          Why Choose Oh-Bhaisahab Experiences?
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card className="feature-card">
              <Title level={4}>🏔️ Experienced Trek Leader</Title>
              <Paragraph>
                Led by Yatharth, an experienced trekker with 7+ years of Himalayan trekking experience, 
                ensuring safe and transformative adventures with deep knowledge of terrain and culture.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="feature-card">
              <Title level={4}>🛡️ Safety First</Title>
              <Paragraph>
                We prioritize your safety with proper equipment and emergency protocols 
                for all our adventures.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="feature-card">
              <Title level={4}>🌱 Sustainable Tourism</Title>
              <Paragraph>
                We are committed to responsible tourism practices that protect the 
                environment and support local communities.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="feature-card">
              <Title level={4}>📸 Memorable Experiences</Title>
              <Paragraph>
                From sunrise treks to cultural interactions, we create moments 
                that will stay with you for a lifetime.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Tribe Reviews — right-to-left scrolling strip */}
      <div className={`content-section home-reviews-section ${isDarkMode ? 'dark' : 'light'}`}>
        <Title level={2} className="section-title">
        What Our OBS Tribe Members Say
        </Title>
        <div className="home-reviews-scroll-wrapper">
          <div className="home-reviews-scroll-track">
            {[...tribeReviews, ...tribeReviews].map((review, i) => (
              <img
                key={i}
                src={review.src}
                alt={review.alt}
                className="home-review-img"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
