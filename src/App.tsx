import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import DiariesPage from './pages/DiariesPage';
import UpcomingPage from './pages/UpcomingPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const AppContent: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#e5e5e5' : '#d4a574',
          borderRadius: 6,
          colorBgContainer: isDarkMode ? '#1a1a1a' : '#ffffff',
          colorBgElevated: isDarkMode ? '#262626' : '#ffffff',
          colorBgLayout: isDarkMode ? '#0f0f0f' : '#f5f5f5',
          colorText: isDarkMode ? '#e5e5e5' : '#000000',
          colorTextSecondary: isDarkMode ? '#a3a3a3' : '#666666',
          colorBorder: isDarkMode ? '#404040' : '#d9d9d9',
          colorBorderSecondary: isDarkMode ? '#262626' : '#f0f0f0',
        },
      }}
    >
      <Router basename="/">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/diaries" element={<DiariesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DarkModeProvider>
  );
};

export default App;