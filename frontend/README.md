# DevTrack — Frontend

DevTrack is a modern, developer productivity dashboard built with React, Vite, Lucide Icons, and Recharts.

This frontend is designed for independent learning: it is completely functional and interactive right out of the box using client-side mock data and browser `localStorage`, with an architectural service layer structured for seamless integration with an Express.js & PostgreSQL backend.

---

## 🚀 Quick Start

### 1. Install Dependencies
Inside the `/frontend` directory:
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 📂 Project Architecture

```
frontend/
├── index.html                 # App HTML root with fonts & favicon
├── vite.config.js             # Vite build configuration
├── package.json               # Dependencies (React 18, React Router, Recharts, Lucide)
├── src/
│   ├── main.jsx               # App entry point (Providers & Router mount)
│   ├── App.jsx                # Route definitions & layout composition
│   ├── styles/
│   │   ├── theme.css          # Design tokens & CSS variables (colors, radii, shadows)
│   │   ├── components.css     # Buttons, Cards, Badges, Modals, Forms
│   │   ├── layout.css         # Sidebar, Topbar, and responsive drawer styles
│   │   └── index.css          # Global resets and utility classes
│   ├── context/
│   │   ├── AppContext.jsx     # Global state (Projects, Tasks, Journal, Settings)
│   │   └── TimerContext.jsx   # Timestamp-accurate coding timer with refresh recovery
│   ├── services/              # ⭐️ BACKEND INTEGRATION LAYER (See below)
│   │   ├── apiConfig.js       # Base API URL and USE_MOCK_DATA toggle
│   │   ├── projectsService.js # Projects CRUD operations
│   │   ├── tasksService.js    # Tasks CRUD & status toggles
│   │   ├── sessionsService.js # Coding sessions persistence
│   │   ├── analyticsService.js# Productivity trends & streak calculations
│   │   └── journalService.js  # Developer reflection notes
│   ├── mocks/
│   │   └── initialData.js     # Default mock dataset matching future SQL shapes
│   ├── components/
│   │   ├── layout/            # Sidebar, TopNavbar, MainLayout
│   │   └── common/            # Button, Card, Badge, Modal, ConfirmDialog, Input, Select, EmptyState
│   ├── pages/
│   │   ├── DashboardPage.jsx  # Overview metrics, charts, focus tasks, goal ring
│   │   ├── ProjectsPage.jsx   # Projects grid/list, filters, creation modal
│   │   ├── ProjectDetailPage.jsx # Project overview, task list, session history
│   │   ├── TasksPage.jsx      # Kanban board & list view, priority filters
│   │   ├── TimerPage.jsx      # Digital timer with start/pause/stop and CSV export
│   │   ├── CalendarPage.jsx   # Monthly heatmap and daily session inspector
│   │   ├── AnalyticsPage.jsx  # Productivity metrics & Recharts visual trends
│   │   ├── JournalPage.jsx    # Developer engineering logs & tag filtering
│   │   └── SettingsPage.jsx   # Theme toggle, goals, and JSON/CSV backup
│   └── utils/
│       ├── formatters.js      # Dates, durations (Xh Ym, HH:MM:SS)
│       ├── storage.js         # Safe localStorage wrapper
│       └── exportData.js      # JSON and CSV export helpers
```

---

## 🔌 How to Connect Your Future Express.js Backend

When you build your Express server inside `/backend` (e.g. running on port `5000`), you do **not** need to touch any UI components!

All data access is encapsulated in `src/services/`.

### Step 1: Switch from Mock Data to Real API
Open `src/services/apiConfig.js`:
```javascript
// Change this:
export const USE_MOCK_DATA = false;
```
Or set `VITE_API_URL=http://localhost:5000/api` in a `.env` file in `/frontend`.

### Step 2: Implement the Express API Endpoints
The services anticipate the following Express routes:

#### 1. Projects (`projectsService.js`)
- `GET /api/projects` — Fetch list of all projects
- `GET /api/projects/:id` — Fetch single project by ID
- `POST /api/projects` — Create a project `{ name, description, technologies, status, targetDate, color }`
- `PATCH /api/projects/:id` — Update project fields
- `DELETE /api/projects/:id` — Delete project

#### 2. Tasks (`tasksService.js`)
- `GET /api/tasks` — Fetch tasks (supports query param `?projectId=...`)
- `POST /api/tasks` — Create a task `{ projectId, title, description, priority, status, dueDate, estimatedMinutes }`
- `PATCH /api/tasks/:id` — Update status (`todo`, `in-progress`, `completed`) or details
- `DELETE /api/tasks/:id` — Delete a task

#### 3. Coding Sessions (`sessionsService.js`)
- `GET /api/sessions` — Fetch logged sessions
- `POST /api/sessions` — Record a session `{ projectId, startedAt, endedAt, durationSeconds, note }`
- `DELETE /api/sessions/:id` — Delete a session

#### 4. Developer Journal (`journalService.js`)
- `GET /api/journal` — Fetch journal entries
- `POST /api/journal` — Save an entry `{ title, content, projectId, tags }`
- `PATCH /api/journal/:id` — Edit an entry
- `DELETE /api/journal/:id` — Remove an entry

---

## 🎯 Suggested First Backend Learning Task
Start simple:
1. In your `/backend`, create a `GET /api/projects` endpoint that returns a test JSON array of projects.
2. In `/backend`, enable CORS (`npm install cors` and `app.use(cors())`).
3. Set `USE_MOCK_DATA = false` in `src/services/apiConfig.js`.
4. Open the DevTrack Dashboard in your browser and watch the React frontend display your real Express backend data!
