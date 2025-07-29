import React from 'react';

// PUBLIC_INTERFACE
/**
 * Header component for the Note Keeper app.
 * Displays the app name, user info, and logout button.
 */
function Header({ user, onLogout }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      minHeight: '60px',
    }}>
      <div style={{ fontWeight: 600, fontSize: 22, color: 'var(--text-primary)'}}>
        📝 Note Keeper
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>{user.email}</span>
            <button onClick={onLogout} style={{background: 'var(--button-bg)', color: 'var(--button-text)', border:'none', borderRadius:5, padding:'0.5rem 1.2rem', cursor:'pointer'}}>Logout</button>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
