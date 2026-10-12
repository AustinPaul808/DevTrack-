/**
 * Mock Datasets for DevTrack
 * 
 * NOTE FOR BACKEND DEVELOPER:
 * These data models reflect the expected JSON contracts when your Express API
 * and PostgreSQL database are connected.
 */

export const INITIAL_PROJECTS = [
  {
    id: "project-1",
    name: "DevTrack SaaS",
    description: "Developer productivity and time management dashboard with analytics and code journal.",
    technologies: ["React", "Vite", "Node.js", "Express", "PostgreSQL"],
    status: "in-progress",
    color: "#6366F1",
    targetDate: "2026-11-15",
    createdAt: "2026-10-01T10:00:00.000Z"
  },
  {
    id: "project-2",
    name: "E-Commerce Microservices",
    description: "High-throughput checkout service with inventory synchronization and Redis caching.",
    technologies: ["Go", "Docker", "Redis", "Kafka", "PostgreSQL"],
    status: "in-progress",
    color: "#06B6D4",
    targetDate: "2026-12-01",
    createdAt: "2026-09-15T14:30:00.000Z"
  },
  {
    id: "project-3",
    name: "CLI Deployment Utility",
    description: "Cross-platform command-line tool for automated staging rollouts and health probes.",
    technologies: ["Rust", "Clap", "Tokio"],
    status: "completed",
    color: "#10B981",
    targetDate: "2026-10-05",
    createdAt: "2026-08-20T08:00:00.000Z"
  },
  {
    id: "project-4",
    name: "Personal Portfolio & Blog",
    description: "Responsive personal portfolio showcasing open-source contributions and technical writings.",
    technologies: ["Next.js", "Tailwind CSS", "MDX"],
    status: "planning",
    color: "#F59E0B",
    targetDate: "2026-10-30",
    createdAt: "2026-10-08T11:20:00.000Z"
  }
];

export const INITIAL_TASKS = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Implement responsive dashboard sidebar & navigation",
    description: "Ensure smooth mobile drawer and desktop collapse states with active route indicators.",
    priority: "high",
    status: "completed",
    dueDate: "2026-10-12",
    estimatedMinutes: 90,
    createdAt: "2026-10-10T09:00:00.000Z"
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Build client-side coding timer with background-safe timestamps",
    description: "Use performance timestamps to prevent interval throttling when tab is inactive.",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-10-14",
    estimatedMinutes: 120,
    createdAt: "2026-10-10T11:00:00.000Z"
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Design Recharts coding activity bar and area charts",
    description: "Add interactive tooltips, gradients, and weekly/monthly filter controls.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-10-16",
    estimatedMinutes: 60,
    createdAt: "2026-10-11T13:30:00.000Z"
  },
  {
    id: "task-4",
    projectId: "project-2",
    title: "Optimize Redis inventory checkout lock",
    description: "Benchmark distributed mutex lock under high concurrent traffic simulation.",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-10-15",
    estimatedMinutes: 180,
    createdAt: "2026-10-09T16:00:00.000Z"
  },
  {
    id: "task-5",
    projectId: "project-2",
    title: "Setup Prometheus metrics scraping for order latency",
    description: "Expose /metrics endpoint in checkout service and configure scrape interval.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-10-18",
    estimatedMinutes: 75,
    createdAt: "2026-10-11T10:15:00.000Z"
  },
  {
    id: "task-6",
    projectId: "project-3",
    title: "Add ANSI colored error outputs to CLI arguments parser",
    description: "Refactor terminal outputs to highlight missing configuration flags with clear examples.",
    priority: "low",
    status: "completed",
    dueDate: "2026-10-04",
    estimatedMinutes: 45,
    createdAt: "2026-10-02T14:00:00.000Z"
  },
  {
    id: "task-7",
    projectId: "project-4",
    title: "Draft system architecture blog post",
    description: "Write comprehensive breakdown of building full-stack reactive apps with Node and PostgreSQL.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-10-22",
    estimatedMinutes: 120,
    createdAt: "2026-10-12T08:00:00.000Z"
  }
];

export const INITIAL_SESSIONS = [
  {
    id: "session-1",
    projectId: "project-1",
    startedAt: "2026-10-12T09:15:00.000Z",
    endedAt: "2026-10-12T11:45:00.000Z",
    durationSeconds: 9000, // 2.5 hrs
    note: "Designed and implemented modern layout shell, theme tokens, and routing"
  },
  {
    id: "session-2",
    projectId: "project-2",
    startedAt: "2026-10-12T14:00:00.000Z",
    endedAt: "2026-10-12T15:30:00.000Z",
    durationSeconds: 5400, // 1.5 hrs
    note: "Tested Redis distributed locking edge cases under network partitions"
  },
  {
    id: "session-3",
    projectId: "project-1",
    startedAt: "2026-10-11T10:00:00.000Z",
    endedAt: "2026-10-11T13:30:00.000Z",
    durationSeconds: 12600, // 3.5 hrs
    note: "Crafted interactive tasks kanban board and list view filters"
  },
  {
    id: "session-4",
    projectId: "project-1",
    startedAt: "2026-10-10T16:00:00.000Z",
    endedAt: "2026-10-10T19:00:00.000Z",
    durationSeconds: 10800, // 3.0 hrs
    note: "Integrated coding timer local storage persistence and controls"
  },
  {
    id: "session-5",
    projectId: "project-2",
    startedAt: "2026-10-09T09:30:00.000Z",
    endedAt: "2026-10-09T13:00:00.000Z",
    durationSeconds: 12600, // 3.5 hrs
    note: "Configured Kafka message consumer retry backoffs"
  },
  {
    id: "session-6",
    projectId: "project-3",
    startedAt: "2026-10-08T11:00:00.000Z",
    endedAt: "2026-10-08T14:00:00.000Z",
    durationSeconds: 10800, // 3.0 hrs
    note: "Packaged binary release and created automated GitHub Action workflow"
  },
  {
    id: "session-7",
    projectId: "project-1",
    startedAt: "2026-10-07T13:00:00.000Z",
    endedAt: "2026-10-07T17:00:00.000Z",
    durationSeconds: 14400, // 4.0 hrs
    note: "Setup project structure, API contracts, and PRD specifications"
  },
  {
    id: "session-8",
    projectId: "project-2",
    startedAt: "2026-10-06T15:00:00.000Z",
    endedAt: "2026-10-06T18:00:00.000Z",
    durationSeconds: 10800, // 3.0 hrs
    note: "Benchmarked order creation API response times"
  }
];

export const INITIAL_JOURNAL = [
  {
    id: "journal-1",
    projectId: "project-1",
    title: "Designing for Future Express & PostgreSQL Integration",
    content: "Structured all frontend state mutations behind clean asynchronous service layers (`src/services/`). This allows me to seamlessly replace the mock local data with `fetch()` calls to my Express backend without touching a single component!",
    tags: ["learning", "architecture"],
    createdAt: "2026-10-12T17:00:00.000Z"
  },
  {
    id: "journal-2",
    projectId: "project-2",
    title: "Debugging Distributed Concurrency in Redis",
    content: "Identified a race condition where two concurrent checkout requests were updating stock simultaneously. Resolved it by leveraging Lua scripts for atomic decrement operations in Redis. Latency dropped to sub-5ms.",
    tags: ["bug-fix", "performance"],
    createdAt: "2026-10-09T14:45:00.000Z"
  },
  {
    id: "journal-3",
    projectId: "project-1",
    title: "Mastering Browser Background Timer Precision",
    content: "When users switch tabs, `setInterval` frequency is reduced by browsers to conserve CPU. Switched the timer calculation logic to compare against a saved start timestamp (`Date.now()`), guaranteeing accurate elapsed duration even when inactive.",
    tags: ["learning", "feature"],
    createdAt: "2026-10-07T19:30:00.000Z"
  },
  {
    id: "journal-4",
    projectId: "project-3",
    title: "Reflections on CLI Developer Experience",
    content: "Polishing CLI error messages makes an enormous difference. Clean flag descriptions and colorized output significantly reduce developer cognitive load.",
    tags: ["reflection"],
    createdAt: "2026-10-05T12:00:00.000Z"
  }
];

export const INITIAL_USER_SETTINGS = {
  name: "Alex Rivera",
  role: "Full-Stack Engineer",
  avatarUrl: "",
  theme: "dark",
  weeklyGoalHours: 20,
  defaultTimerMinutes: 25,
  autoStartBreaks: false,
  soundNotifications: true,
  desktopNotifications: false,
  isMockMode: true
};
