import { USE_MOCK_DATA, apiRequest } from './apiConfig';
import { INITIAL_JOURNAL } from '../mocks/initialData';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY = 'devtrack_journal';

function getLocalJournal() {
  return getStoredItem(STORAGE_KEY, INITIAL_JOURNAL);
}

function saveLocalJournal(entries) {
  setStoredItem(STORAGE_KEY, entries);
}

export const journalService = {
  /**
   * GET /api/journal
   */
  async getEntries(filter = {}) {
    if (USE_MOCK_DATA) {
      let list = getLocalJournal();
      if (filter.projectId) {
        list = list.filter(j => j.projectId === filter.projectId);
      }
      if (filter.tag) {
        list = list.filter(j => (j.tags || []).includes(filter.tag));
      }
      return list;
    }
    const params = new URLSearchParams(filter).toString();
    return apiRequest(`/journal${params ? `?${params}` : ''}`);
  },

  /**
   * POST /api/journal
   */
  async createEntry(entryData) {
    if (USE_MOCK_DATA) {
      const list = getLocalJournal();
      const newEntry = {
        ...entryData,
        id: `journal-${Date.now()}`,
        tags: entryData.tags || [],
        createdAt: new Date().toISOString()
      };
      const updated = [newEntry, ...list];
      saveLocalJournal(updated);
      return newEntry;
    }
    return apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(entryData)
    });
  },

  /**
   * PATCH /api/journal/:id
   */
  async updateEntry(id, updates) {
    if (USE_MOCK_DATA) {
      const list = getLocalJournal();
      const idx = list.findIndex(j => j.id === id);
      if (idx === -1) throw new Error('Journal entry not found');
      const updated = { ...list[idx], ...updates };
      list[idx] = updated;
      saveLocalJournal([...list]);
      return updated;
    }
    return apiRequest(`/journal/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  /**
   * DELETE /api/journal/:id
   */
  async deleteEntry(id) {
    if (USE_MOCK_DATA) {
      const list = getLocalJournal();
      const filtered = list.filter(j => j.id !== id);
      saveLocalJournal(filtered);
      return { success: true, id };
    }
    return apiRequest(`/journal/${id}`, {
      method: 'DELETE'
    });
  }
};
