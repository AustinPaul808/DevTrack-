import { USE_MOCK_DATA, apiRequest } from './apiConfig';
import { INITIAL_TASKS } from '../mocks/initialData';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY = 'devtrack_tasks';

function getLocalTasks() {
  return getStoredItem(STORAGE_KEY, INITIAL_TASKS);
}

function saveLocalTasks(tasks) {
  setStoredItem(STORAGE_KEY, tasks);
}

export const tasksService = {
  /**
   * GET /api/tasks
   */
  async getTasks(filter = {}) {
    if (USE_MOCK_DATA) {
      let list = getLocalTasks();
      if (filter.projectId) {
        list = list.filter(t => t.projectId === filter.projectId);
      }
      if (filter.status && filter.status !== 'all') {
        list = list.filter(t => t.status === filter.status);
      }
      return list;
    }
    const params = new URLSearchParams(filter).toString();
    return apiRequest(`/tasks${params ? `?${params}` : ''}`);
  },

  /**
   * POST /api/tasks
   */
  async createTask(taskData) {
    if (USE_MOCK_DATA) {
      const list = getLocalTasks();
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        createdAt: new Date().toISOString()
      };
      const updated = [newTask, ...list];
      saveLocalTasks(updated);
      return newTask;
    }
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * PATCH /api/tasks/:id
   */
  async updateTask(id, updates) {
    if (USE_MOCK_DATA) {
      const list = getLocalTasks();
      const idx = list.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Task not found');
      const updatedTask = { ...list[idx], ...updates };
      list[idx] = updatedTask;
      saveLocalTasks([...list]);
      return updatedTask;
    }
    return apiRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  /**
   * Toggle completed status quickly
   */
  async toggleTaskStatus(id) {
    const list = getLocalTasks();
    const task = list.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    return this.updateTask(id, { status: newStatus });
  },

  /**
   * DELETE /api/tasks/:id
   */
  async deleteTask(id) {
    if (USE_MOCK_DATA) {
      const list = getLocalTasks();
      const filtered = list.filter(t => t.id !== id);
      saveLocalTasks(filtered);
      return { success: true, id };
    }
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};
