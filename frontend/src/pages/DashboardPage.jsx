import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  FolderGit2,
  CheckCircle,
  Flame,
  Play,
  Pause,
  Square,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  BookOpen,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';
import { analyticsService } from '../services/analyticsService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatDuration, formatDate, formatTimerDisplay } from '../utils/formatters';

export default function DashboardPage() {
  const { projects, tasks, toggleTask, journal, settings, searchQuery } = useApp();
  const { timerState, elapsedSeconds, startTimer, pauseTimer, resumeTimer, stopTimer, activeProject } = useTimer();

  const [analytics, setAnalytics] = useState(null);
  const [chartView, setChartView] = useState('week'); // 'week' | 'month'

  useEffect(() => {
    async function loadStats() {
      const data = await analyticsService.getAnalyticsData(chartView === 'week' ? 7 : 30);
      setAnalytics(data);
    }
    loadStats();
  }, [chartView]);

  // Greetings logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate metrics
  const activeProjectsCount = projects.filter(p => p.status === 'in-progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const weeklyGoalHours = settings.weeklyGoalHours || 20;
  const currentTotalHours = analytics?.totalHours || 0;
  const goalPercent = Math.min(100, Math.round((currentTotalHours / weeklyGoalHours) * 100));

  // Filter tasks & projects with global search if active
  const filteredProjects = projects.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredTasks = tasks.filter(t =>
    !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const latestJournal = journal[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              {greeting}, {settings.name || 'Alex'}
            </h2>
            <Sparkles size={20} style={{ color: 'var(--primary-light)' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Ready to build something great today? Consistent progress compounds.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={15} style={{ color: 'var(--primary-light)' }} />
            <span>{currentDateFormatted}</span>
          </div>
          <Link to="/timer">
            <Button variant="primary" size="sm" icon={Play}>
              Start Session
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Total Coding Hours */}
        <Card className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Coding Hours
              </p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-primary)' }}>
                {analytics ? `${analytics.totalHours}h` : '0h'}
              </h3>
            </div>
            <div style={{
              background: 'var(--primary-subtle)',
              color: 'var(--primary-light)',
              padding: '10px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <Badge variant="success" icon={TrendingUp}>+14% vs last week</Badge>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From active sessions</span>
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Active Projects
              </p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-primary)' }}>
                {activeProjectsCount}
              </h3>
            </div>
            <div style={{
              background: 'var(--secondary-subtle)',
              color: 'var(--secondary-light)',
              padding: '10px',
              borderRadius: 'var(--radius-md)'
            }}>
              <FolderGit2 size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {projects.length} total repositories managed
            </span>
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Tasks Completed
              </p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-primary)' }}>
                {completedTasksCount}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>/{tasks.length}</span>
              </h3>
            </div>
            <div style={{
              background: 'var(--success-subtle)',
              color: 'var(--success)',
              padding: '10px',
              borderRadius: 'var(--radius-md)'
            }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <Badge variant="primary">{tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% rate</Badge>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>High priority focus</span>
          </div>
        </Card>

        {/* Current Coding Streak */}
        <Card className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Coding Streak
              </p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-primary)' }}>
                {analytics?.currentStreak || 5} <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>days</span>
              </h3>
            </div>
            <div style={{
              background: 'var(--warning-subtle)',
              color: 'var(--warning)',
              padding: '10px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <Badge variant="warning">Best: {analytics?.longestStreak || 7} days</Badge>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Keep the fire burning</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Charts & Widgets */}
      <div className="dashboard-grid">
        {/* Weekly Activity Bar Chart */}
        <div className="col-8">
          <Card
            title="Coding Activity"
            subtitle={`Hours spent building over the ${chartView === 'week' ? 'past 7 days' : 'past 30 days'}`}
            action={
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button
                  variant={chartView === 'week' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setChartView('week')}
                >
                  7 Days
                </Button>
                <Button
                  variant={chartView === 'month' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setChartView('month')}
                >
                  30 Days
                </Button>
              </div>
            }
          >
            <div style={{ height: '240px', width: '100%', marginTop: '16px' }}>
              {analytics?.dailyActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      tickFormatter={(val) => `${val}h`}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--bg-surface)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-default)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-md)',
                              fontSize: '0.82rem'
                            }}>
                              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{data.fullDate || data.label}</p>
                              <p style={{ color: 'var(--primary-light)', margin: '2px 0' }}>Coding Time: {data.hours} hours</p>
                              <p style={{ color: 'var(--text-muted)' }}>{data.sessions} sessions logged</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                      {analytics.dailyActivity.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.hours > 0 ? 'var(--primary)' : 'var(--bg-surface)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading activity data...</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Weekly Goal Progress Ring & Quick Timer Widget */}
        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Weekly Goal Card */}
          <Card title="Weekly Goal" subtitle={`Target: ${weeklyGoalHours} hours`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
              {/* Circular Progress Ring */}
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--bg-surface)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - goalPercent / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{goalPercent}%</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Achieved</span>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{currentTotalHours}h logged</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {Math.max(0, weeklyGoalHours - currentTotalHours).toFixed(1)}h remaining
                </p>
                <div style={{ marginTop: '8px' }}>
                  <Badge variant={goalPercent >= 100 ? 'success' : 'primary'}>
                    {goalPercent >= 100 ? 'Goal Completed!' : 'On Track'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Active Coding Timer Widget */}
          <Card title="Live Timer" subtitle={timerState.status === 'running' ? 'Active session' : 'Quick control'}>
            <div style={{ textAlign: 'center', padding: '6px 0' }}>
              <p className="mono" style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                {formatTimerDisplay(elapsedSeconds)}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 12px' }}>
                {activeProject ? activeProject.name : 'Select a project to start'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {timerState.status === 'idle' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => startTimer(projects[0]?.id)}
                  >
                    Quick Start
                  </Button>
                )}
                {timerState.status === 'running' && (
                  <>
                    <Button variant="secondary" size="sm" icon={Pause} onClick={pauseTimer}>
                      Pause
                    </Button>
                    <Button variant="danger" size="sm" icon={Square} onClick={stopTimer}>
                      Stop & Save
                    </Button>
                  </>
                )}
                {timerState.status === 'paused' && (
                  <>
                    <Button variant="primary" size="sm" icon={Play} onClick={resumeTimer}>
                      Resume
                    </Button>
                    <Button variant="danger" size="sm" icon={Square} onClick={stopTimer}>
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Lower Row: Recent Projects & Today's Tasks */}
      <div className="dashboard-grid">
        {/* Recent Projects */}
        <div className="col-8">
          <Card
            title="Recent Projects"
            subtitle="Projects you're actively developing"
            action={
              <Link to="/projects">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  View All
                </Button>
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {filteredProjects.map((p) => {
                const projectTasks = tasks.filter(t => t.projectId === p.id);
                const completedCount = projectTasks.filter(t => t.status === 'completed').length;
                const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

                return (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    style={{
                      display: 'block',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      transition: 'border-color 0.15s, transform 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: p.color || 'var(--primary)'
                            }}
                          />
                          <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{p.name}</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {p.description}
                        </p>
                      </div>
                      <Badge variant={p.status === 'completed' ? 'success' : p.status === 'in-progress' ? 'primary' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Progress ({completedCount}/{projectTasks.length} tasks)</span>
                        <span>{progress}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: p.color || 'var(--primary)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>

                    {/* Tech Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                      {(p.technologies || []).map(tech => (
                        <span
                          key={tech}
                          style={{
                            fontSize: '0.74rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Today's Tasks & Journal Preview */}
        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Today's Tasks */}
          <Card
            title="Focus Tasks"
            subtitle="Prioritized for today"
            action={
              <Link to="/tasks">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  All
                </Button>
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {filteredTasks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
                  No pending tasks for today.
                </p>
              ) : (
                filteredTasks.map((t) => {
                  const proj = projects.find(p => p.id === t.projectId);
                  return (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={() => toggleTask(t.id)}
                        style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '0.86rem',
                          fontWeight: '500',
                          textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                          color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}>
                          {t.title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          {proj && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                              {proj.name}
                            </span>
                          )}
                          <Badge
                            variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}
                          >
                            {t.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Latest Journal Entry Preview */}
          {latestJournal && (
            <Card
              title="Dev Journal"
              subtitle="Latest learning reflection"
              action={
                <Link to="/journal">
                  <BookOpen size={16} style={{ color: 'var(--primary-light)' }} />
                </Link>
              }
            >
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {latestJournal.title}
                </p>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {latestJournal.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(latestJournal.createdAt)}
                  </span>
                  <Link to="/journal" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                    Read more →
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
