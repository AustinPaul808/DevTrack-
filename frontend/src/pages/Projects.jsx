import React, { useState } from 'react';

export default function Projects({ projects, tasks, onAddProject, onDeleteProject }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Project name is required');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await onAddProject({
        name: name.trim(),
        description: description.trim(),
        status
      });
      setName('');
      setDescription('');
      setStatus('Planning');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (projStatus) => {
    switch (projStatus) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-info';
      case 'Planning':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div>
      {/* Create Project Form */}
      <div className="card">
        <h2 className="card-title">Create New Project</h2>
        {errorMessage && (
          <div style={{ color: 'var(--danger)', marginBottom: '12px', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="project-name">Project Name *</label>
              <input
                id="project-name"
                className="form-control"
                type="text"
                placeholder="e.g. Mobile App Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project-status">Status</label>
              <select
                id="project-status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                className="form-control"
                placeholder="Brief project details, objectives, or goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Project'}
          </button>
        </form>
      </div>

      {/* Projects List */}
      <div className="card">
        <h2 className="card-title">All Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            No projects available. Create your first project using the form above.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Tasks Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const projectTasks = tasks.filter((t) => t.projectId === project.id);
                  return (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                      </td>
                      <td>{project.description || '—'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{projectTasks.length} tasks</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm(`Delete project "${project.name}" and associated tasks?`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
