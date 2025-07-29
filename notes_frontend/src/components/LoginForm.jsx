import React, { useState } from 'react';

// PUBLIC_INTERFACE
/**
 * LoginForm component for user login submission.
 */
function LoginForm({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 330, margin: '6rem auto', background: 'var(--bg-secondary)', padding: 32, borderRadius: 10 }}>
      <h2 style={{marginBottom:10}}>Sign In</h2>
      <div style={{ marginBottom: 18 }}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid var(--border-color)' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            placeholder="Password"
            required
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid var(--border-color)' }}
          />
        </label>
      </div>
      <button type="submit" disabled={loading} style={{background: 'var(--button-bg)', color: 'var(--button-text)', border: 0, borderRadius:5, padding:'0.7rem 1.5rem', fontWeight:600, cursor:'pointer'}}>
        {loading ? 'Signing in...' : 'Login'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: 12 }}>{error}</div>
      )}
    </form>
  );
}

export default LoginForm;
