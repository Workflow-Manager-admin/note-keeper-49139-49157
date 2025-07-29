import React from 'react';

// PUBLIC_INTERFACE
/**
 * NoteList component.
 * Displays a list/grid of notes and allows selection.
 */
function NoteList({ notes, onSelect, selectedNoteId, loading }) {
  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (!notes?.length) {
    return <div style={{ color: 'var(--text-secondary)' }}>No notes yet.</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelect?.(note)}
          style={{
            minWidth: 220,
            cursor: 'pointer',
            padding: 18,
            background: selectedNoteId === note.id ? '#f7e9dd' : 'var(--bg-secondary)',
            border: selectedNoteId === note.id ? '2px solid var(--button-bg)' : '1px solid var(--border-color)',
            borderRadius: 8,
          }}
        >
          <div style={{fontWeight:'bold', fontSize:17, color:'var(--text-primary)'}}>{note.title}</div>
          <div style={{margin:'8px 0', color: 'var(--text-secondary)'}}>{note.content.slice(0, 80)}{note.content.length > 80 ? ' ...' : ''}</div>
          <div style={{fontSize:12, color:'#998'}}>{(new Date(note.updated_at)).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
