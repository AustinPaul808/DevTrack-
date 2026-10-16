import React from 'react';

export default function Dashboard({ projects, tasks, setActiveTab }) {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  const getProjectName = (projectId) => {
    const proj = projects.find((p) => p.id === projectId);
    return proj ? proj.name : 'Unassigned';
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-info';
      case 'Pending':
      case 'Planning':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Projects</h3>
          <div className="metric-val">{totalProjects}</div>
        </div>
        <div className="metric-card">
          <h3>Total Tasks</h3>
          <div className="metric-val">{totalTasks}</div>
        </div>
        <div className="metric-card">
          <h3>In Progress</h3>
          <div className="metric-val" style={{ color: 'var(--info)' }}>
            {inProgressTasks}
          </div>
        </div>
        <div className="metric-card">
          <h3>Pending</h3>
          <div className="metric-val" style={{ color: 'var(--warning)' }}>
            {pendingTasks}
          </div>
        </div>
        <div className="metric-card">
          <h3>Completed</h3>
          <div className="metric-val" style={{ color: 'var(--success)' }}>
            {completedTasks}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            Active Projects Summary
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('projects')}>
            View All Projects &rarr;
          </button>
        </div>
        <div style={{ height: '12px' }}></div>
        {projects.length === 0 ? (
          <div className="empty-state">No projects created yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Linked Tasks</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((project) => {
                  const projectTasksCount = tasks.filter((t) => t.projectId === project.id).length;
                  return (
                    <tr key={project.id}>
                      <td><strong>{project.name}</strong></td>
                      <td>{project.description || '—'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{projectTasksCount} tasks</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            Recent Tasks
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tasks')}>
            Manage Tasks &rarr;
          </button>
        </div>
        <div style={{ height: '12px' }}></div>
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks recorded yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
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
