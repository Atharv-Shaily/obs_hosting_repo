import React from 'react';
import { Drawer, Card, Typography, Space, Row, Col, Alert } from 'antd';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDarkMode } from '../contexts/DarkModeContext';
import '../styles/components/UpcomingDrawer.less';

// Import trek images
import brahmaltalImg from '../assets/treks/bhramtal/bhramtal.jpg';
import kedarkanthaImg from '../assets/treks/kedarkantha/kedarkantha.jpg';
import sandakhpuImg from '../assets/treks/sandakhpu/sandakhpu.jpg';
import obsPosterImg from '../assets/obs_poster.jpg';

const { Title, Text } = Typography;

interface UpcomingDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UpcomingDrawer: React.FC<UpcomingDrawerProps> = ({ open, onClose }) => {
  const { isDarkMode } = useDarkMode();

  const upcomingTreks = [
    {
      id: 1,
      name: 'Brahmatal Trek',
      date: '26 Mar - 31 Mar',
      days: '6 Days',
      image: brahmaltalImg,
      description: 'Discover the Beauty of the Himalayas with OBS!',
      color: '#ff7875'
    },
    {
      id: 2,
      name: 'Kedarkantha Trek',
      date: '25 Jan - 29 Jan',
      days: '5 Days - Republic Day Long Weekend',
      image: kedarkanthaImg,
      description: 'Experience an unforgettable Winter Adventure!',
      color: '#ffa940'
    },
    {
      id: 3,
      name: 'Sandakphu-Phalut Trek',
      date: '14 Feb - 20 Feb',
      days: '7 Days',
      image: sandakhpuImg,
      description: 'Embark on an incredible Himalayan Journey!',
      color: '#95de64'
    }
  ];

  return (
    <Drawer
      title={
        <div className="drawer-title-container">
          <CalendarOutlined />
          <Title level={3}>
            More Upcoming Adventures
          </Title>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      className={`upcoming-drawer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <Space direction="vertical" size="large" className="drawer-space">
        {/* OBS Poster Banner */}
        <div className="poster-banner">
          <img 
            src={obsPosterImg} 
            alt="Oh-Bhaisahab Experiences"
            className="poster-image"
          />
        </div>

        {/* Trek Cards */}
        <div className="treks-container">
          <Title level={4} className={`treks-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            🏔️ Upcoming Treks
          </Title>
          
          <Alert
            message="Coming Soon!"
            description="More details will be shared soon! Stay tuned for exciting adventures ahead. 🎉"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className={`treks-alert ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
          />
          
          <Row gutter={[16, 16]}>
            {upcomingTreks.map((trek) => (
              <Col xs={24} key={trek.id}>
                <Card
                  hoverable
                  className={`trek-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                  cover={
                    <div className="trek-image-container">
                      <img 
                        alt={trek.name}
                        src={trek.image}
                        className="trek-image"
                      />
                      <div className="trek-overlay">
                        <div className="trek-date-badge" style={{ background: trek.color }}>
                          <CalendarOutlined />
                          {trek.date}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <Title level={4}>
                        {trek.name}
                      </Title>
                    }
                    description={
                      <Text>
                        {trek.days}
                      </Text>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Space>
    </Drawer>
  );
};

export default UpcomingDrawer;

