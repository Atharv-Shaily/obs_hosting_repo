import React from 'react';
import { Layout as AntLayout, Menu, Typography, Space, Button, Tag, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
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
  const { user, isAuthenticated, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <Space className="header-actions" size={8}>
          <DarkModeToggle />

          {isAuthenticated && user ? (
            <>
              {/* Rank badge */}
              <Tooltip title={`${user.loyaltyPoints} loyalty points`}>
                <Tag
                  icon={<TrophyOutlined />}
                  color="gold"
                  className="rank-tag"
                  style={{ cursor: 'default', fontWeight: 600 }}
                >
                  {user.rank}
                </Tag>
              </Tooltip>

              {/* Profile link */}
              <Button
                id="nav-profile-btn"
                type="text"
                icon={<UserOutlined />}
                onClick={() => navigate('/profile')}
                className={`nav-auth-btn ${isDarkMode ? 'dark' : ''}`}
              >
                Profile
              </Button>

              {/* Logout */}
              <Button
                id="nav-logout-btn"
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                danger
                className="nav-auth-btn"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              id="nav-signin-btn"
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/auth')}
              style={{ borderRadius: 8 }}
            >
              Sign In
            </Button>
          )}
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
