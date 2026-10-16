import React, { useState } from 'react';

export default function Tasks({ projects, tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Task title is required');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await onAddTask({
        title: title.trim(),
        projectId: projectId || (projects[0] ? projects[0].id : ''),
        description: description.trim(),
        priority,
        status,
        dueDate
      });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProjectName = (projId) => {
    const proj = projects.find((p) => p.id === projId);
    return proj ? proj.name : 'Unassigned';
  };

  const getPriorityBadgeClass = (taskPriority) => {
    switch (taskPriority) {
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      case 'Low':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusBadgeClass = (taskStatus) => {
    switch (taskStatus) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-info';
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const matchProject = filterProject === 'ALL' || task.projectId === filterProject;
    const matchStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchProject && matchStatus;
  });

  return (
    <div>
      {/* Create Task Form */}
      <div className="card">
        <h2 className="card-title">Create New Task</h2>
        {errorMessage && (
          <div style={{ color: 'var(--danger)', marginBottom: '12px', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="task-title">Task Title *</label>
              <input
                id="task-title"
                className="form-control"
                type="text"
                placeholder="e.g. Implement user authentication"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-project">Assigned Project</label>
              <select
                id="task-project"
                className="form-control"
                value={projectId || (projects[0] ? projects[0].id : '')}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.length === 0 ? (
                  <option value="">(No Projects Available)</option>
                ) : (
                  projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="form-control"
                placeholder="Task details, requirements, or steps to complete..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Task Filters and List */}
      <div className="card">
        <h2 className="card-title">Tasks ({filteredTasks.length})</h2>

        <div className="filter-bar">
          <div>
            <label htmlFor="filter-project">Filter by Project: </label>
            <select
              id="filter-project"
              className="form-control"
              style={{ display: 'inline-block', width: 'auto', marginLeft: '6px' }}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status">Filter by Status: </label>
            <select
              id="filter-status"
              className="form-control"
              style={{ display: 'inline-block', width: 'auto', marginLeft: '6px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks matching current selection.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      {task.description && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td>{getProjectName(task.projectId)}</td>
                    <td>
                      <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td>{task.dueDate || '—'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        value={task.status}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Delete task "${task.title}"?`)) {
                              onDeleteTask(task.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
