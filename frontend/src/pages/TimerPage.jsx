import React, { useState } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Calendar,
  FileText,
  Trash2,
  Download,
  CheckCircle,
  FolderGit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { formatTimerDisplay, formatDate, formatDateTime, formatDuration } from '../utils/formatters';
import { exportSessionsToCsv } from '../utils/exportData';

export default function TimerPage() {
  const { projects, sessions, deleteSession } = useApp();
  const {
    timerState,
    elapsedSeconds,
    activeProject,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateActiveNote,
    updateActiveProject
  } = useTimer();

  // Local setup state for when idle
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [workNote, setWorkNote] = useState('');
  const [historyProjectFilter, setHistoryProjectFilter] = useState('all');

  const isRunning = timerState.status === 'running';
  const isPaused = timerState.status === 'paused';
  const isIdle = timerState.status === 'idle';

  const handleStart = () => {
    startTimer(selectedProjectId || projects[0]?.id, workNote);
    setWorkNote('');
  };

  const handleStopAndSave = async () => {
    await stopTimer();
  };

  // Filter history
  const filteredSessions = sessions.filter(s => {
    if (historyProjectFilter === 'all') return true;
    return s.projectId === historyProjectFilter;
  });

  const totalFilteredDuration = filteredSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Coding Timer
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Track deep work sessions with background-safe timestamps and recovery.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => exportSessionsToCsv(sessions, projects)}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Large Timer Display Card */}
      <Card style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-glow)'
      }}>
        {/* Status indicator badge */}
        <div style={{ marginBottom: '16px' }}>
          <Badge
            variant={isRunning ? 'success' : isPaused ? 'warning' : 'neutral'}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            {isRunning ? '● Session in Progress' : isPaused ? '❚❚ Session Paused' : 'Ready to Code'}
          </Badge>
        </div>

        {/* Large Digital Clock Face */}
        <div style={{ margin: '16px 0 24px' }}>
          <h1
            className="mono"
            style={{
              fontSize: '4.5rem',
              fontWeight: '800',
              letterSpacing: '0.04em',
              color: isRunning ? 'var(--primary-light)' : 'var(--text-primary)',
              textShadow: isRunning ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
              lineHeight: 1
            }}
          >
            {formatTimerDisplay(elapsedSeconds)}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            HH : MM : SS
          </p>
        </div>

        {/* Project & Note Setup or Live Status */}
        {isIdle ? (
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            textAlign: 'left'
          }}>
            <Select
              label="Select Project to Track"
              value={selectedProjectId || (projects[0]?.id || '')}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
            />

            <Input
              label="Session Work Note"
              placeholder="What are you building or solving? (e.g. Refactor checkout API)"
              value={workNote}
              onChange={(e) => setWorkNote(e.target.value)}
            />
          </div>
        ) : (
          <div style={{
            maxWidth: '480px',
            margin: '0 auto 28px',
            padding: '14px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary-light)' }}>
              Project: {activeProject?.name || 'Unassigned'}
            </p>
            {timerState.note && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Note: "{timerState.note}"
              </p>
            )}
          </div>
        )}

        {/* Big Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          {isIdle && (
            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={handleStart}
              style={{ padding: '14px 36px', fontSize: '1.1rem' }}
            >
              Start Session
            </Button>
          )}

          {isRunning && (
            <>
              <Button
                variant="secondary"
                size="lg"
                icon={Pause}
                onClick={pauseTimer}
                style={{ padding: '14px 28px' }}
              >
                Pause
              </Button>
              <Button
                variant="danger"
                size="lg"
                icon={Square}
                onClick={handleStopAndSave}
                style={{ padding: '14px 28px' }}
              >
                Stop & Save Session
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={resumeTimer}
                style={{ padding: '14px 28px' }}
              >
                Resume Session
              </Button>
              <Button
                variant="danger"
                size="lg"
                icon={Square}
                onClick={handleStopAndSave}
                style={{ padding: '14px 28px' }}
              >
                End & Save
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Session History Section */}
      <Card
        title={`Session History (${filteredSessions.length})`}
        subtitle={`Total logged: ${formatDuration(totalFilteredDuration)}`}
        action={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={historyProjectFilter}
              onChange={(e) => setHistoryProjectFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px' }}
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        }
      >
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <th style={{ padding: '12px' }}>PROJECT</th>
                <th style={{ padding: '12px' }}>DATE & TIME</th>
                <th style={{ padding: '12px' }}>DURATION</th>
                <th style={{ padding: '12px' }}>NOTE / FOCUS</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No sessions logged yet for this project filter.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(s => {
                  const proj = projects.find(p => p.id === s.projectId);

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: proj?.color || 'var(--text-primary)' }}>
                        {proj?.name || s.projectId}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {formatDateTime(s.startedAt)}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Badge variant="primary">
                          {formatDuration(s.durationSeconds)}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                        {s.note || <span style={{ color: 'var(--text-muted)' }}>No note</span>}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSession(s.id)}
                          style={{ color: 'var(--danger)' }}
                          title="Delete session"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
