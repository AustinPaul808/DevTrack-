/**
 * API Configuration & Backend Integration Guide
 * 
 * -------------------------------------------------------------------------
 * DEVELOPER INSTRUCTIONS FOR EXPRESS BACKEND INTEGRATION:
 * -------------------------------------------------------------------------
 * 1. When your Express server is ready (e.g. running on port 5000), set:
 *    `USE_MOCK_DATA = false`
 * 2. Configure `VITE_API_URL` in a `.env` file (e.g., `VITE_API_URL=http://localhost:5000/api`)
 * 3. All service methods in `projectsService.js`, `tasksService.js`, etc.
 *    already include the matching Express fetch signatures ready to uncomment.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Toggle this to false to test live Express endpoints
export const USE_MOCK_DATA = true;

/**
 * Common fetch helper with JSON headers and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}
