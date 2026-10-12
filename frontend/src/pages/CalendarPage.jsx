import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { formatDuration, formatDate, formatDateTime } from '../utils/formatters';

export default function CalendarPage() {
  const { sessions, projects } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Days in month calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Group sessions by Date string (YYYY-MM-DD)
  const sessionsByDate = sessions.reduce((acc, s) => {
    const d = new Date(s.startedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  // Monthly statistics
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthSessions = sessions.filter(s => {
    const d = new Date(s.startedAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
  const monthTotalSeconds = monthSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const activeDaysCount = Object.keys(sessionsByDate).filter(k => k.startsWith(currentMonthPrefix)).length;

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Intensity color map
  const getIntensityLevel = (seconds) => {
    if (!seconds || seconds <= 0) return 0;
    const hours = seconds / 3600;
    if (hours < 1) return 1;
    if (hours < 2.5) return 2;
    if (hours < 4) return 3;
    return 4;
  };

  const intensityColors = [
    'var(--bg-surface)',               // 0: none
    'rgba(99, 102, 241, 0.25)',        // 1: low
    'rgba(99, 102, 241, 0.50)',        // 2: medium
    'rgba(99, 102, 241, 0.75)',        // 3: high
    '#6366F1'                          // 4: maximum
  ];

  // Selected day details
  const selectedDaySessions = selectedDay ? (sessionsByDate[selectedDay] || []) : [];
  const selectedDayTotalSeconds = selectedDaySessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Activity Calendar
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            GitHub-style activity heatmap and monthly development session calendar.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="secondary" size="sm" icon={ChevronLeft} onClick={prevMonth}>
            Previous
          </Button>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', minWidth: '130px', textAlign: 'center' }}>
            {monthName}
          </span>
          <Button variant="secondary" size="sm" icon={ChevronRight} onClick={nextMonth}>
            Next
          </Button>
        </div>
      </div>

      {/* Month Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Coding Time</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{formatDuration(monthTotalSeconds)}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{monthSessions.length} total sessions</span>
        </Card>
        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Coding Days</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{activeDaysCount} days</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consistent habit building</span>
        </Card>
        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Average</p>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>
            {activeDaysCount > 0 ? (monthTotalSeconds / 3600 / activeDaysCount).toFixed(1) : 0} hrs/active day
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Focused deep work</span>
        </Card>
      </div>

      {/* Monthly Interactive Calendar Grid */}
      <Card>
        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <span key={d} style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: '85px', opacity: 0.2 }} />
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDaysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const daySessions = sessionsByDate[dateStr] || [];
            const daySeconds = daySessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
            const level = getIntensityLevel(daySeconds);

            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDay(dateStr)}
                style={{
                  height: '85px',
                  background: intensityColors[level],
                  border: isToday ? '2px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s, border-color 0.15s',
                  position: 'relative'
                }}
                title={`${dateStr}: ${formatDuration(daySeconds)} (${daySessions.length} sessions)`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: isToday ? '800' : '600',
                    color: isToday ? 'var(--primary-light)' : 'var(--text-primary)'
                  }}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 4px', borderRadius: '4px' }}>
                      Today
                    </span>
                  )}
                </div>

                {daySessions.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: '700', color: level === 4 ? '#FFFFFF' : 'var(--text-primary)' }}>
                      {formatDuration(daySeconds)}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: level === 4 ? '#E0E7FF' : 'var(--text-secondary)' }}>
                      {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Heatmap Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Less</span>
          {intensityColors.map((color, idx) => (
            <div
              key={idx}
              style={{
                width: '14px',
                height: '14px',
                backgroundColor: color,
                borderRadius: '3px',
                border: '1px solid var(--border-subtle)'
              }}
            />
          ))}
          <span>More activity</span>
        </div>
      </Card>

      {/* Day Details Modal */}
      <Modal
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        title={`Activity on ${selectedDay ? formatDate(selectedDay) : ''}`}
        footer={
          <Button variant="secondary" onClick={() => setSelectedDay(null)}>
            Close
          </Button>
        }
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Coding Time</p>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                {formatDuration(selectedDayTotalSeconds)}
              </h4>
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sessions Recorded</p>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {selectedDaySessions.length}
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedDaySessions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                No coding sessions recorded for this day.
              </p>
            ) : (
              selectedDaySessions.map(s => {
                const proj = projects.find(p => p.id === s.projectId);
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', color: proj?.color || 'var(--text-primary)' }}>
                        {proj?.name || s.projectId}
                      </span>
                      <Badge variant="primary">{formatDuration(s.durationSeconds)}</Badge>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {s.note || 'No notes entered'}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Logged at {formatDateTime(s.startedAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
