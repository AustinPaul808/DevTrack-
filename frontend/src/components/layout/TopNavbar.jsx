import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Timer,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';
import { formatTimerDisplay } from '../../utils/formatters';
import Button from '../common/Button';

export default function TopNavbar({ onMenuToggle }) {
  const { settings, toggleTheme, searchQuery, setSearchQuery } = useApp();
  const { timerState, elapsedSeconds, activeProject } = useTimer();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const isTimerRunning = timerState.status === 'running';

  const sampleNotifications = [
    {
      id: 1,
      title: 'Coding Streak Milestone',
      description: 'You hit your 5-day coding streak! Keep up the momentum.',
      time: '2h ago',
      icon: CheckCircle2,
      color: 'var(--success)'
    },
    {
      id: 2,
      title: 'Weekly Goal Progress',
      description: 'You completed 70% of your weekly 20h coding goal.',
      time: '1d ago',
      icon: Calendar,
      color: 'var(--primary-light)'
    }
  ];

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <Button
          variant="ghost"
          size="sm"
          className="mobile-nav-toggle"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </Button>

        {/* Global Search */}
        <div className="topbar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search projects, tasks, journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Active Timer Live Pill */}
        {isTimerRunning && (
          <div
            className="timer-pill"
            onClick={() => navigate('/timer')}
            title="Active timer running - click to view"
          >
            <div className="timer-pulse-dot" />
            <Timer size={14} />
            <span className="mono">{formatTimerDisplay(elapsedSeconds)}</span>
            {activeProject && (
              <span className="truncate" style={{ maxWidth: '100px', opacity: 0.85 }}>
                • {activeProject.name}
              </span>
            )}
          </div>
        )}

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--primary)'
              }}
            />
          </Button>

          {showNotifications && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                onClick={() => setShowNotifications(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '320px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 101,
                  padding: '12px',
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Notifications</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mock Feed</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sampleNotifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-surface)'
                        }}
                      >
                        <div style={{ color: n.color, marginTop: '2px' }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.82rem', fontWeight: '600' }}>{n.title}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.description}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
}
