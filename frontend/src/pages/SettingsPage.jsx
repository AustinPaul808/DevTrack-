import React, { useState } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Target,
  Bell,
  Download,
  Database,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { exportToJson, exportSessionsToCsv } from '../utils/exportData';

export default function SettingsPage() {
  const { settings, updateSettings, toggleTheme, projects, tasks, sessions, journal } = useApp();

  const [formState, setFormState] = useState({
    name: settings.name || 'Alex Rivera',
    role: settings.role || 'Full-Stack Engineer',
    weeklyGoalHours: settings.weeklyGoalHours || 20,
    defaultTimerMinutes: settings.defaultTimerMinutes || 25,
    soundNotifications: settings.soundNotifications ?? true,
    desktopNotifications: settings.desktopNotifications ?? false
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...formState,
      weeklyGoalHours: Number(formState.weeklyGoalHours) || 20,
      defaultTimerMinutes: Number(formState.defaultTimerMinutes) || 25
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleExportAllJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      app: 'DevTrack',
      version: '1.0.0',
      projects,
      tasks,
      sessions,
      journal,
      settings
    };
    exportToJson(backup, `devtrack-full-backup-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCsv = () => {
    exportSessionsToCsv(sessions, projects);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Settings & Preferences
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Configure your local development dashboard environment and export data.
        </p>
      </div>

      {savedMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'var(--success-subtle)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--success)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <Check size={18} /> Settings saved successfully in local browser storage!
        </div>
      )}

      {/* Local Storage Indicator Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--primary-subtle)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
        color: 'var(--primary-light)'
      }}>
        <Database size={18} />
        <div>
          <strong>Browser Local State:</strong> Settings and sample data are currently stored in your browser's Local Storage. Once you build your Express backend, these can be saved to your PostgreSQL database.
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Card */}
        <Card title="Developer Profile" subtitle="Your placeholder display identity in DevTrack" icon={User}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <Input
              label="Display Name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              required
            />
            <Input
              label="Engineering Role"
              value={formState.role}
              onChange={(e) => setFormState({ ...formState, role: e.target.value })}
            />
          </div>
        </Card>

        {/* Goals & Preferences */}
        <Card title="Productivity & Timer Goals" subtitle="Configure coding targets and session length" icon={Target}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <Input
              label="Weekly Coding Goal (Hours)"
              type="number"
              min="1"
              max="100"
              value={formState.weeklyGoalHours}
              onChange={(e) => setFormState({ ...formState, weeklyGoalHours: e.target.value })}
              helper="Used to calculate weekly completion ring on dashboard"
            />
            <Input
              label="Default Focus Session (Minutes)"
              type="number"
              min="5"
              max="180"
              value={formState.defaultTimerMinutes}
              onChange={(e) => setFormState({ ...formState, defaultTimerMinutes: e.target.value })}
              helper="Standard Pomodoro or focus chunk duration"
            />
          </div>
        </Card>

        {/* Appearance & Theme */}
        <Card title="Theme & Appearance" subtitle="Switch between dark and light modes">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Active Theme</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Current: {settings.theme === 'dark' ? 'Dark Mode (Deep navy & charcoal)' : 'Light Mode'}
              </p>
            </div>
            <Button variant="secondary" onClick={toggleTheme} icon={settings.theme === 'dark' ? Sun : Moon}>
              Switch to {settings.theme === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </Card>

        {/* Save button */}
        <div>
          <Button type="submit" variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Data Export / Backup Card */}
      <Card title="Data Export & Backup" subtitle="Download your local development history and sessions" icon={Download}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Export Full JSON Database</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Download all projects, tasks, sessions, and journal entries in a single JSON file.
              </p>
            </div>
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportAllJson}>
              Export JSON
            </Button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Export Coding Sessions CSV</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Spreadsheet-friendly export of all logged coding sessions and durations.
              </p>
            </div>
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCsv}>
              Export CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
