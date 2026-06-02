import React, { useEffect, useState } from 'react';
import { Typography, Card, Table, Tag, Spin, Alert, Progress, Row, Col, Statistic } from 'antd';
import {
  TrophyOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import '../styles/components/ProfilePage.less';

const { Title, Paragraph } = Typography;

// ── Types ────────────────────────────────────────────────────────────────────

interface PopulatedTrek {
  _id: string;
  title: string;
  loyaltyReward: number;
}

interface LoyaltyEntry {
  _id: string;
  trekId: PopulatedTrek | null;
  pointsEarned: number;
  transactionDate: string;
}

// ── Rank config ──────────────────────────────────────────────────────────────

interface RankConfig {
  label: string;
  emoji: string;
  color: string;
  maxPoints: number;
  nextRank: string | null;
}

const RANK_CONFIG: Record<string, RankConfig> = {
  'L1 – Explorer': {
    label: 'L1 – Explorer',
    emoji: '🥾',
    color: '#8b5cf6',
    maxPoints: 1000,
    nextRank: 'L2 – Pahaadi Soul',
  },
  'L2 – Pahaadi Soul': {
    label: 'L2 – Pahaadi Soul',
    emoji: '🏕️',
    color: '#3b82f6',
    maxPoints: 2000,
    nextRank: 'L3 – Summit Seeker',
  },
  'L3 – Summit Seeker': {
    label: 'L3 – Summit Seeker',
    emoji: '⛰️',
    color: '#10b981',
    maxPoints: 3500,
    nextRank: 'L4 – Mountain Beast',
  },
  'L4 – Mountain Beast': {
    label: 'L4 – Mountain Beast',
    emoji: '🦁',
    color: '#f59e0b',
    maxPoints: 6000,
    nextRank: 'L5 – Oh-Bhaisahab Legend',
  },
  'L5 – Oh-Bhaisahab Legend': {
    label: 'L5 – Oh-Bhaisahab Legend',
    emoji: '🏆',
    color: '#ef4444',
    maxPoints: 6000,
    nextRank: null,
  },
};

const RANK_THRESHOLDS: Record<string, number> = {
  'L1 – Explorer': 0,
  'L2 – Pahaadi Soul': 1001,
  'L3 – Summit Seeker': 2001,
  'L4 – Mountain Beast': 3501,
  'L5 – Oh-Bhaisahab Legend': 6001,
};

// ── Component ────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [history, setHistory] = useState<LoyaltyEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh user so rank & points are always up to date
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.get<{ history: LoyaltyEntry[] }>('/api/users/loyalty-history');
        setHistory(data.history);
      } catch (err) {
        setHistoryError(err instanceof Error ? err.message : 'Failed to load loyalty history.');
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const currentRank = user?.rank ?? 'L1 – Explorer';
  const rankConfig = RANK_CONFIG[currentRank] ?? RANK_CONFIG['L1 – Explorer'];
  const loyaltyPoints = user?.loyaltyPoints ?? 0;

  // Calculate progress within current rank band
  const rankMin = RANK_THRESHOLDS[currentRank] ?? 0;
  const rankMax = rankConfig.maxPoints;
  const progressPercent = rankConfig.nextRank
    ? Math.min(100, Math.round(((loyaltyPoints - rankMin) / (rankMax - rankMin)) * 100))
    : 100;
  const pointsToNext = rankConfig.nextRank ? Math.max(0, rankMax + 1 - loyaltyPoints) : 0;

  // Table columns
  const columns = [
    {
      title: 'Trek',
      dataIndex: ['trekId', 'title'],
      key: 'trek',
      render: (_: unknown, record: LoyaltyEntry) =>
        record.trekId?.title ?? <span style={{ color: '#aaa' }}>Trek removed</span>,
    },
    {
      title: 'Points Earned',
      dataIndex: 'pointsEarned',
      key: 'pointsEarned',
      render: (points: number) => (
        <Tag color="green" icon={<StarOutlined />} style={{ fontWeight: 600 }}>
          +{points}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'date',
      render: (date: string) =>
        new Date(date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
  ];

  return (
    <div className={`profile-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-container">

        {/* ── Hero / Rank Card ── */}
        <div
          className="profile-rank-hero"
          style={{ '--rank-color': rankConfig.color } as React.CSSProperties}
        >
          <div className="profile-rank-glow" />
          <div className="profile-rank-content">
            <div className="profile-rank-emoji">{rankConfig.emoji}</div>
            <Title level={1} className="profile-rank-title">
              {currentRank}
            </Title>
            <Paragraph className="profile-rank-email">{user?.email}</Paragraph>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <Row gutter={[20, 20]} className="profile-stats-row">
          <Col xs={24} sm={8}>
            <Card className={`profile-stat-card ${isDarkMode ? 'dark-mode' : ''}`}>
              <Statistic
                title="Total Loyalty Points"
                value={loyaltyPoints}
                prefix={<TrophyOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={`profile-stat-card ${isDarkMode ? 'dark-mode' : ''}`}>
              <Statistic
                title="Treks Completed"
                value={history.length}
                prefix={<ThunderboltOutlined style={{ color: rankConfig.color }} />}
                valueStyle={{ color: rankConfig.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={`profile-stat-card ${isDarkMode ? 'dark-mode' : ''}`}>
              <Statistic
                title="Points to Next Rank"
                value={rankConfig.nextRank ? pointsToNext : '—'}
                prefix={<StarOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#8b5cf6', fontWeight: 700 }}
                suffix={rankConfig.nextRank ? 'pts' : ''}
              />
            </Card>
          </Col>
        </Row>

        {/* ── Rank Progress ── */}
        {rankConfig.nextRank && (
          <Card className={`profile-progress-card ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="profile-progress-header">
              <span className="profile-progress-label">Progress to {rankConfig.nextRank}</span>
              <span className="profile-progress-pct">{progressPercent}%</span>
            </div>
            <Progress
              percent={progressPercent}
              strokeColor={rankConfig.color}
              trailColor={isDarkMode ? '#333' : '#eee'}
              showInfo={false}
              strokeLinecap="round"
              size={['100%', 10]}
            />
            <div className="profile-progress-footer">
              <span>{loyaltyPoints} pts</span>
              <span>{rankMax} pts</span>
            </div>
          </Card>
        )}

        {/* ── Loyalty History Table ── */}
        <Card
          className={`profile-history-card ${isDarkMode ? 'dark-mode' : ''}`}
          title={
            <span className="profile-history-title">
              <CalendarOutlined style={{ marginRight: 8, color: rankConfig.color }} />
              Loyalty History
            </span>
          }
        >
          {historyLoading ? (
            <div className="profile-loading">
              <Spin size="large" />
            </div>
          ) : historyError ? (
            <Alert type="error" message={historyError} showIcon />
          ) : history.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty-emoji">🏔️</div>
              <Paragraph className="profile-empty-text">
                No treks completed yet. Book your first OBS experience to start earning loyalty points!
              </Paragraph>
            </div>
          ) : (
            <Table
              dataSource={history}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 8, hideOnSinglePage: true }}
              className="loyalty-table"
            />
          )}
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;
