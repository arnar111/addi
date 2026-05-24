import { useState } from 'react'
import { useNotes } from '../hooks/useNotes'
import { Plus, Search, Pin, Trash2, Edit2, X, Check } from 'lucide-react'

const NOTE_COLORS = [
  { id: '', label: 'Sjálfgefið', bg: 'var(--surface)', border: 'var(--border)' },
  { id: 'yellow', label: 'Gulur', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)' },
  { id: 'green', label: 'Grænn', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
  { id: 'blue', label: 'Blár', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
  { id: 'purple', label: 'Fjólublár', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
  { id: 'pink', label: 'Bleikur', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
]

function getColorStyle(colorId) {
  return NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0]
}

function NoteCard({ note, onRemove, onPin, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title || '')
  const [text, setText] = useState(note.text)
  const [color, setColor] = useState(note.color || '')

  const save = () => {
    onUpdate(note.id, { title, text, color })
    setEditing(false)
  }

  const cs = getColorStyle(note.color)

  return (
    <div className="card flex flex-col gap-2"
         style={{ background: cs.bg, borderColor: note.pinned ? 'rgba(0,212,170,0.3)' : cs.border }}>
      {editing ? (
        <>
          <input className="input text-sm font-semibold" placeholder="Titill (valkvæmt)" value={title}
            onChange={e => setTitle(e.target.value)} />
          <textarea className="input resize-none text-sm leading-relaxed" rows={4} value={text}
            onChange={e => setText(e.target.value)} autoFocus />
          <div className="flex gap-1.5 flex-wrap">
            {NOTE_COLORS.map(c => (
              <button key={c.id} type="button" onClick={() => setColor(c.id)}
                className="w-5 h-5 rounded-full border-2 transition-all"
                style={{
                  background: c.id ? c.bg : 'var(--surface2)',
                  borderColor: color === c.id ? 'var(--accent)' : c.border,
                }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn btn-primary text-xs py-1.5 px-3"><Check size={12} /> Vista</button>
            <button onClick={() => { setTitle(note.title || ''); setText(note.text); setColor(note.color || ''); setEditing(false) }}
              className="btn btn-ghost text-xs py-1.5 px-3"><X size={12} /></button>
          </div>
        </>
      ) : (
        <>
          {note.title && <div className="font-semibold text-sm">{note.title}</div>}
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: note.title ? 'var(--muted)' : 'var(--text)' }}>
            {note.text}
          </p>
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
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [newColor, setNewColor] = useState('')
  const [showForm, setShowForm] = useState(false)

  const results = search(query)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newText.trim() && !newTitle.trim()) return
    add(newText, newTitle, newColor)
    setNewTitle('')
    setNewText('')
    setNewColor('')
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
          <input className="input font-semibold text-sm" placeholder="Titill (valkvæmt)"
            value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <textarea className="input resize-none text-sm" rows={4} placeholder="Skrifaðu minnisblað..."
            value={newText} onChange={e => setNewText(e.target.value)} autoFocus />
          <div className="flex items-center gap-2">
            <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>Litur:</span>
            <div className="flex gap-1.5">
              {NOTE_COLORS.map(c => (
                <button key={c.id} type="button" onClick={() => setNewColor(c.id)}
                  className="w-5 h-5 rounded-full border-2 transition-all"
                  style={{
                    background: c.id ? c.bg : 'var(--surface2)',
                    borderColor: newColor === c.id ? 'var(--accent)' : 'var(--border)',
                  }} />
              ))}
            </div>
          </div>
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
