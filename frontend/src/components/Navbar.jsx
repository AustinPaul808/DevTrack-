import React from 'react';

export default function Navbar({ activeTab, setActiveTab, isMockData, baseUrl }) {
  return (
    <div>
      <header className="header">
        <div>
          <div className="brand-title">
            <span>💻</span> DevTrack
          </div>
          <div className="brand-subtitle">Developer Activity & Task Tracker</div>
        </div>

        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </nav>
      </header>

      {isMockData !== null && (
        <div className={`status-banner ${isMockData ? 'mock' : 'connected'}`}>
          {isMockData ? (
            <div>
              <strong>Mode: Temporary Mock Data</strong> — Backend server at <code>{baseUrl}</code> is unreachable.
              Interactive preview enabled.
            </div>
          ) : (
            <div>
              <strong>Mode: Connected</strong> — Live backend connected at <code>{baseUrl}</code>.
            </div>
          )}
          <span className={`badge ${isMockData ? 'badge-warning' : 'badge-success'}`}>
            {isMockData ? 'Fallback Mock' : 'Live API'}
          </span>
        </div>
      )}
    </div>
  );
}
