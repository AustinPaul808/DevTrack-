import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Timer,
  CalendarDays,
  BarChart3,
  BookOpen,
  Settings,
  Code2,
  Star,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
  const { projects, settings } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Coding Timer', path: '/timer', icon: Timer },
    { name: 'Activity Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Developer Journal', path: '/journal', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Pick top 3 favorite projects
  const favoriteProjects = projects.slice(0, 3);

  return (
    <>
      {isOpen && <div className="mobile-overlay" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <Code2 size={20} />
          </div>
          <div>
            <h1 className="brand-text">DevTrack</h1>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="sidebar-scroll">
          <div>
            <p className="nav-section-title">Menu</p>
            <ul className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                      }
                      end={item.path === '/'}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Favorites Section */}
          {favoriteProjects.length > 0 && (
            <div>
              <p className="nav-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={12} style={{ color: 'var(--warning)' }} />
                <span>Favorites</span>
              </p>
              <ul className="nav-list">
                {favoriteProjects.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/projects/${p.id}`}
                      onClick={onClose}
                      className="nav-fav-item"
                    >
                      <span className="truncate" style={{ maxWidth: '170px' }}>
                        {p.name}
                      </span>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: p.color || 'var(--primary-light)',
                          flexShrink: 0
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Area */}
        <div className="sidebar-profile">
          <div className="profile-info">
            <div className="avatar-placeholder">
              {settings.name ? settings.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-primary)' }} className="truncate">
                {settings.name || 'Developer'}
              </p>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }} className="truncate">
                {settings.role || 'Full-Stack'}
              </p>
            </div>
          </div>
          <Link to="/settings" onClick={onClose} title="Settings" style={{ color: 'var(--text-muted)', padding: '6px' }}>
            <Settings size={16} />
          </Link>
        </div>
      </aside>
    </>
  );
}
