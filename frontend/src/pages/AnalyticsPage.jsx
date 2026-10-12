import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  PieChart as PieIcon,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { analyticsService } from '../services/analyticsService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function AnalyticsPage() {
  const { settings } = useApp();
  const [range, setRange] = useState(7); // 7 | 30 | 90
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const res = await analyticsService.getAnalyticsData(range);
      setData(res);
      setLoading(false);
    }
    fetchAnalytics();
  }, [range]);

  const weeklyGoalHours = settings.weeklyGoalHours || 20;
  const goalCompletionPercent = data ? Math.min(100, Math.round((data.totalHours / weeklyGoalHours) * 100)) : 0;

  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Analytics & Habits
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Deep dive into productivity trends, project breakdown, and focus metrics.
          </p>
        </div>

        {/* Range Filters */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {[
            { label: 'Last 7 Days', value: 7 },
            { label: 'Last 30 Days', value: 30 },
            { label: 'Last 90 Days', value: 90 }
          ].map(r => (
            <Button
              key={r.value}
              variant={range === r.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Hours</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '4px' }}>
                {data ? `${data.totalHours}h` : '0h'}
              </h3>
            </div>
            <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary-light)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Clock size={18} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
            Selected {range}-day period
          </span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Average</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '4px' }}>
                {data ? `${data.averageDailyHours}h` : '0h'}
              </h3>
            </div>
            <div style={{ background: 'var(--secondary-subtle)', color: 'var(--secondary-light)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
            Across all {range} days
          </span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Top Productive Day</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '4px' }}>
                {data?.mostProductiveDay || 'Friday'}
              </h3>
            </div>
            <div style={{ background: 'var(--success-subtle)', color: 'var(--success)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Award size={18} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
            Highest session volume
          </span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coding Streak</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '4px' }}>
                {data?.currentStreak || 5} days
              </h3>
            </div>
            <div style={{ background: 'var(--warning-subtle)', color: 'var(--warning)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Flame size={18} />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
            Longest record: {data?.longestStreak || 7} days
          </span>
        </Card>
      </div>

      {/* Main Charts: Activity Trend and Project Distribution */}
      <div className="dashboard-grid">
        {/* Trend Area Chart */}
        <div className="col-8">
          <Card title="Coding Hours Trend" subtitle={`Daily activity over the selected ${range} days`}>
            <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
              {data?.dailyActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-subtle)' }}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border-subtle)' }}
                      tickFormatter={(v) => `${v}h`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-default)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-md)',
                              fontSize: '0.82rem'
                            }}>
                              <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.fullDate || item.label}</p>
                              <p style={{ color: 'var(--primary-light)', margin: '2px 0' }}>{item.hours} hours logged</p>
                              <p style={{ color: 'var(--text-muted)' }}>{item.sessions} session(s)</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="var(--primary-light)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#purpleGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '100px' }}>Loading chart data...</p>
              )}
            </div>
          </Card>
        </div>

        {/* Project Breakdown Distribution */}
        <div className="col-4">
          <Card title="Time by Project" subtitle="Distribution among active repositories">
            <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
              {data?.projectBreakdown && data.projectBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.projectBreakdown}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {data.projectBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-default)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.82rem'
                            }}>
                              <p style={{ fontWeight: '700', color: item.color }}>{item.name}</p>
                              <p style={{ color: 'var(--text-primary)' }}>{item.hours}h ({item.percentage}%)</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '100px' }}>No session records.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
