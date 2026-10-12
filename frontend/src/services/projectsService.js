import { API_BASE_URL, USE_MOCK_DATA, apiRequest } from './apiConfig';
import { INITIAL_PROJECTS } from '../mocks/initialData';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY = 'devtrack_projects';

function getLocalProjects() {
  return getStoredItem(STORAGE_KEY, INITIAL_PROJECTS);
}

function saveLocalProjects(projects) {
  setStoredItem(STORAGE_KEY, projects);
}

export const projectsService = {
  /**
   * GET /api/projects
   */
  async getProjects() {
    if (USE_MOCK_DATA) {
      return getLocalProjects();
    }
    return apiRequest('/projects');
  },

  /**
   * GET /api/projects/:id
   */
  async getProjectById(id) {
    if (USE_MOCK_DATA) {
      const list = getLocalProjects();
      const found = list.find(p => p.id === id);
      if (!found) throw new Error(`Project with ID ${id} not found`);
      return found;
    }
    return apiRequest(`/projects/${id}`);
  },

  /**
   * POST /api/projects
   */
  async createProject(projectData) {
    if (USE_MOCK_DATA) {
      const list = getLocalProjects();
      const newProject = {
        ...projectData,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updated = [newProject, ...list];
      saveLocalProjects(updated);
      return newProject;
    }
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  /**
   * PATCH /api/projects/:id
   */
  async updateProject(id, updates) {
    if (USE_MOCK_DATA) {
      const list = getLocalProjects();
      const idx = list.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Project not found');
      const updatedProject = { ...list[idx], ...updates };
      list[idx] = updatedProject;
      saveLocalProjects([...list]);
      return updatedProject;
    }
    return apiRequest(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  /**
   * DELETE /api/projects/:id
   */
  async deleteProject(id) {
    if (USE_MOCK_DATA) {
      const list = getLocalProjects();
      const filtered = list.filter(p => p.id !== id);
      saveLocalProjects(filtered);
      return { success: true, id };
    }
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};
