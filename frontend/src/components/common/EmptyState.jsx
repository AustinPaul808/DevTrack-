import React from 'react';
import Button from './Button';
import { FolderKanban } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your current filter or search criteria.',
  icon: Icon = FolderKanban,
  actionLabel,
  onAction
}) {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-card)',
      border: '1px dashed var(--border-default)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{
        background: 'var(--primary-subtle)',
        color: 'var(--primary-light)',
        padding: '16px',
        borderRadius: 'var(--radius-full)',
        marginBottom: '16px'
      }}>
        <Icon size={32} />
      </div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
