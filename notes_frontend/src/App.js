import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import MainLayout from './components/MainLayout';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';

import { useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';

// --- Notes Page: Handles note CRUD, search, UI states ---
function NotesPage({ user, token }) {
  const { get, post, put, del } = useApi(token);
  // Note state
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [editing, setEditing] = useState(false); // mode: 'create' or 'edit'
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notes list (with search)
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.q = search;
      const data = await get('/notes', params);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [get, search]);

  // Initial and on search change
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle note selection
  const handleSelect = note => {
    setSelectedNote(note);
    setEditing(false);
  };

  // Handle note create (open form)
  const handleNew = () => {
    setSelectedNote(null);
    setEditing('create');
  };

  // Handle edit
  const handleEdit = note => {
    setSelectedNote(note);
    setEditing('edit');
  };

  // Handle delete
  const handleDelete = async note => {
    if (!window.confirm('Delete this note?')) return;
    setLoading(true);
    setError(null);
    try {
      await del(`/notes/${note.id}`);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form save (create or update)
  const handleSave = async values => {
    setLoadingSave(true);
    setError(null);
    try {
      if (editing === 'create') {
        await post('/notes', {
          title: values.title,
          content: values.content,
        });
      } else if (editing === 'edit' && selectedNote) {
        await put(`/notes/${selectedNote.id}`, {
          title: values.title,
          content: values.content,
        });
      }
      setEditing(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  // Search bar in sidebar
  const sidebar = (
    <div>
      <input
        type="search"
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.4rem',
          borderRadius: 4,
          border: '1px solid var(--border-color)',
          marginBottom: 12,
          marginTop: 6,
        }}
        aria-label="Search notes"
      />
      <button
        style={{
          width: '100%',
          padding: '0.5rem',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 0,
          borderRadius: 5,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 12,
        }}
        onClick={handleNew}
        disabled={loading || editing === 'create'}
      >
        + New Note
      </button>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 14 }}>
        {notes.length} note{notes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );

  // Main content area (list/preview/form)
  let mainContent;
  if (editing === 'create' || (editing === 'edit' && selectedNote)) {
    mainContent = (
      <NoteForm
        note={editing === 'edit' ? selectedNote : null}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
        loading={loadingSave}
      />
    );
  } else if (selectedNote) {
    // Preview mode
    mainContent = (
      <div style={{
        background: 'var(--bg-secondary)',
        padding: 24,
        borderRadius: 10,
        maxWidth: 550,
        margin: 'auto'
      }}>
        <h2>{selectedNote.title}</h2>
        <div style={{
          color: '#888',
          fontSize: 13,
          marginBottom: 10
        }}>{new Date(selectedNote.updated_at).toLocaleString()}</div>
        <div style={{ marginBottom: 18, minHeight: 80 }}>{selectedNote.content}</div>
        <button
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 0,
            borderRadius: 5,
            padding: '0.5rem 1.3rem',
            marginRight: 10,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => handleEdit(selectedNote)}
        >
          Edit
        </button>
        <button
          style={{
            background: '#C92121',
            color: '#fff',
            border: 0,
            borderRadius: 5,
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
          onClick={() => handleDelete(selectedNote)}
        >
          Delete
        </button>
        <button
          style={{
            marginLeft: 14,
            color: '#888',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedNote(null)}
        >
          Back to list
        </button>
      </div>
    );
  } else {
    // Note list
    mainContent = (
      <NoteList
        notes={notes}
        onSelect={handleSelect}
        selectedNoteId={selectedNote?.id || null}
        loading={loading}
      />
    );
  }

  return (
    <MainLayout
      user={user}
      onLogout={() => {
        // Remove session, reload to clear state
        window.location.reload();
      }}
      sidebar={sidebar}
    >
      {error && <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>}
      {mainContent}
    </MainLayout>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const { user, login, logout, token } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Wire up login to the backend and error/loading states
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await login(email, password);
      // Navigation is handled by router/user state change
    } catch (e) {
      setAuthError(e.message || "Failed to login");
    }
    setAuthLoading(false);
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : (
                <LoginForm
                  onLogin={handleLogin}
                  loading={authLoading}
                  error={authError}
                />
              )
            }
          />
          <Route
            path="/*"
            element={
              user ? (
                <NotesPage user={user} token={token} />
              ) : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
