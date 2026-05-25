import { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { Plus, Pin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function QuickNoteWidget() {
  const { notes, add } = useNotes()
  const [text, setText] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    add(text)
    setText('')
  }

  const recent = notes.slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Skýringar</h3>
        <Link to="/notes" className="text-xs" style={{ color: 'var(--accent)' }}>Sjá allt</Link>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          className="input text-sm"
          placeholder="Skjót minnismiði..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
          <Plus size={16} />
        </button>
      </form>

      {recent.length === 0 ? (
        <p className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Engar skýringar enn</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {recent.map(n => (
            <div key={n.id} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              {n.pinned && <Pin size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />}
              <p className="text-sm line-clamp-2 leading-snug flex-1">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
