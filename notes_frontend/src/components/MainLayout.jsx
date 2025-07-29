import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// PUBLIC_INTERFACE
/**
 * Main layout structure for the app.
 * Arranges header at top, sidebar on the side, main content in the rest.
 */
function MainLayout({ user, onLogout, sidebar, children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header user={user} onLogout={onLogout} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar>{sidebar}</Sidebar>
        <main style={{
            flexGrow: 1,
            padding: '2rem',
            background: 'var(--bg-primary)',
            minHeight: 'calc(100vh - 60px)',
            overflow: 'auto'
          }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
