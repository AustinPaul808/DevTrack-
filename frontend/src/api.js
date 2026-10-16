/**
 * DevTrack API Client
 * 
 * Configurable backend base URL read from VITE_API_URL.
 * 
 * ============================================================================
 * EXPECTED BACKEND ENDPOINTS SPECIFICATION
 * ============================================================================
 * 
 * 1. Projects:
 *    - GET    /projects
 *             Response: Array of project objects
 *             Example: [ { id: "1", name: "DevTrack", description: "...", status: "In Progress" } ]
 * 
 *    - POST   /projects
 *             Body: { name: string, description: string, status: string }
 *             Response: Created project object { id: "...", name: "...", description: "...", status: "..." }
 * 
 *    - DELETE /projects/:id
 *             Response: { success: true, message: "Project deleted" }
 * 
 * 2. Tasks:
 *    - GET    /tasks
 *             Response: Array of task objects
 *             Example: [ { id: "1", projectId: "1", title: "...", description: "...", status: "Pending", priority: "High", dueDate: "YYYY-MM-DD" } ]
 * 
 *    - POST   /tasks
 *             Body: { projectId: string, title: string, description: string, status: string, priority: string, dueDate: string }
 *             Response: Created task object
 * 
 *    - PUT    /tasks/:id
 *             Body: Partial or full task object { title?, description?, status?, priority?, dueDate?, projectId? }
 *             Response: Updated task object
 * 
 *    - DELETE /tasks/:id
 *             Response: { success: true, message: "Task deleted" }
 * 
 * ============================================================================
 * FALLBACK BEHAVIOR:
 * When the backend is offline or requests fail (e.g. backend not yet started),
 * this helper falls back to isolated temporary mock data to demonstrate the UI.
 * ============================================================================
 */

import { INITIAL_MOCK_PROJECTS, INITIAL_MOCK_TASKS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:3000';

// Fallback in-memory state if backend is offline
let mockProjects = [...INITIAL_MOCK_PROJECTS];
let mockTasks = [...INITIAL_MOCK_TASKS];
let backendAvailable = null; // null: untested, true: online, false: offline

export const getApiBaseUrl = () => BASE_URL;

export const getBackendStatus = () => ({
  isOnline: backendAvailable === true,
  isTested: backendAvailable !== null,
  baseUrl: BASE_URL
});

/**
 * Generic request helper with automatic fallback to mock data
 */
async function request(endpoint, options = {}, mockFallbackFn) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    backendAvailable = true;
    return { data, isMock: false };
  } catch (error) {
    console.warn(`[DevTrack API] Live request to ${url} failed (${error.message}). Using fallback mock data.`);
    backendAvailable = false;
    const fallbackData = await mockFallbackFn();
    return { data: fallbackData, isMock: true, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// PROJECT API ENDPOINTS
// ---------------------------------------------------------------------------

export async function fetchProjects() {
  return request('/projects', { method: 'GET' }, async () => {
    return [...mockProjects];
  });
}

export async function createProject(project) {
  return request(
    '/projects',
    {
      method: 'POST',
      body: JSON.stringify(project)
    },
    async () => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: project.name,
        description: project.description || '',
        status: project.status || 'Planning'
      };
      mockProjects = [newProject, ...mockProjects];
      return newProject;
    }
  );
}

export async function deleteProject(id) {
  return request(
    `/projects/${id}`,
    {
      method: 'DELETE'
    },
    async () => {
      mockProjects = mockProjects.filter((p) => p.id !== id);
      mockTasks = mockTasks.filter((t) => t.projectId !== id);
      return { success: true, id };
    }
  );
}

// ---------------------------------------------------------------------------
// TASK API ENDPOINTS
// ---------------------------------------------------------------------------

export async function fetchTasks() {
  return request('/tasks', { method: 'GET' }, async () => {
    return [...mockTasks];
  });
}

export async function createTask(task) {
  return request(
    '/tasks',
    {
      method: 'POST',
      body: JSON.stringify(task)
    },
    async () => {
      const newTask = {
        id: `task-${Date.now()}`,
        projectId: task.projectId || '',
        title: task.title,
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || ''
      };
      mockTasks = [newTask, ...mockTasks];
      return newTask;
    }
  );
}

export async function updateTask(id, updates) {
  return request(
    `/tasks/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates)
    },
    async () => {
      let updatedTask = null;
      mockTasks = mockTasks.map((t) => {
        if (t.id === id) {
          updatedTask = { ...t, ...updates };
          return updatedTask;
        }
        return t;
      });
      return updatedTask;
    }
  );
}

export async function deleteTask(id) {
  return request(
    `/tasks/${id}`,
    {
      method: 'DELETE'
    },
    async () => {
      mockTasks = mockTasks.filter((t) => t.id !== id);
      return { success: true, id };
    }
  );
}
