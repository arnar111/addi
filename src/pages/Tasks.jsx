import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { Plus, Trash2, Check, X, Edit2 } from 'lucide-react'
import { formatDateShort, isPast } from '../utils/time'

const PRIORITIES = ['high', 'medium', 'low']
const PRIORITY_LABEL = { high: 'Brýnt', medium: 'Miðlungs', low: 'Lágt' }
const PRIORITY_COLOR = { high: '#ef4444', medium: '#f97316', low: '#22c55e' }

function TaskItem({ task, onToggle, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(task.text)

  const save = () => {
    if (text.trim()) onUpdate(task.id, { text: text.trim() })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card flex items-center gap-2 py-2.5 animate-slide-up">
        <input className="input text-sm flex-1" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
          autoFocus />
        <button onClick={save} className="btn btn-primary py-1.5 px-3 text-xs shrink-0"><Check size={13} /></button>
        <button onClick={() => setEditing(false)} className="btn btn-ghost py-1.5 px-3 text-xs shrink-0"><X size={13} /></button>
      </div>
    )
  }

  return (
    <div className="card flex items-center gap-3 py-3 group"
         style={{ opacity: task.done ? 0.55 : 1 }}>
      <button onClick={() => onToggle(task.id)}
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: task.done ? 'var(--success)' : PRIORITY_COLOR[task.priority],
          background: task.done ? 'var(--success)' : 'transparent',
        }}>
        {task.done && <Check size={10} color="#000" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</p>
        {task.dueDate && (
          <p className="text-xs mt-0.5" style={{ color: isPast(task.dueDate) && !task.done ? 'var(--danger)' : 'var(--muted)' }}>
            {isPast(task.dueDate) && !task.done ? '⚠️ ' : ''}{formatDateShort(task.dueDate)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLOR[task.priority] }} />
        {!task.done && (
          <button onClick={() => setEditing(true)} style={{ color: 'var(--muted)', padding: 4 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 size={13} />
          </button>
        )}
        <button onClick={() => onRemove(task.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Tasks() {
  const { tasks, add, toggle, remove, update, clearDone, pending, done } = useTasks()
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    add(text.trim(), priority, dueDate || null)
    setText('')
    setPriority('medium')
    setDueDate('')
    setShowForm(false)
  }

  const filtered = filter === 'done' ? done
    : filter === 'high' ? pending.filter(t => t.priority === 'high')
    : pending

  const overdue = pending.filter(t => t.dueDate && isPast(t.dueDate))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Verkefni</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {pending.length} eftir{overdue.length > 0 ? ` · ${overdue.length} tímasett` : ''} · {done.length} lokið
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýtt
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <input className="input" placeholder="Lýsing verkefnis..." value={text} onChange={e => setText(e.target.value)} autoFocus />
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button key={p} type="button" onClick={() => setPriority(p)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: priority === p ? `${PRIORITY_COLOR[p]}22` : 'var(--surface2)',
                  color: priority === p ? PRIORITY_COLOR[p] : 'var(--muted)',
                  border: `1px solid ${priority === p ? PRIORITY_COLOR[p] + '44' : 'transparent'}`,
                }}>
                {PRIORITY_LABEL[p]}
              </button>
            ))}
          </div>
          <input type="date" className="input text-sm" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">Bæta við</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost"><X size={16} /></button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', 'Allt'], ['high', '🔴 Brýnt'], ['done', '✓ Lokið']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
        {done.length > 0 && filter !== 'done' && (
          <button onClick={clearDone} className="btn btn-ghost text-xs py-1.5 shrink-0"
                  style={{ color: 'var(--danger)' }}>
            <Trash2 size={12} /> Hreinsa lokið
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {filter === 'done' ? '🎉 Engin lokið verkefni' : '🎉 Engin verkefni'}
          </div>
        ) : filtered.map(t => (
          <TaskItem key={t.id} task={t} onToggle={toggle} onRemove={remove} onUpdate={update} />
        ))}
      </div>
    </div>
  )
}
