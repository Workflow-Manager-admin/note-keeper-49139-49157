import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * NoteForm component. Handles create and edit actions for notes.
 */
function NoteForm({ note, onSave, onCancel, loading }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), id: note?.id });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg-secondary)',
      padding: 28,
      borderRadius: 10,
      maxWidth: 480,
      margin: 'auto'
    }}>
      <h3>{note?.id ? 'Edit Note' : 'New Note'}</h3>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          maxLength={256}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            fontWeight: 600,
            fontSize: 17,
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <textarea
          placeholder="Write your note here..."
          value={content}
          required
          rows={7}
          onChange={e => setContent(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit',
            fontSize: 15,
          }}
        />
      </div>
      <div>
        <button type="submit" disabled={loading}
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 0,
            borderRadius: 5,
            padding: '0.6rem 1.6rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 10,
          }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}
          style={{
            background: '#999',
            color: '#fff',
            border: 0,
            borderRadius: 5,
            padding: '0.6rem 1.1rem',
            cursor: 'pointer',
          }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
