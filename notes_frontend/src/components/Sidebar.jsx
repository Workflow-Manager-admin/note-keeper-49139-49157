import React from 'react';

// PUBLIC_INTERFACE
/**
 * Sidebar component for filters/search/categories on the notes app.
 */
function Sidebar({ children }) {
  // Just render children from parent. Remove stubs.
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
      {children}
    </aside>
  );
}

export default Sidebar;
