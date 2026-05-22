import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { Plus, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f97316', low: '#22c55e' }

export default function QuickTasksWidget() {
  const { today, pending, add, toggle } = useTasks()
  const [input, setInput] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    add(input.trim())
    setInput('')
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Verkefni í dag</h3>
        <Link to="/tasks" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          {pending.length > 0 ? `${pending.length} eftir` : 'Sjá allt'} <ChevronRight size={12} />
        </Link>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="input text-sm"
          placeholder="Bæta við verkefni..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
          <Plus size={16} />
        </button>
      </form>

      {today.length === 0 ? (
        <p className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Engin verkefni í dag 🎉</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {today.map(t => (
            <li key={t.id} className="flex items-center gap-2.5 p-2 rounded-xl"
                style={{ background: 'var(--surface2)' }}>
              <button onClick={() => toggle(t.id)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: t.done ? 'var(--success)' : PRIORITY_COLOR[t.priority] || 'var(--border)',
                  background: t.done ? 'var(--success)' : 'transparent',
                }}>
                {t.done && <Check size={10} color="#000" />}
              </button>
              <span className="text-sm flex-1 truncate"
                    style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>
                {t.text}
              </span>
              <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: PRIORITY_COLOR[t.priority] || 'var(--muted)' }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
