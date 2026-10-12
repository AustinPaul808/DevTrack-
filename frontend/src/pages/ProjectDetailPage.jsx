import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Play,
  Plus,
  Trash2,
  Edit3,
  Archive,
  FolderGit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { formatDate, formatDuration, formatDateTime } from '../utils/formatters';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, sessions, updateProject, addTask, toggleTask, deleteTask, deleteProject } = useApp();
  const { startTimer } = useTimer();

  const project = projects.find(p => p.id === id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'in-progress'
  });

  // New task form state
  const [taskData, setTaskData] = useState({
    title: '',
    priority: 'medium',
    estimatedMinutes: 60,
    dueDate: ''
  });

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Project not found</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>The project ID does not exist in local data.</p>
        <Link to="/projects">
          <Button variant="primary" icon={ArrowLeft}>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'completed');
  const projectSessions = sessions.filter(s => s.projectId === project.id);
  const totalDuration = projectSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const progressPercent = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateProject(project.id, editData);
    setIsEditOpen(false);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    await addTask({
      projectId: project.id,
      title: taskData.title.trim(),
      priority: taskData.priority,
      status: 'todo',
      estimatedMinutes: Number(taskData.estimatedMinutes) || 60,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
    });

    setTaskData({ title: '', priority: 'medium', estimatedMinutes: 60, dueDate: '' });
    setIsTaskModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top back navigation & header */}
      <div>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: project.color || 'var(--primary)'
                }}
              />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{project.name}</h2>
              <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'primary' : 'neutral'}>
                {project.status}
              </Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '700px' }}>
              {project.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => {
                startTimer(project.id);
                navigate('/timer');
              }}
            >
              Start Timer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => {
                setEditData({
                  name: project.name,
                  description: project.description,
                  status: project.status
                });
                setIsEditOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Coding Time</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>{formatDuration(totalDuration)}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{projectSessions.length} recorded sessions</span>
        </Card>

        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tasks Progress</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>
            {completedTasks.length} / {projectTasks.length}
          </h3>
          <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', marginTop: '8px' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--primary)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created</p>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '4px' }}>{formatDate(project.createdAt)}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Target: {project.targetDate ? formatDate(project.targetDate) : 'Not specified'}
          </span>
        </Card>
      </div>

      {/* Main Grid: Project Tasks & Sessions */}
      <div className="dashboard-grid">
        {/* Project Tasks */}
        <div className="col-8">
          <Card
            title={`Project Tasks (${projectTasks.length})`}
            action={
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsTaskModalOpen(true)}>
                Add Task
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {projectTasks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px 0' }}>
                  No tasks added to this project yet.
                </p>
              ) : (
                projectTasks.map(t => (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={() => toggleTask(t.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                      <div>
                        <p style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                          color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}>
                          {t.title}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}>
                            {t.priority}
                          </Badge>
                          {t.dueDate && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Due {formatDate(t.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteTask(t.id)} style={{ color: 'var(--danger)' }}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Project Coding Sessions */}
        <div className="col-4">
          <Card title="Coding Sessions" subtitle="Recent tracked time">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {projectSessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>
                  No sessions recorded for this project yet.
                </p>
              ) : (
                projectSessions.slice(0, 6).map(s => (
                  <div
                    key={s.id}
                    style={{
                      padding: '10px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>
                        {formatDuration(s.durationSeconds)}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {formatDate(s.startedAt)}
                      </span>
                    </div>
                    {s.note && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {s.note}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Project Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            required
          />
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </div>
          <Select
            label="Status"
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            options={[
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'planning', label: 'Planning' }
            ]}
          />
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Project Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateTask}>Add Task</Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask}>
          <Input
            label="Task Title"
            placeholder="e.g. Implement authentication middleware"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="Priority"
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />
            <Input
              label="Due Date"
              type="date"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
