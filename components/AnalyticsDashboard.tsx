import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Analytics data types
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
    purchases: number;
    revenue: number;
  }>;
  userJourney: Array<{
    step: string;
    users: number;
    dropoff: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  realtime: {
    activeUsers: number;
    currentPageViews: number;
    recentActions: Array<{
      action: string;
      user: string;
      timestamp: Date;
      value?: number;
    }>;
  };
}

// Helper functions
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

// Mock analytics data (in real app, this would come from analytics service)
const mockAnalyticsData: AnalyticsData = {
  pageViews: 15420,
  uniqueVisitors: 8934,
  bounceRate: 32.5,
  avgSessionDuration: 245, // seconds
  conversionRate: 3.8,
  topProducts: [
    { id: '1', name: 'Diamond Ring', views: 1250, purchases: 45, revenue: 22500 },
    { id: '2', name: 'Gold Necklace', views: 980, purchases: 32, revenue: 19200 },
    { id: '3', name: 'Pearl Earrings', views: 875, purchases: 28, revenue: 11200 },
    { id: '4', name: 'Sapphire Bracelet', views: 742, purchases: 19, revenue: 13300 },
    { id: '5', name: 'Ruby Pendant', views: 654, purchases: 15, revenue: 9750 },
  ],
  userJourney: [
    { step: 'Homepage', users: 10000, dropoff: 0 },
    { step: 'Product View', users: 6800, dropoff: 32 },
    { step: 'Add to Cart', users: 2450, dropoff: 64 },
    { step: 'Checkout', users: 1200, dropoff: 51 },
    { step: 'Purchase', users: 380, dropoff: 68 },
  ],
  deviceBreakdown: {
    mobile: 68,
    desktop: 25,
    tablet: 7,
  },
  trafficSources: [
    { source: 'Direct', visitors: 4250, percentage: 47.5 },
    { source: 'Search Engines', visitors: 2890, percentage: 32.3 },
    { source: 'Social Media', visitors: 1234, percentage: 13.8 },
    { source: 'Email', visitors: 560, percentage: 6.3 },
  ],
  realtime: {
    activeUsers: 127,
    currentPageViews: 45,
    recentActions: [
      { action: 'Purchase', user: 'Sarah M.', timestamp: new Date(Date.now() - 30000), value: 299 },
      { action: 'Add to Cart', user: 'John D.', timestamp: new Date(Date.now() - 45000) },
      { action: 'Product View', user: 'Emma L.', timestamp: new Date(Date.now() - 120000) },
      { action: 'Wishlist Add', user: 'Mike R.', timestamp: new Date(Date.now() - 180000) },
      { action: 'Search', user: 'Lisa K.', timestamp: new Date(Date.now() - 240000) },
    ],
  },
};

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        realtime: {
          ...prev.realtime,
          activeUsers: Math.max(50, prev.realtime.activeUsers + (Math.random() - 0.5) * 10),
          currentPageViews: Math.max(
            20,
            prev.realtime.currentPageViews + (Math.random() - 0.5) * 5,
          ),
          recentActions: [
            {
              action: ['Purchase', 'Add to Cart', 'Product View', 'Wishlist Add', 'Search'][
                Math.floor(Math.random() * 5)
              ],
              user: ['Anonymous User', 'Sarah M.', 'John D.', 'Emma L.', 'Mike R.'][
                Math.floor(Math.random() * 5)
              ],
              timestamp: new Date(),
              value: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 50 : undefined,
            },
            ...prev.realtime.recentActions.slice(0, 4),
          ],
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-brand-charcoal dark:text-dark-text">
              Analytics Dashboard
            </h1>
            <p className="text-brand-warm-gray dark:text-dark-text-secondary mt-1">
              Real-time insights into your jewelry business performance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="input-modern"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <div className="flex items-center space-x-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Page Views"
            value={formatNumber(data.pageViews)}
            change="+12.5%"
            trend="up"
            icon="👁️"
          />
          <MetricCard
            title="Unique Visitors"
            value={formatNumber(data.uniqueVisitors)}
            change="+8.2%"
            trend="up"
            icon="👥"
          />
          <MetricCard
            title="Conversion Rate"
            value={formatPercentage(data.conversionRate)}
            change="+2.1%"
            trend="up"
            icon="🎯"
          />
          <MetricCard
            title="Avg. Session"
            value={formatTime(data.avgSessionDuration)}
            change="-5.3%"
            trend="down"
            icon="⏱️"
          />
        </div>

        {/* Real-time Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
              <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-4">
                Real-time Activity
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-burgundy">
                    {data.realtime.activeUsers}
                  </div>
                  <div className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-gold">
                    {data.realtime.currentPageViews}
                  </div>
                  <div className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
                    Current Page Views
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-brand-charcoal dark:text-dark-text">
                  Recent Activity
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.realtime.recentActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface-elevated rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-gold/10 rounded-full flex items-center justify-center">
                          {action.action === 'Purchase' && '💳'}
                          {action.action === 'Add to Cart' && '🛒'}
                          {action.action === 'Product View' && '👁️'}
                          {action.action === 'Wishlist Add' && '❤️'}
                          {action.action === 'Search' && '🔍'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
                            {action.user}
                          </div>
                          <div className="text-xs text-brand-warm-gray dark:text-dark-text-secondary">
                            {action.action}
                            {action.value && ` - ${formatCurrency(action.value)}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-brand-warm-gray dark:text-dark-text-secondary">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Device Breakdown */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
              <h3 className="text-lg font-serif text-brand-charcoal dark:text-dark-text mb-4">
                Device Breakdown
              </h3>
              <div className="space-y-3">
                <DeviceBar
                  label="Mobile"
                  percentage={data.deviceBreakdown.mobile}
                  color="bg-blue-500"
                />
                <DeviceBar
                  label="Desktop"
                  percentage={data.deviceBreakdown.desktop}
                  color="bg-green-500"
                />
                <DeviceBar
                  label="Tablet"
                  percentage={data.deviceBreakdown.tablet}
                  color="bg-purple-500"
                />
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
              <h3 className="text-lg font-serif text-brand-charcoal dark:text-dark-text mb-4">
                Traffic Sources
              </h3>
              <div className="space-y-3">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-brand-charcoal dark:text-dark-text">
                      {source.source}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-brand-gold h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-brand-warm-gray dark:text-dark-text-secondary w-12 text-right">
                        {formatPercentage(source.percentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Journey & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Journey Funnel */}
          <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
            <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-6">
              User Journey Funnel
            </h3>
            <div className="space-y-4">
              {data.userJourney.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
                      {step.step}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
                        {formatNumber(step.users)} users
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          step.dropoff < 30
                            ? 'bg-green-100 text-green-800'
                            : step.dropoff < 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        -{formatPercentage(step.dropoff)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-brand-burgundy to-brand-gold h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(step.users / data.userJourney[0].users) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
            <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-6">
              Top Performing Products
            </h3>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-brand-gold/10 rounded-full flex items-center justify-center text-sm font-bold text-brand-gold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
                        {product.name}
                      </span>
                      <span className="text-sm font-bold text-brand-burgundy">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-brand-warm-gray dark:text-dark-text-secondary">
                        {formatNumber(product.views)} views
                      </span>
                      <span className="text-xs text-green-600">{product.purchases} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass">
          <h3 className="text-xl font-serif text-brand-charcoal dark:text-dark-text mb-6">
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard
              title="Bounce Rate"
              value={formatPercentage(data.bounceRate)}
              status={data.bounceRate < 40 ? 'good' : data.bounceRate < 60 ? 'warning' : 'bad'}
              recommendation="Consider improving page load speed and content relevance"
            />
            <InsightCard
              title="Mobile Traffic"
              value={formatPercentage(data.deviceBreakdown.mobile)}
              status="good"
              recommendation="Mobile optimization is working well"
            />
            <InsightCard
              title="Conversion Funnel"
              value={`${formatPercentage(data.conversionRate)} completion`}
              status={data.conversionRate > 3 ? 'good' : 'warning'}
              recommendation="Focus on checkout optimization and trust signals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}> = ({ title, value, change, trend, icon }) => {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const trendIcon = {
    up: '↗️',
    down: '↘️',
    neutral: '→',
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-glass hover:shadow-glass-hover transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand-warm-gray dark:text-dark-text-secondary">
            {title}
          </p>
          <p className="text-2xl font-bold text-brand-charcoal dark:text-dark-text mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${trendColor[trend]}`}>
            <span className="mr-1">{trendIcon[trend]}</span>
            <span>{change}</span>
          </div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

const DeviceBar: React.FC<{
  label: string;
  percentage: number;
  color: string;
}> = ({ label, percentage, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm text-brand-charcoal dark:text-dark-text">{label}</span>
      <span className="text-sm text-brand-warm-gray dark:text-dark-text-secondary">
        {formatPercentage(percentage)}
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const InsightCard: React.FC<{
  title: string;
  value: string;
  status: 'good' | 'warning' | 'bad';
  recommendation: string;
}> = ({ title, value, status, recommendation }) => {
  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bad: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusIcons = {
    good: '✅',
    warning: '⚠️',
    bad: '❌',
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
      <div className="flex items-center space-x-2 mb-2">
        <span>{statusIcons[status]}</span>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-lg font-bold mb-2">{value}</p>
      <p className="text-sm opacity-80">{recommendation}</p>
    </div>
  );
};

export default AnalyticsDashboard;
