/**
 * Analytics calculation helpers (client-side transformations)
 * 
 * NOTE FOR BACKEND DEVELOPER:
 * When your Express backend is ready, you can move these aggregations
 * to an Express controller (e.g. GET /api/analytics) backed by SQL queries.
 */

import { sessionsService } from './sessionsService';
import { tasksService } from './tasksService';
import { projectsService } from './projectsService';

export const analyticsService = {
  async getAnalyticsData(daysRange = 7) {
    const [sessions, tasks, projects] = await Promise.all([
      sessionsService.getSessions(),
      tasksService.getTasks(),
      projectsService.getProjects()
    ]);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysRange);
    cutoffDate.setHours(0, 0, 0, 0);

    // Filter sessions within range
    const recentSessions = sessions.filter(s => new Date(s.startedAt) >= cutoffDate);

    // Total coding seconds
    const totalDurationSeconds = recentSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const totalHours = (totalDurationSeconds / 3600).toFixed(1);
    const averageDailyHours = (totalDurationSeconds / 3600 / daysRange).toFixed(1);

    // Coding hours by day of week / date
    const dayMap = {};
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      dayMap[key] = { label: dayName, fullDate: key, hours: 0, sessions: 0 };
    }

    recentSessions.forEach(s => {
      const sDate = new Date(s.startedAt);
      const key = sDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      if (dayMap[key]) {
        dayMap[key].hours += (s.durationSeconds || 0) / 3600;
        dayMap[key].sessions += 1;
      }
    });

    const dailyActivity = Object.values(dayMap).map(d => ({
      ...d,
      hours: Number(d.hours.toFixed(2))
    }));

    // Coding time by project
    const projectHoursMap = {};
    recentSessions.forEach(s => {
      projectHoursMap[s.projectId] = (projectHoursMap[s.projectId] || 0) + (s.durationSeconds || 0);
    });

    const projectBreakdown = projects.map(p => {
      const seconds = projectHoursMap[p.id] || 0;
      return {
        id: p.id,
        name: p.name,
        color: p.color || '#6366F1',
        hours: Number((seconds / 3600).toFixed(1)),
        percentage: totalDurationSeconds > 0 ? Math.round((seconds / totalDurationSeconds) * 100) : 0
      };
    }).filter(p => p.hours > 0 || projects.length <= 4);

    // Tasks completed
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(sessions);

    // Most productive day
    let bestDay = { label: 'None', hours: 0 };
    dailyActivity.forEach(d => {
      if (d.hours > bestDay.hours) {
        bestDay = d;
      }
    });

    return {
      totalHours: Number(totalHours),
      averageDailyHours: Number(averageDailyHours),
      dailyActivity,
      projectBreakdown,
      tasksCompletedCount: completedTasks.length,
      totalTasksCount: tasks.length,
      currentStreak,
      longestStreak,
      mostProductiveDay: bestDay.label
    };
  }
};

function calculateStreaks(sessions) {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique session date strings (YYYY-MM-DD)
  const dateSet = new Set(
    sessions.map(s => {
      const d = new Date(s.startedAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  let currentStreak = 0;
  let checkDate = new Date();

  // Check today or yesterday for active streak
  const todayStr = toDateStr(checkDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateStr(yesterday);

  if (dateSet.has(todayStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (dateSet.has(yesterdayStr)) {
    checkDate = yesterday;
  } else {
    return { currentStreak: 0, longestStreak: Math.max(1, dateSet.size) };
  }

  while (dateSet.has(toDateStr(checkDate))) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, 7)
  };
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
