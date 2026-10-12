import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Calendar,
  Trash2,
  Edit3,
  FolderGit2,
  Code
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

export default function JournalPage() {
  const { journal, projects, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useApp();

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: '',
    tags: 'learning'
  });

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      title: '',
      content: '',
      projectId: projects[0]?.id || '',
      tags: 'learning, architecture'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      projectId: entry.projectId || '',
      tags: (entry.tags || []).join(', ')
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingEntry) {
      await updateJournalEntry(editingEntry.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        projectId: formData.projectId || null,
        tags: tagsArray
      });
    } else {
      await addJournalEntry({
        title: formData.title.trim(),
        content: formData.content.trim(),
        projectId: formData.projectId || null,
        tags: tagsArray
      });
    }

    setIsModalOpen(false);
  };

  // Filter & sort
  let filtered = journal.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || j.projectId === projectFilter;
    const matchesTag = tagFilter === 'all' || (j.tags || []).includes(tagFilter);

    return matchesSearch && matchesProject && matchesTag;
  });

  filtered.sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const availableTags = ['learning', 'bug-fix', 'feature', 'reflection', 'architecture'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Developer Journal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Document bugs solved, architectural decisions, and daily engineering insights.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          New Journal Entry
        </Button>
      </div>

      {/* Filter and Search Bar */}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            minWidth: '240px'
          }}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search entries or insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

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

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
          >
            <option value="all">All Tags</option>
            {availableTags.map(t => (
              <option key={t} value={t}>#{t}</option>
            ))}
          </select>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select"
          style={{ width: 'auto', padding: '6px 10px' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Journal Entries List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No journal entries found"
          description="Record what you learned today, a difficult bug you solved, or an idea for your next feature."
          icon={BookOpen}
          actionLabel="Write an Entry"
          onAction={openCreateModal}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(entry => {
            const proj = projects.find(p => p.id === entry.projectId);

            return (
              <Card key={entry.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {entry.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {formatDate(entry.createdAt)}
                      </span>
                      {proj && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: proj.color }}>
                          <FolderGit2 size={13} />
                          {proj.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(entry)}>
                      <Edit3 size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(entry)}
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                <div style={{
                  padding: '12px 16px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-line'
                }}>
                  {entry.content}
                </div>

                {/* Tags footer */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {(entry.tags || []).map(tag => (
                    <Badge key={tag} variant="neutral">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Journal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
        maxWidth="640px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingEntry ? 'Save Entry' : 'Publish Entry'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <Input
            label="Title"
            placeholder="e.g. Learned how to prevent timer throttling in background tabs"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="Associated Project (Optional)"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={[
                { value: '', label: 'None (General note)' },
                ...projects.map(p => ({ value: p.id, label: p.name }))
              ]}
            />

            <Input
              label="Tags"
              placeholder="e.g. learning, bug-fix, architecture"
              helper="Comma separated"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label className="form-label">
              Reflection / Content <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              rows={8}
              className="form-textarea"
              placeholder="Write down what you built, what challenge you faced, how you solved it, or what you want to research next..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteJournalEntry(deleteTarget.id);
        }}
        title={`Delete "${deleteTarget?.title}"?`}
        message="Are you sure you want to delete this journal entry from your local records?"
      />
    </div>
  );
}
