/**
 * DevTrack - Minimal Mock Data
 * Used only when the backend server is unreachable.
 * Kept strictly isolated from the real API integration layer.
 */

export const INITIAL_MOCK_PROJECTS = [
  {
    id: 'proj-1',
    name: 'DevTrack Web App',
    description: 'Personal web application to track software development activities and tasks.',
    status: 'In Progress'
  },
  {
    id: 'proj-2',
    name: 'Portfolio Revamp',
    description: 'Modernizing personal developer portfolio with responsive design and case studies.',
    status: 'Planning'
  },
  {
    id: 'proj-3',
    name: 'CLI Tool for Git Analytics',
    description: 'A lightweight Node.js command-line tool for commit history visualization.',
    status: 'Completed'
  }
];

export const INITIAL_MOCK_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Initialize React Frontend with Vite',
    description: 'Scaffold project structure, plain CSS stylesheets, and core navigation views.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-10-18'
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Implement REST API Endpoints',
    description: 'Build projects and tasks CRUD endpoints in Express.js with Supabase PostgreSQL.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-10-22'
  },
  {
    id: 'task-3',
    projectId: 'proj-2',
    title: 'Design Wireframes & Color Palette',
    description: 'Create low-fidelity wireframes and pick accessible typography and color schemes.',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2026-10-25'
  },
  {
    id: 'task-4',
    projectId: 'proj-3',
    title: 'Publish NPM Package',
    description: 'Verify package build, generate documentation, and publish to npm registry.',
    status: 'Completed',
    priority: 'Low',
    dueDate: '2026-10-15'
  }
];
