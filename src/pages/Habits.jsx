import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#ef4444', '#eab308']
const ICONS = ['🏋️', '📚', '💧', '🧘', '🚶', '🏃', '🚴', '🍎', '😴', '✍️', '🎯', '💊', '🧹', '📝', '🌅', '🎵', '🧠', '🛡️']

function HeatMap({ days }) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(28, 1fr)' }}>
      {days.map((d, i) => (
        <div key={i} className="rounded-sm aspect-square"
             style={{ background: d.done ? 'var(--accent)' : 'var(--surface2)', opacity: d.done ? 1 : 0.6 }}
             title={d.date} />
      ))}
    </div>
  )
}

function HabitRow({ habit, isDone, streak, last28, onToggle, onRemove }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card flex flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-center gap-3 p-3">
        <button onClick={() => onToggle(habit.id)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
          style={{
            background: isDone ? `${habit.color}22` : 'var(--surface2)',
            border: `2px solid ${isDone ? habit.color : 'transparent'}`,
          }}>
          {isDone ? <span className="text-base">✓</span> : habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{habit.name}</span>
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#f97316' }}>
                <Flame size={11} /> {streak}
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {isDone ? (
              <span style={{ color: habit.color }}>Lokið í dag</span>
            ) : (
              <span>Markmið: {habit.target}×/viku</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 rounded-lg transition-all"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            {expanded ? '−' : '28d'}
          </button>
          <button onClick={() => onRemove(habit.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-3 pb-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Síðustu 28 dagar</div>
          <HeatMap days={last28} />
        </div>
      )}
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, last28, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00d4aa')
  const [newTarget, setNewTarget] = useState(7)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add(newName.trim(), newIcon, newColor, newTarget)
    setNewName('')
    setNewIcon('⭐')
    setNewColor('#00d4aa')
    setNewTarget(7)
    setShowForm(false)
  }

  const totalDone = habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag · {totalDone} samtals
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Today progress bar */}
      <div className="card py-3">
        <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--muted)' }}>
          <span>Í dag</span>
          <span>{todayDone} af {habits.length}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{
                 width: habits.length ? `${(todayDone / habits.length) * 100}%` : '0%',
                 background: todayDone === habits.length && habits.length > 0 ? 'var(--success)' : 'var(--accent)',
               }} />
        </div>
        {todayDone === habits.length && habits.length > 0 && (
          <div className="text-xs text-center mt-2 font-medium" style={{ color: 'var(--success)' }}>
            Frábært! Allir vanir lokið í dag 🎉
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr vani</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn á vana..." value={newName}
                 onChange={e => setNewName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Táknmynd</div>
            <div className="grid grid-cols-9 gap-1.5">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setNewIcon(ic)}
                  className="h-8 rounded-lg text-base flex items-center justify-center transition-all"
                  style={{ background: newIcon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)', border: `1px solid ${newIcon === ic ? 'var(--accent)' : 'transparent'}` }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setNewColor(c)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{ background: c, outline: newColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>Markmið/viku:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <button key={n} type="button" onClick={() => setNewTarget(n)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: newTarget === n ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: newTarget === n ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${newTarget === n ? 'var(--accent)' : 'transparent'}`,
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Check size={14} /> Bæta við
          </button>
        </form>
      )}

      {/* Habit list */}
      <div className="flex flex-col gap-2">
        {habits.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            Engar vanir enn. Bættu við fyrsta vananum!
          </div>
        ) : habits.map(h => (
          <HabitRow key={h.id} habit={h}
            isDone={isDoneToday(h.id)}
            streak={streakFor(h.id)}
            last28={last28(h.id)}
            onToggle={toggle}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  )
}
