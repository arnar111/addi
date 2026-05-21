import { useState } from 'react'
import { useNotes } from '../hooks/useNotes'
import { Plus, Search, Pin, Trash2, Edit2, X, Check } from 'lucide-react'

function NoteCard({ note, onRemove, onPin, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(note.text)

  const save = () => {
    onUpdate(note.id, text)
    setEditing(false)
  }

  return (
    <div className="card flex flex-col gap-2" style={{ borderColor: note.pinned ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
      {editing ? (
        <>
          <textarea className="input resize-none text-sm leading-relaxed" rows={4} value={text}
            onChange={e => setText(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <button onClick={save} className="btn btn-primary text-xs py-1.5 px-3"><Check size={12} /> Vista</button>
            <button onClick={() => { setText(note.text); setEditing(false) }} className="btn btn-ghost text-xs py-1.5 px-3"><X size={12} /></button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
          <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(note.updatedAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex gap-1">
              <button onClick={() => onPin(note.id)} style={{ color: note.pinned ? 'var(--accent)' : 'var(--muted)', padding: 4 }}>
                <Pin size={13} />
              </button>
              <button onClick={() => setEditing(true)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Edit2 size={13} />
              </button>
              <button onClick={() => onRemove(note.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Notes() {
  const { notes, add, update, remove, pin, search } = useNotes()
  const [query, setQuery] = useState('')
  const [newText, setNewText] = useState('')
  const [showForm, setShowForm] = useState(false)

  const results = search(query)

  const handleAdd = (e) => {
    e.preventDefault()
    add(newText)
    setNewText('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Minnisblöð</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{notes.length} minnisblöð</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýtt
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <textarea className="input resize-none text-sm" rows={4} placeholder="Skrifaðu minnisblað..."
            value={newText} onChange={e => setNewText(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">Vista</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost"><X size={16} /></button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input className="input pl-9 text-sm" placeholder="Leita í minnisblöðum..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {results.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          {query ? 'Engar niðurstöður' : 'Engin minnisblöð enn'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map(n => (
            <NoteCard key={n.id} note={n} onRemove={remove} onPin={pin} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  )
}
