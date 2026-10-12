import React from 'react';

export default function Badge({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
  className = '',
  icon: Icon
}) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
