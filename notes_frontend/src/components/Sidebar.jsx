import React from 'react';

// PUBLIC_INTERFACE
/**
 * Sidebar component for filters/search/categories on the notes app.
 */
function Sidebar({ children }) {
  return (
    <aside style={{
      width: 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      minHeight: 'calc(100vh - 60px)',
      padding: '1rem',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}>
      {children || (
        <div>
          {/* Placeholders for future search/filter controls */}
          <input
            type="search"
            placeholder="Search notes..."
            style={{
              width: '100%',
              padding: '0.4rem',
              borderRadius: 4,
              border: '1px solid var(--border-color)',
              marginBottom: 14,
              marginTop: 6,
            }}
          />
          <div style={{ color: 'var(--text-secondary)' }}>[Filters / Categories Here]</div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
