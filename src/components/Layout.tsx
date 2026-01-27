import React from 'react';
import { Layout as AntLayout, Menu, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, BookOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useDarkMode } from '../contexts/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import FloatingContactButtons from './FloatingContactButtons';
import obsLogo from '../assets/obsLogo.png';
import '../styles/components/Layout.less';

const { Header, Content, Footer } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/upcoming',
      icon: <CalendarOutlined />,
      label: 'Upcoming Experiences',
    },
    {
      key: '/diaries',
      icon: <BookOutlined />,
      label: 'Previous OBS Diaries',
    },
    {
      key: '/about',
      icon: <TeamOutlined />,
      label: 'About Us',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout className="layout-container">
      <Header className={`layout-header ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="logo-container" onClick={() => navigate('/')}>
          <img 
            src={obsLogo} 
            alt="Oh-Bhaisahab Experiences Logo" 
            className="logo-image"
          />
          <Title level={3} className={`logo-title ${isDarkMode ? 'dark-mode' : ''}`}>
            Oh-Bhaisahab Experiences
          </Title>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="navigation-menu"
        />
        <Space className="header-actions">
          <DarkModeToggle />
        </Space>
      </Header>
      
      <Content className={`layout-content ${isDarkMode ? 'dark' : ''}`}>
        {children}
      </Content>

      <FloatingContactButtons />

      <Footer className={`layout-footer ${isDarkMode ? 'dark' : 'light'}`}>
        Oh-Bhaisahab Experiences ©2025 Created with ❤️ for Adventure Seekers
      </Footer>
    </AntLayout>
  );
};

export default Layout;
