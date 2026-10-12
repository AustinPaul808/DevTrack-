import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatDuration } from '../utils/formatters';

export default function ProjectsPage() {
  const { projects, tasks, sessions, addProject, deleteProject } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal & Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    status: 'in-progress',
    targetDate: '',
    color: '#6366F1'
  });
  const [formErrors, setFormErrors] = useState({});

  // Client validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.description.trim()) errors.description = 'Please provide a short description';
    if (!formData.technologies.trim()) errors.technologies = 'Enter at least one technology (comma separated)';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await addProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      technologies: techArray,
      status: formData.status,
      targetDate: formData.targetDate || null,
      color: formData.color
    });

    setIsCreateOpen(false);
    setFormData({
      name: '',
      description: '',
      technologies: '',
      status: 'in-progress',
      targetDate: '',
      color: '#6366F1'
    });
    setFormErrors({});
  };

  // Filter & sort
  let filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Projects
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Manage repositories, track milestones, and inspect coding time.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>
          New Project
        </Button>
      </div>

      {/* Filter and Control Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-card)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            width: '100%',
            maxWidth: '320px'
          }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="all">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects List / Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search query or status filter, or create a brand new project."
          actionLabel="Create Project"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((p) => {
            const projectTasks = tasks.filter(t => t.projectId === p.id);
            const completedCount = projectTasks.filter(t => t.status === 'completed').length;
            const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;
            const projectSessions = sessions.filter(s => s.projectId === p.id);
            const totalDuration = projectSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

            return (
              <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: p.color || 'var(--primary)'
                        }}
                      />
                      <Link to={`/projects/${p.id}`} style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {p.name}
                      </Link>
                    </div>
                    <Badge variant={p.status === 'completed' ? 'success' : p.status === 'in-progress' ? 'primary' : 'neutral'}>
                      {p.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                    {p.description}
                  </p>

                  {/* Tech stack */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {(p.technologies || []).map(tech => (
                      <span
                        key={tech}
                        style={{
                          fontSize: '0.74rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Progress bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Tasks: {completedCount}/{projectTasks.length}</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: p.color || 'var(--primary)',
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Card footer metrics & actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{formatDuration(totalDuration)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(p)}
                        style={{ color: 'var(--danger)', padding: '6px' }}
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </Button>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="secondary" size="sm" icon={ExternalLink}>
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '12px' }}>PROJECT</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                  <th style={{ padding: '12px' }}>TASKS</th>
                  <th style={{ padding: '12px' }}>CODING TIME</th>
                  <th style={{ padding: '12px' }}>CREATED</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const projectTasks = tasks.filter(t => t.projectId === p.id);
                  const completedCount = projectTasks.filter(t => t.status === 'completed').length;
                  const projectSessions = sessions.filter(s => s.projectId === p.id);
                  const totalDuration = projectSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <Link to={`/projects/${p.id}`} style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {p.name}
                        </Link>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.description}</p>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <Badge variant={p.status === 'completed' ? 'success' : p.status === 'in-progress' ? 'primary' : 'neutral'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>
                        {completedCount}/{projectTasks.length}
                      </td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>
                        {formatDuration(totalDuration)}
                      </td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {formatDate(p.createdAt)}
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <Link to={`/projects/${p.id}`}>
                            <Button variant="ghost" size="sm">Open</Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(p)}
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSubmit}>
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <Input
            label="Project Name"
            placeholder="e.g. Distributed Task Queue"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div className="form-group">
            <label className="form-label">
              Description <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              rows={3}
              className={`form-textarea ${formErrors.description ? 'border-danger' : ''}`}
              placeholder="Brief overview of project goals and scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {formErrors.description && <span className="form-error">{formErrors.description}</span>}
          </div>

          <Input
            label="Technologies"
            placeholder="e.g. React, TypeScript, GraphQL, Docker"
            helper="Comma separated list of libraries and tools"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            error={formErrors.technologies}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'in-progress', label: 'In Progress' },
                { value: 'planning', label: 'Planning' },
                { value: 'completed', label: 'Completed' }
              ]}
            />

            <Input
              label="Target Completion Date"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label className="form-label">Project Accent Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'].map(color => (
                <div
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    outline: formData.color === color ? '3px solid #FFFFFF' : 'none',
                    outlineOffset: '2px'
                  }}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteProject(deleteTarget.id);
        }}
        title={`Delete "${deleteTarget?.name}"?`}
        message="Deleting this project will also delete all associated tasks in the local state. Are you sure you want to proceed?"
        confirmText="Delete Project"
      />
    </div>
  );
}
