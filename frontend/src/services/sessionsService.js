import { USE_MOCK_DATA, apiRequest } from './apiConfig';
import { INITIAL_SESSIONS } from '../mocks/initialData';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY = 'devtrack_sessions';

function getLocalSessions() {
  return getStoredItem(STORAGE_KEY, INITIAL_SESSIONS);
}

function saveLocalSessions(sessions) {
  setStoredItem(STORAGE_KEY, sessions);
}

export const sessionsService = {
  /**
   * GET /api/sessions
   */
  async getSessions(filter = {}) {
    if (USE_MOCK_DATA) {
      let list = getLocalSessions();
      if (filter.projectId) {
        list = list.filter(s => s.projectId === filter.projectId);
      }
      return list;
    }
    const params = new URLSearchParams(filter).toString();
    return apiRequest(`/sessions${params ? `?${params}` : ''}`);
  },

  /**
   * Record a completed session
   * POST /api/sessions or POST /api/sessions/:id/stop
   */
  async createSession(sessionData) {
    if (USE_MOCK_DATA) {
      const list = getLocalSessions();
      const newSession = {
        ...sessionData,
        id: `session-${Date.now()}`,
        startedAt: sessionData.startedAt || new Date().toISOString(),
        endedAt: sessionData.endedAt || new Date().toISOString(),
        durationSeconds: Math.max(1, Math.round(sessionData.durationSeconds || 0))
      };
      const updated = [newSession, ...list];
      saveLocalSessions(updated);
      return newSession;
    }
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  },

  /**
   * DELETE /api/sessions/:id
   */
  async deleteSession(id) {
    if (USE_MOCK_DATA) {
      const list = getLocalSessions();
      const filtered = list.filter(s => s.id !== id);
      saveLocalSessions(filtered);
      return { success: true, id };
    }
    return apiRequest(`/sessions/${id}`, {
      method: 'DELETE'
    });
  }
};
