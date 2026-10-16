import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import {
  fetchProjects,
  createProject,
  deleteProject,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  getApiBaseUrl
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isMockData, setIsMockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = getApiBaseUrl();

  // Load projects and tasks on initial render
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [projRes, taskRes] = await Promise.all([
          fetchProjects(),
          fetchTasks()
        ]);

        setProjects(projRes.data || []);
        setTasks(taskRes.data || []);
        setIsMockData(Boolean(projRes.isMock || taskRes.isMock));
      } catch (err) {
        console.error('Failed to load DevTrack data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handlers for Project actions
  const handleAddProject = async (projectData) => {
    const res = await createProject(projectData);
    if (res.data) {
      setProjects((prev) => [res.data, ...prev]);
      if (res.isMock !== undefined) setIsMockData(res.isMock);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const res = await deleteProject(projectId);
    if (res.data && res.data.success) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
      if (res.isMock !== undefined) setIsMockData(res.isMock);
    }
  };

  // Handlers for Task actions
  const handleAddTask = async (taskData) => {
    const res = await createTask(taskData);
    if (res.data) {
      setTasks((prev) => [res.data, ...prev]);
      if (res.isMock !== undefined) setIsMockData(res.isMock);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    const res = await updateTask(taskId, updates);
    if (res.data) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      if (res.isMock !== undefined) setIsMockData(res.isMock);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const res = await deleteTask(taskId);
    if (res.data && res.data.success) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (res.isMock !== undefined) setIsMockData(res.isMock);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMockData={isMockData}
        baseUrl={baseUrl}
      />

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading DevTrack workspace...</div>
        </div>
      ) : (
        <main>
          {activeTab === 'dashboard' && (
            <Dashboard
              projects={projects}
              tasks={tasks}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <Projects
              projects={projects}
              tasks={tasks}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeTab === 'tasks' && (
            <Tasks
              projects={projects}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </main>
      )}
    </div>
  );
}
