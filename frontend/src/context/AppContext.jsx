import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsService } from '../services/projectsService';
import { tasksService } from '../services/tasksService';
import { sessionsService } from '../services/sessionsService';
import { journalService } from '../services/journalService';
import { INITIAL_USER_SETTINGS } from '../mocks/initialData';
import { getStoredItem, setStoredItem } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [journal, setJournal] = useState([]);
  const [settings, setSettings] = useState(() => getStoredItem('devtrack_settings', INITIAL_USER_SETTINGS));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize theme attribute on root HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings.theme]);

  // Load all initial state
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projData, taskData, sessData, jourData] = await Promise.all([
          projectsService.getProjects(),
          tasksService.getTasks(),
          sessionsService.getSessions(),
          journalService.getEntries()
        ]);
        setProjects(projData);
        setTasks(taskData);
        setSessions(sessData);
        setJournal(jourData);
      } catch (err) {
        console.error('Failed to load initial DevTrack data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Project operations
  const addProject = async (projectData) => {
    const created = await projectsService.createProject(projectData);
    setProjects(prev => [created, ...prev]);
    return created;
  };

  const updateProject = async (id, updates) => {
    const updated = await projectsService.updateProject(id, updates);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProject = async (id) => {
    await projectsService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    // Cascade remove related tasks locally
    setTasks(prev => prev.filter(t => t.projectId !== id));
  };

  // Task operations
  const addTask = async (taskData) => {
    const created = await tasksService.createTask(taskData);
    setTasks(prev => [created, ...prev]);
    return created;
  };

  const updateTask = async (id, updates) => {
    const updated = await tasksService.updateTask(id, updates);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };

  const toggleTask = async (id) => {
    const updated = await tasksService.toggleTaskStatus(id);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };

  const deleteTask = async (id) => {
    await tasksService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Session operations
  const addSession = async (sessionData) => {
    const created = await sessionsService.createSession(sessionData);
    setSessions(prev => [created, ...prev]);
    return created;
  };

  const deleteSession = async (id) => {
    await sessionsService.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Journal operations
  const addJournalEntry = async (entryData) => {
    const created = await journalService.createEntry(entryData);
    setJournal(prev => [created, ...prev]);
    return created;
  };

  const updateJournalEntry = async (id, updates) => {
    const updated = await journalService.updateEntry(id, updates);
    setJournal(prev => prev.map(j => j.id === id ? updated : j));
    return updated;
  };

  const deleteJournalEntry = async (id) => {
    await journalService.deleteEntry(id);
    setJournal(prev => prev.filter(j => j.id !== id));
  };

  // Settings
  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    setStoredItem('devtrack_settings', merged);
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const value = {
    projects,
    tasks,
    sessions,
    journal,
    settings,
    loading,
    searchQuery,
    setSearchQuery,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addSession,
    deleteSession,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    updateSettings,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
