import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Button, Space, Tag, Alert, Carousel, Tabs, Modal } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined, WalletOutlined, DownloadOutlined, CreditCardOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import BookingModal from '../components/BookingModal';
import { kuariJuneData } from '../assets/treks/KuariJune/KuariJuneData';
import { YullaJulyData } from '../assets/treks/yullaKandaJuly/yullaKandaData';
import { valleyOfFlowersJulyData } from '../assets/treks/ValleyofFlowersJuly/ValleyofFlowersJulyData';
import type { TrekData } from '../assets/treks/TrekData';
import '../styles/components/HeroSection.less';
import { getActiveOffer } from '../utils/specialOffer';
import '../styles/components/UpcomingPage.less';
import '../styles/components/CarouselCustom.less';
import '../styles/components/TrekTabs.less';
import grasslandMountain from '../assets/treks/yulla/grassland-mountain.jpg';
import kuariJuneHero from '../assets/treks/KuariJune/KuariJuneHero.png';
import YullaJulyHero from '../assets/treks/yulla/group-casual.png';
import upiImage from '../assets/upi.jpg';

const { Title, Paragraph, Text } = Typography;

const allTreks: TrekData[] = [
  YullaJulyData,
  kuariJuneData,
  valleyOfFlowersJulyData
];

const UpcomingPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentMessageRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<CarouselRef>(null);
  const trekContentRef = useRef<HTMLDivElement>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);

  // Initialize selected trek from URL parameter or default to first trek
  const getInitialTrek = (): TrekData => {
    const trekId = searchParams.get('trek');
    if (trekId) {
      const trek = allTreks.find(t => t.id === trekId);
      if (trek) return trek;
    }
    return allTreks[0];
  };
  
  const [selectedTrek, setSelectedTrek] = useState<TrekData>(getInitialTrek());

  const activeOffer = getActiveOffer(selectedTrek);

  // Treks that use UPI payment (no PayU link) — extend as needed for future treks
  const useUpiPayment = !selectedTrek.registrationLink;

  // Update selected trek when URL parameter changes
  useEffect(() => {
    const trekId = searchParams.get('trek');
    if (trekId) {
      const trek = allTreks.find(t => t.id === trekId);
      if (trek) {
        setSelectedTrek(prevTrek => {
          if (prevTrek.id !== trek.id) {
            carouselRef.current?.goTo(0);
            return trek;
          }
          return prevTrek;
        });
      }
    }
  }, [searchParams]);
  useEffect(() => {
    const isInstagram = selectedTrek.videoUrl?.includes('instagram.com');
    if (!isInstagram) return;
    const existing = document.getElementById('instagram-embed-script');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, [selectedTrek.videoUrl]);
  // WhatsApp Icon Component
  const WhatsAppIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ marginRight: '8px' }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
    </svg>
  );

  const handleBookNow = () => {
    if (useUpiPayment) {
      setUpiModalOpen(true);
      return;
    }
    if (selectedTrek.registrationLink) {
      window.open(selectedTrek.registrationLink, '_blank');
    } else {
      paymentMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleDownloadBrochure = () => {
    if (!selectedTrek.brochure) return;
    const link = document.createElement('a');
    link.href = selectedTrek.brochure;
    link.download = `${selectedTrek.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTrekChange = (key: string) => {
    const trek = allTreks.find(t => t.id === key);
    if (trek) {
      setSelectedTrek(trek);
      // Update URL parameter to reflect selected trek
      setSearchParams({ trek: key });
      // Reset carousel when changing treks
      carouselRef.current?.goTo(0);
      
      // Scroll to trek content only if user is below it
      // This prevents jarring scroll behavior when tabs are already in view
      if (trekContentRef.current) {
        const rect = trekContentRef.current.getBoundingClientRect();
        if (rect.top < 0) {
          // User has scrolled past the content, scroll back to it
          trekContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Otherwise, do nothing - user can already see the tabs
      }
    }
  };

  const getHeroImage = () => {
    if (selectedTrek.id === 'kuari-june') return kuariJuneHero;
    if (selectedTrek.id === 'Yulla-July') return YullaJulyHero;
    return grasslandMountain;
  };

  // Create tabs items for Ant Design Tabs
  const tabItems = allTreks.map(trek => ({
    key: trek.id,
    label: (
      <span style={{ 
        fontSize: '14px', 
        fontWeight: selectedTrek.id === trek.id ? 600 : 400 
      }}>
        {trek.title.split(' - ')[0]}
      </span>
    ),
  }));

  return (
    <div className={`upcoming-page-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div 
        className="hero-section" 
        style={{ 
          '--desktop-bg': `url(${grasslandMountain})`,
          '--mobile-bg': `url(${getHeroImage()})`
        } as React.CSSProperties}
      >
        <div className="hero-overlay hide-on-mobile" />
        <div className="hero-content hide-on-mobile">
          <Title level={1} className="hero-title">
            Upcoming OBS Experiences
          </Title>
          <Paragraph className="hero-paragraph">
            Join us for our next adventure in the magnificent Himalayas
          </Paragraph>
        </div>
      </div>

      <div ref={trekContentRef} className="trek-content-container">
        {/* Trek Navigation Tabs */}
        {allTreks.length > 1 && (
          <Card 
            className={`trek-tabs-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            bodyStyle={{ padding: '0' }}
          >
            <Tabs
              activeKey={selectedTrek.id}
              onChange={handleTrekChange}
              centered
              size="large"
              items={tabItems}
              style={{ 
                padding: '0 16px',
              }}
              tabBarStyle={{
                marginBottom: 0,
                borderBottom: `1px solid ${isDarkMode ? '#404040' : '#f0f0f0'}`
              }}
            />
          </Card>
        )}

        {/* Main Experience Card */}
          <Card 
            className="trek-main-card"
            style={{ 
              marginBottom: '40px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
          <Row gutter={[32, 32]} align="top">
            <Col xs={24} lg={12}>
              <div className="trek-carousel" style={{ paddingTop: '8px', position: 'relative' }}>
                <Carousel 
                  ref={carouselRef}
                  autoplay
                  autoplaySpeed={4000}
                  dots={true}
                  dotPosition="bottom"
                  effect="fade"
                  style={{ borderRadius: '8px', overflow: 'hidden' }}
                >
                  {selectedTrek.images.map((image, index) => (
                    <div key={index}>
                      <img 
                        src={image} 
                        alt={`${selectedTrek.title} - Image ${index + 1}`}
                        className="carousel-image"
                      />
                    </div>
                  ))}
                </Carousel>
                {/* Custom Navigation Arrows */}
                <Button
                  type="primary"
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={() => carouselRef.current?.prev()}
                  className="carousel-nav-button"
                  style={{ left: '10px' }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={() => carouselRef.current?.next()}
                  className="carousel-nav-button"
                  style={{ right: '10px' }}
                />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={2} style={{ marginBottom: '8px' }}>
                    {selectedTrek.title}
                  </Title>
                  <Space wrap style={{ marginBottom: selectedTrek.allGirlsTrip ? 12 : 0 }}>
                    <Tag color="blue" icon={<CalendarOutlined />}>
                      {selectedTrek.date}
                    </Tag>
                    <Tag color="green" icon={<ClockCircleOutlined />}>
                      {selectedTrek.duration}
                    </Tag>
                    {selectedTrek.allGirlsTrip && (
                      <Tag color="pink" style={{ fontWeight: 600 }}>
                        All Girls Trip
                      </Tag>
                    )}
                  </Space>
                  {selectedTrek.allGirlsTrip && (
                    <Alert
                      message="All Girls Trip"
                      description="Girls only getaway — good vibes guaranteed! ⛰️"
                      type="info"
                      style={{
                        marginTop: 8,
                        borderRadius: 8,
                        border: '1px solid #f4a7c5',
                        background: isDarkMode ? '#2a1620' : '#fff7fa', 
                      }}
                    />
                  )}
                </div>

                <div>
                  <Space>
                    <EnvironmentOutlined style={{ color: '#d4a574' }} />
                    <Text strong>{selectedTrek.location}</Text>
                  </Space>
                </div>

                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {selectedTrek.description}
                </Paragraph>

{(selectedTrek.pricing.totalCostWithTransport > 0 || selectedTrek.pricing.totalCostWithoutTransport > 0) && (() => {
  const samePrice = selectedTrek.pricing.totalCostWithTransport > 0 &&
    selectedTrek.pricing.totalCostWithoutTransport > 0 &&
    selectedTrek.pricing.totalCostWithTransport === selectedTrek.pricing.totalCostWithoutTransport;
  const showTwoPrices = !samePrice &&
    selectedTrek.pricing.totalCostWithTransport > 0 &&
    selectedTrek.pricing.totalCostWithoutTransport > 0;
  return (
                  <div className={`pricing-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                    <div className="pricing-header">
                      <WalletOutlined className="wallet-icon" />
                      <Text strong className="pricing-title">
                       {showTwoPrices ? 'Pricing Options:' : 'Pricing:'}
                      </Text>
                    </div>
                    <Row gutter={[16, 16]} className="pricing-cards">
                      {selectedTrek.pricing.totalCostWithTransport > 0 && (
                       <Col xs={24} sm={showTwoPrices ? 12 : 24}>
                          <div className={`pricing-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                            {(selectedTrek.pricing.originalPrice != null || activeOffer != null) && (
                              <>
                                <Text delete style={{ fontSize: '24px', color: isDarkMode ? '#737373' : '#666', marginRight: 8 }}>
                                  ₹{(activeOffer?.originalPrice ?? selectedTrek.pricing.originalPrice)!.toLocaleString('en-IN')}
                                </Text>
                                <Text strong className="price-amount with-transport" style={{ color: '#059669' }}>
                                  ₹{(activeOffer?.offerPrice ?? selectedTrek.pricing.totalCostWithTransport).toLocaleString('en-IN')}
                                </Text>
                                <br />
                                <Text className={`price-description ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ color: '#059669' }}>
                                  {activeOffer ? activeOffer.label : 'Early bird discount'}
                                </Text>
                              </>
                            )}
                            {selectedTrek.pricing.originalPrice == null && activeOffer == null && (
                              <>
                                <Text strong className="price-amount with-transport"style={{fontSize: '22px'}}>₹{selectedTrek.pricing.totalCostWithTransport.toLocaleString('en-IN')}</Text>
                                <br />
                                {showTwoPrices && (<Text className={`price-description ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>With Transport</Text>)}
                              </>
                            )}
                          </div>
                        </Col>
                      )}
                      {showTwoPrices && selectedTrek.pricing.totalCostWithoutTransport > 0 && (
  <Col xs={24} sm={12}>
                                              <div className={`pricing-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                            {selectedTrek.pricing.originalPrice != null && !selectedTrek.pricing.totalCostWithTransport && (
                              <>
                                <Text delete style={{ fontSize: '14px', color: isDarkMode ? '#737373' : '#666', marginRight: 8 }}>
                                  ₹{selectedTrek.pricing.originalPrice.toLocaleString('en-IN')}
                                </Text>
                                <Text strong className="price-amount without-transport" style={{ color: '#059669' }}>
                                  ₹{selectedTrek.pricing.totalCostWithoutTransport.toLocaleString('en-IN')}
                                </Text>
                                <br />
                                <Text className={`price-description ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ color: '#059669' }}>
                                  Early bird discount
                                </Text>
                              </>
                            )}
                            {(!selectedTrek.pricing.originalPrice || selectedTrek.pricing.totalCostWithTransport > 0) && (
                              <>
                                <Text strong className="price-amount without-transport">₹{selectedTrek.pricing.totalCostWithoutTransport.toLocaleString('en-IN')}</Text>
                                <br />
                                <Text className={`price-description ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                                  {selectedTrek.pricing.totalCostWithTransport > 0 ? 'Without Transport' : 'Trek Package'}
                                </Text>
                              </>
                            )}
                          </div>
                        </Col>
                      )}
                    </Row>
                    {selectedTrek.pricing.earlyBirdSeatsLeft != null && selectedTrek.pricing.earlyBirdSeatsLeft > 0 && (
                      <Alert
                        message={`Only ${selectedTrek.pricing.earlyBirdSeatsLeft} seat${selectedTrek.pricing.earlyBirdSeatsLeft === 1 ? '' : 's'} left for this discount`}
                        type="warning"
                        showIcon
                        style={{ marginTop: 12, borderRadius: 8 }}
                      />
                    )}
                  </div>
  );})()}

                {/* Transportation Note for treks without transport */}
                {selectedTrek.pricing.totalCostWithTransport === 0 && selectedTrek.pricing.totalCostWithoutTransport > 0 && (
                  <Alert
                    message="Transportation Information"
                    description={
                      <Text style={{ fontSize: '14px' }}>
                        {selectedTrek.transportationRoute}
                      </Text>
                    }
                    type="info"
                    showIcon
                    style={{ 
                      borderRadius: '8px',
                      border: '1px solid #91d5ff',
                      background: isDarkMode ? '#111d2c' : '#e6f7ff'
                    }}
                  />
                )}

                {/* Special package note (e.g. Pilani to Pilani) */}
                {selectedTrek.specialPackageNote && (
                  <Alert
                    message={`Special "${selectedTrek.specialPackageNote}" package`}
                    description={
                      <Text style={{ fontSize: '14px' }}>
                        Call {selectedTrek.specialPackagePhone ? `at ${selectedTrek.specialPackagePhone}` : ''} for more information.
                      </Text>
                    }
                    type="info"
                    showIcon
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #d4a574',
                      background: isDarkMode ? '#2d1f0a' : '#fff7e6',
                    }}
                  />
                )}

                {/* Payment Plan Highlight */}
                <Alert
                  message="🎉 Special Payment Plan Available!"
                  description={
                    <div>
                      <Text strong style={{ fontSize: '16px', color: '#d4a574' }}>
                        Pay just ₹{selectedTrek.pricing.registrationFee.toLocaleString('en-IN')} now and rest before {selectedTrek.pricing.paymentDeadline} !!
                      </Text>
                      <br />
                      <Text style={{ fontSize: '14px', color: isDarkMode ? '#a3a3a3' : '#666' }}>
                        Secure your spot with a small registration fee and pay the remaining amount later.
                      </Text>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{ 
                    borderRadius: '8px',
                    border: '2px solid #d4a574',
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #1a2f1a 0%, #2d1f0a 100%)'
                      : 'linear-gradient(135deg, #f6ffed 0%, #fff7e6 100%)',
                    color: isDarkMode ? '#e5e5e5' : 'inherit'
                  }}
                />

                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={selectedTrek.brochure ? 12 : 24}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      onClick={handleBookNow}
                      style={{ 
                        height: '50px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      Book Now
                    </Button>
                  </Col>
                  {selectedTrek.brochure && (
                    <Col xs={24} sm={12}>
                      <Button 
                        type="default" 
                        size="large" 
                        block
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadBrochure}
                        style={{ 
                          height: '50px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          borderColor: '#d4a574',
                          color: '#d4a574'
                        }}
                      >
                        Download Brochure
                      </Button>
                    </Col>
                  )}
                </Row>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Highlights */}
        <Card title="OBS Experience Highlights" style={{ marginBottom: '40px', borderRadius: '12px' }}>
          <Row gutter={[32, 32]}>
             {/* Video Section - Only show if videoUrl exists */}
            {selectedTrek.videoUrl && (() => {
              const isInstagram = selectedTrek.videoUrl!.includes('instagram.com');
              return (
                <Col xs={24} lg={12}>
                  {isInstagram ? (
                    // Instagram Reel — show cover image (if provided) as clickable thumbnail
                    <a
                      href={selectedTrek.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', textDecoration: 'none' }}
                    >
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        background: '#000',
                        cursor: 'pointer',
                      }}>
                        {/* Cover image if provided, else gradient placeholder */}
                        {selectedTrek.videoCoverImage ? (
                          <img
                            src={selectedTrek.videoCoverImage}
                            alt="Reel cover"
                            style={{
                              position: 'absolute',
                              top: 0, left: 0,
                              width: '100%', height: '100%',
                              objectFit: 'cover',
                              opacity: 0.85,
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                          }} />
                        )}
 
                        {/* Play button overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0,
                          width: '100%', height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                        }}>
                          <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(255,255,255,0.6)',
                          }}>
                            <span style={{ fontSize: '28px', marginLeft: '4px' }}>▶</span>
                          </div>
                          <span style={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '14px',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(4px)',
                          }}>
                            Watch Reel on Instagram
                          </span>
                        </div>
 
                        {/* Instagram logo top-right */}
                        <div style={{
                          position: 'absolute',
                          top: '12px', right: '12px',
                          background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#fff',
                          letterSpacing: '0.5px',
                        }}>
                          REEL
                        </div>
                      </div>
                    </a>
                  ) : (
                    // YouTube embed
                    <div style={{
                      position: 'relative',
                      paddingTop: '56.25%',
                      width: '100%',
                      marginBottom: '16px'
                    }}>
                      <iframe
                        src={selectedTrek.videoUrl}
                        title={`${selectedTrek.title} Highlights`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                        }}
                      />
                    </div>
                  )}
                </Col>
              );
            })()}
            
            {/* Highlights List */}
            <Col xs={24} lg={selectedTrek.videoUrl ? 12 : 24}>
              <Row gutter={[16, 16]}>
                {selectedTrek.highlights.map((highlight, index) => (
                  <Col xs={24} sm={selectedTrek.videoUrl ? 24 : 12} key={index}>
                    <Space>
                      <Text style={{ color: '#52c41a' }}>✓</Text>
                      <Text>{highlight}</Text>
                    </Space>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
 

        {/* Itinerary */}
        <Card title="Detailed Itinerary" style={{ marginBottom: '40px', borderRadius: '12px' }}>
          <Row gutter={[24, 16]}>
            {selectedTrek.itinerary.map((day, index) => (
              <Col xs={24} key={index}>
                <Card 
                  size="small" 
                  style={{ 
                    background: isDarkMode 
                      ? (index % 2 === 0 ? '#262626' : '#1a1a1a')
                      : (index % 2 === 0 ? '#f8f9fa' : 'white'),
                    border: isDarkMode ? '1px solid #404040' : '1px solid #e8e8e8',
                    transition: 'all 0.3s ease',
                    marginBottom: '8px'
                  }}
                >
                  <Row align="middle" gutter={[16, 8]}>
                    <Col xs={24} sm={3}>
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px', marginBottom: '8px' }}>
                        {day.day}
                      </Tag>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Tag color={day.type === 'Trek' ? 'green' : day.type === 'Travel' ? 'orange' : 'purple'} style={{ fontSize: '12px', padding: '2px 8px', marginBottom: '8px' }}>
                        {day.type}
                      </Tag>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Text strong style={{ color: isDarkMode ? '#e5e5e5' : '#000000', display: 'block', marginBottom: '4px' }}>
                        {day.title}
                      </Text>
                    </Col>
                    <Col xs={24} sm={11}>
                      <Text style={{ color: isDarkMode ? '#a3a3a3' : '#666666', display: 'block' }}>
                        {day.description}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Inclusions & Exclusions */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title="What's Included" 
              style={{ borderRadius: '12px' }}
              headStyle={{ background: '#f6ffed', color: '#52c41a' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {selectedTrek.inclusions.map((item, index) => (
                  <Space key={index}>
                    <Text style={{ color: '#52c41a' }}>✓</Text>
                    <Text>{item}</Text>
                  </Space>
                ))}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title="What's Not Included" 
              style={{ borderRadius: '12px' }}
              headStyle={{ background: '#fff2f0', color: '#ff4d4f' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {selectedTrek.exclusions.map((item, index) => (
                  <Space key={index}>
                    <Text style={{ color: '#ff4d4f' }}>✗</Text>
                    <Text>{item}</Text>
                  </Space>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Pricing Breakdown - Only show if pricing is available */}
        {(selectedTrek.pricing.totalCostWithTransport > 0 || selectedTrek.pricing.totalCostWithoutTransport > 0) && (
          <Card 
            title="Package Pricing" 
            style={{ 
              marginTop: '40px', 
              borderRadius: '12px',
              background: isDarkMode ? '#1a1a1a' : '#f8f9fa'
            }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{ 
                  background: isDarkMode ? '#262626' : 'white', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8'
                }}>
                  <Title level={4} style={{ color: '#d4a574', marginBottom: '16px' }}>
                    Cost Breakdown
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {selectedTrek.pricing.trekFee > 0 && (
                      <Row justify="space-between">
                        <Text>Trek Fee:</Text>
                        <span>
                          {(selectedTrek.pricing.originalPrice != null || activeOffer != null) && (
                            <Text delete style={{ fontSize: '13px', color: isDarkMode ? '#737373' : '#999', marginRight: 6 }}>
                              ₹{(activeOffer?.originalPrice ?? selectedTrek.pricing.originalPrice)!.toLocaleString('en-IN')}
                            </Text>
                          )}
                          <Text strong>₹{(activeOffer?.offerPrice ?? selectedTrek.pricing.trekFee).toLocaleString('en-IN')}</Text>
                        </span>
                      </Row>
                    )}
                    {selectedTrek.pricing.transportationFee > 0 && (
                      <Row justify="space-between">
                        <Text>Transportation Fee:</Text>
                        <Text strong>₹{selectedTrek.pricing.transportationFee.toLocaleString('en-IN')}</Text>
                      </Row>
                    )}
                    <hr style={{ margin: '12px 0', border: '1px solid #e8e8e8' }} />
                    <Row justify="space-between">
                      <Text strong style={{ fontSize: '16px' }}>
                        Total Cost:
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                        ₹{(activeOffer?.offerPrice ?? (selectedTrek.pricing.totalCostWithTransport > 0
                          ? selectedTrek.pricing.totalCostWithTransport
                          : selectedTrek.pricing.totalCostWithoutTransport)).toLocaleString('en-IN')}
                      </Text>
                    </Row>
                  </Space>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ 
                  background: isDarkMode ? '#262626' : 'white', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8'
                }}>
                  <Title level={4} style={{ color: '#d4a574', marginBottom: '16px' }}>
                    Payment Schedule
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Row justify="space-between">
                      <Text>Registration Fee (Non-Refundable):</Text>
                      <Text strong style={{ color: '#ff4d4f' }}>
                        ₹{selectedTrek.pricing.registrationFee.toLocaleString('en-IN')}
                      </Text>
                    </Row>
{(selectedTrek.pricing.remainingAmountWithTransport > 0 || selectedTrek.pricing.remainingAmountWithoutTransport > 0) && (
                      <Row justify="space-between">
                        <Text>Remaining Amount:</Text>
                        <Text strong>
                          ₹{(selectedTrek.pricing.remainingAmountWithTransport > 0 
                            ? selectedTrek.pricing.remainingAmountWithTransport 
                            : selectedTrek.pricing.remainingAmountWithoutTransport).toLocaleString('en-IN')}
                        </Text>
                      </Row>
                    )}
                    <Row justify="space-between">
                      <Text>Payment Deadline:</Text>
                      <Text strong style={{ color: '#1890ff' }}>
                        {selectedTrek.pricing.paymentDeadline}
                      </Text>
                    </Row>
                  </Space>
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '12px', 
                    background: '#fff7e6', 
                    borderRadius: '6px',
                    border: '1px solid #ffd591'
                  }}>
                    <Text style={{ fontSize: '12px', color: '#d46b08' }}>
                      📞 Contact: +91 79834 14419 for booking
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Cancellation Policy - Only show if policies exist */}
        {selectedTrek.cancellationPolicy.length > 0 && (
          <Card 
            title="Cancellation Policy" 
            style={{ 
              marginTop: '40px', 
              borderRadius: '12px',
              background: isDarkMode ? '#1a1a1a' : '#f8f9fa'
            }}
          >
            <Row gutter={[16, 16]}>
              {selectedTrek.cancellationPolicy.map((policy, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card 
                    size="small"
                    style={{ 
                      background: isDarkMode ? '#262626' : 'white',
                      border: '1px solid #e8e8e8',
                      textAlign: 'center'
                    }}
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        {policy.period}
                      </Text>
                      <Text style={{ color: '#ff4d4f', fontSize: '14px' }}>
                        Fee: {policy.fee}
                      </Text>
                      <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                        Refund: {policy.refund}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

      </div>

      {/* Payment Integration Message */}
      <div 
        ref={paymentMessageRef}
        style={{ 
          padding: '60px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <Card 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '2px solid #d4a574'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CreditCardOutlined style={{ fontSize: '48px', color: '#d4a574' }} />
            <Title level={2} style={{ margin: 0, color: '#d4a574' }}>
              Quick Booking 
            </Title>
            <div className="quick-booking-section">
              <Row gutter={[24, 24]} align="stretch">
                <Col xs={24} md={12}>
                  <div className="booking-container">
                    <div className="booking-content">
                      <Button 
                        type="primary" 
                        size="large"
                        onClick={() => {
                          if (useUpiPayment) {
                            setUpiModalOpen(true);
                          } else if (selectedTrek.registrationLink) {
                            window.open(selectedTrek.registrationLink, '_blank');
                          }
                        }}
                        className="booking-button"
                      >
                        🎯 Book Your Slot Now
                      </Button>
                      
                      <div className={`confirmation-message ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                        <Text className={`confirmation-text ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                          📧 After successful payment, you'll receive a confirmation email from Team OBS with the WhatsApp group link. Please join the group to stay updated!
                        </Text>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="booking-container">
                    <div className="booking-content">
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<WhatsAppIcon />}
                        href="https://wa.me/917983414419"
                        target="_blank"
                        className="chat-button"
                      >
                        💬 Chat With Us!
                      </Button>
                      
                      <Paragraph className="contact-info">
                        <Text strong>Reach out to us for any queries:</Text><br />
                        <br />
                        📞 WhatsApp: <Text code>+91 79834 14419</Text><br />
                        📧 Email: <Text code>obsyatharth@gmail.com</Text>
                      </Paragraph>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Space>
        </Card>
      </div>

      {/* UPI Payment Modal (Nagtibba & Kerala) */}
      <Modal
        title="Pay via UPI"
        open={upiModalOpen}
        onCancel={() => setUpiModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <Space direction="vertical" size="middle" style={{ width: '100%', alignItems: 'center' }}>
          <img
            src={upiImage}
            alt="UPI QR code - Scan to pay"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
          />
          <Text style={{ fontSize: 14, color: isDarkMode ? '#a3a3a3' : '#666' }}>
            Scan to pay with any UPI app
          </Text>
          <Alert
            message="Can't pay by UPI?"
            description={
              <Text>
                Call us at <Text strong copyable={{ text: '7983414419' }}>7983414419</Text> for alternate payment options.
              </Text>
            }
            type="info"
            showIcon
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Space>
      </Modal>

      {/* Booking Modal */}
      <BookingModal 
        open={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)}
        trekTitle={selectedTrek.title}
        pricing={selectedTrek.pricing}
        paymentLinks={selectedTrek.paymentLinks}
        transportationRoute={selectedTrek.transportationRoute || 'To be announced'}
      />
    </div>
  );
};

export default UpcomingPage;
