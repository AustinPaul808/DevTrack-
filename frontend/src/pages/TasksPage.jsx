import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Kanban,
  List,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  AlertCircle
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
import { formatDate } from '../utils/formatters';

export default function TasksPage() {
  const { tasks, projects, addTask, updateTask, toggleTask, deleteTask } = useApp();

  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    estimatedMinutes: 60
  });

  const openCreateModal = (initialStatus = 'todo') => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      priority: 'medium',
      status: initialStatus,
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 60
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId,
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      dueDate: task.dueDate || '',
      estimatedMinutes: task.estimatedMinutes || 60
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      await updateTask(editingTask.id, {
        ...formData,
        estimatedMinutes: Number(formData.estimatedMinutes) || 60
      });
    } else {
      await addTask({
        ...formData,
        estimatedMinutes: Number(formData.estimatedMinutes) || 60
      });
    }
    setIsModalOpen(false);
  };

  // Filter tasks
  let filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Sort tasks
  filteredTasks.sort((a, b) => {
    if (sortBy === 'dueDate') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    if (sortBy === 'priority') {
      const pMap = { high: 1, medium: 2, low: 3 };
      return (pMap[a.priority] || 4) - (pMap[b.priority] || 4);
    }
    if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const columns = [
    { id: 'todo', label: 'Todo', color: 'var(--text-muted)' },
    { id: 'in-progress', label: 'In Progress', color: 'var(--primary-light)' },
    { id: 'completed', label: 'Completed', color: 'var(--success)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Tasks
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Organize developer workflows, track priorities, and manage milestones.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => openCreateModal()}>
          New Task
        </Button>
      </div>

      {/* Filter and View Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            minWidth: '220px'
          }}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {viewMode === 'list' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '6px 10px' }}
            >
              <option value="all">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Created</option>
          </select>

          {/* View mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <Button
              variant={viewMode === 'board' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              title="Kanban Board View"
            >
              <Kanban size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content: Kanban or List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try modifying your filters or create a new task to get started."
          actionLabel="Create Task"
          onAction={() => openCreateModal()}
        />
      ) : viewMode === 'board' ? (
        /* Kanban Board View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start'
        }}>
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{col.label}</h4>
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--bg-surface)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-muted)'
                    }}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() => openCreateModal(col.id)}
                    aria-label={`Add task to ${col.label}`}
                  />
                </div>

                {/* Column Tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {columnTasks.map(t => {
                    const proj = projects.find(p => p.id === t.projectId);

                    return (
                      <div
                        key={t.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          transition: 'border-color 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.74rem', color: proj?.color || 'var(--text-muted)', fontWeight: '600' }}>
                            {proj?.name || 'Unassigned'}
                          </span>
                          <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}>
                            {t.priority}
                          </Badge>
                        </div>

                        <p style={{
                          fontSize: '0.88rem',
                          fontWeight: '600',
                          color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                          lineHeight: '1.3'
                        }}>
                          {t.title}
                        </p>

                        {t.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {t.description}
                          </p>
                        )}

                        {/* Status quick changer & meta footer */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            <span>{t.dueDate ? formatDate(t.dueDate) : 'No date'}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(t)}
                              style={{ padding: '4px' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(t)}
                              style={{ padding: '4px', color: 'var(--danger)' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </div>

                        {/* Quick status dropdown */}
                        <select
                          value={t.status}
                          onChange={(e) => updateTask(t.id, { status: e.target.value })}
                          className="form-select"
                          style={{ fontSize: '0.74rem', padding: '3px 6px', marginTop: '4px' }}
                        >
                          <option value="todo">Move to Todo</option>
                          <option value="in-progress">Move to In Progress</option>
                          <option value="completed">Move to Completed</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTasks.map(t => {
              const proj = projects.find(p => p.id === t.projectId);

              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
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
                        fontSize: '0.92rem',
                        fontWeight: '600',
                        textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                        color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>
                        {t.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.78rem' }}>
                        <span style={{ color: proj?.color || 'var(--text-muted)' }}>{proj?.name}</span>
                        <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'}>
                          {t.priority}
                        </Badge>
                        {t.dueDate && (
                          <span style={{ color: 'var(--text-muted)' }}>Due {formatDate(t.dueDate)}</span>
                        )}
                        <span style={{ color: 'var(--text-muted)' }}>~{t.estimatedMinutes}m est</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <select
                      value={t.status}
                      onChange={(e) => updateTask(t.id, { status: e.target.value })}
                      className="form-select"
                      style={{ width: 'auto', fontSize: '0.8rem', padding: '4px 8px' }}
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(t)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(t)} style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Create / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <Input
            label="Task Title"
            placeholder="e.g. Refactor API error handling"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Task details and acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="Associated Project"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />

            <Input
              label="Estimated Time (Minutes)"
              type="number"
              min="5"
              step="5"
              value={formData.estimatedMinutes}
              onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTask(deleteTarget.id);
        }}
        title={`Delete task "${deleteTarget?.title}"?`}
        message="Are you sure you want to delete this task? This cannot be undone."
      />
    </div>
  );
}
