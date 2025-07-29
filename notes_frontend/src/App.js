import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import MainLayout from './components/MainLayout';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';

import { useAuth } from './hooks/useAuth';

function NotesPage({ user, token }) {
  // Stub notes list for main area.
  const dummyNotes = [
    { id: 1, title: "Welcome!", content: "Create your first note.", updated_at: new Date().toISOString() }
  ];
  return (
    <NoteList notes={dummyNotes} onSelect={() => {}} selectedNoteId={null} loading={false} />
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

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await login(email, password);
      // Navigation handled by router via user state
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
                <MainLayout user={user} onLogout={logout}>
                  <Routes>
                    <Route path="/" element={<NotesPage user={user} token={token} />} />
                    {/* <Route path="/note/:id" element={<NoteForm ... />} /> */}
                    {/* Add more routes as needed */}
                  </Routes>
                </MainLayout>
              ) : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
