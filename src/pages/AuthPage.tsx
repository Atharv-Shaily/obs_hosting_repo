import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Tabs, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import '../styles/components/AuthPage.less';

const { Title, Paragraph } = Typography;

interface LocationState {
  returnTo?: string;
}

const AuthPage: React.FC = () => {
  const { login, register, googleLogin } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as LocationState)?.returnTo ?? '/';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      await login(values);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      await register(values);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form
      name="login-form"
      layout="vertical"
      onFinish={handleLogin}
      requiredMark={false}
      className="auth-form"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email.' },
          { type: 'email', message: 'Please enter a valid email.' },
        ]}
      >
        <Input
          id="login-email"
          prefix={<UserOutlined />}
          placeholder="your@email.com"
          size="large"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password.' }]}
      >
        <Input.Password
          id="login-password"
          prefix={<LockOutlined />}
          placeholder="Your password"
          size="large"
          autoComplete="current-password"
        />
      </Form.Item>

      {error && (
        <Form.Item>
          <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />
        </Form.Item>
      )}

      <Form.Item>
        <Button
          id="login-submit"
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          icon={<LoginOutlined />}
        >
          Sign In
        </Button>
      </Form.Item>

      <Paragraph className="auth-toggle-text">
        New to OBS?{' '}
        <span
          className="auth-toggle-link"
          onClick={() => { setActiveTab('register'); setError(null); }}
        >
          Create an account
        </span>
      </Paragraph>
    </Form>
  );

  const registerForm = (
    <Form
      name="register-form"
      layout="vertical"
      onFinish={handleRegister}
      requiredMark={false}
      className="auth-form"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email.' },
          { type: 'email', message: 'Please enter a valid email.' },
        ]}
      >
        <Input
          id="register-email"
          prefix={<UserOutlined />}
          placeholder="your@email.com"
          size="large"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter a password.' },
          { min: 6, message: 'Password must be at least 6 characters.' },
        ]}
      >
        <Input.Password
          id="register-password"
          prefix={<LockOutlined />}
          placeholder="Create a password"
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      {error && (
        <Form.Item>
          <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />
        </Form.Item>
      )}

      <Form.Item>
        <Button
          id="register-submit"
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          icon={<UserAddOutlined />}
        >
          Create Account
        </Button>
      </Form.Item>

      <Paragraph className="auth-toggle-text">
        Already have an account?{' '}
        <span
          className="auth-toggle-link"
          onClick={() => { setActiveTab('login'); setError(null); }}
        >
          Sign in
        </span>
      </Paragraph>
    </Form>
  );

  return (
    <div className={`auth-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="auth-card-wrapper">
        <div className={`auth-card ${isDarkMode ? 'dark-mode' : ''}`}>
          {/* Header */}
          <div className="auth-header">
            <div className="auth-mountain-emoji">🏔️</div>
            <Title level={2} className="auth-title">
              {activeTab === 'login' ? 'Welcome Back, Pahaadi!' : 'Join the OBS Tribe'}
            </Title>
            <Paragraph className="auth-subtitle">
              {activeTab === 'login'
                ? 'Sign in to track your treks and loyalty points.'
                : 'Start your Himalayan journey and earn loyalty rewards.'}
            </Paragraph>
          </div>

          {/* Google Sign In */}
          <div className="google-signin-section">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;
                setError(null);
                setLoading(true);
                try {
                  await googleLogin(credentialResponse.credential);
                  navigate(returnTo, { replace: true });
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Google sign-in failed.');
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                setError('Google sign-in was cancelled or failed.');
              }}
              size="large"
              width="380"
              text="continue_with"
              shape="pill"
            />
            {error && !activeTab && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginTop: 12 }}
              />
            )}
          </div>

          <Divider className="auth-divider">or continue with email</Divider>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={(key) => { setActiveTab(key as 'login' | 'register'); setError(null); }}
            centered
            items={[
              { key: 'login', label: 'Sign In', children: loginForm },
              { key: 'register', label: 'Register', children: registerForm },
            ]}
            className="auth-tabs"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
