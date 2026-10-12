import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  return (
    <div className={`card ${className}`} onClick={onClick} {...props}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && (
              <h3 className="card-title">
                {Icon && <Icon size={18} className="text-accent" />}
                {title}
              </h3>
            )}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
