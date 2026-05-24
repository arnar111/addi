import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, Flame, X, Check } from 'lucide-react'

const PRESET_ICONS = ['🏋️', '🏃', '📚', '💧', '🌶️', '🧘', '💻', '✍️', '🎵', '🛌', '🥗', '🧠']
const PRESET_COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#22c55e', '#ef4444', '#eab308', '#ec4899']

function HabitRow({ habit, onToggle, onRemove, isDone, streak }) {
  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ borderColor: isDone ? habit.color + '44' : 'var(--border)', background: isDone ? `${habit.color}08` : 'var(--surface)' }}>
      <button onClick={() => onToggle(habit.id)}
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-lg transition-all"
        style={{ background: isDone ? `${habit.color}22` : 'var(--surface2)', border: `2px solid ${isDone ? habit.color : 'var(--border)'}` }}>
        {isDone ? <Check size={14} style={{ color: habit.color }} /> : habit.icon}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{habit.name}</div>
        {isDone && <div className="text-xs mt-0.5" style={{ color: habit.color }}>Lokið í dag</div>}
      </div>
      {streak > 0 && (
        <span className="flex items-center gap-0.5 text-xs font-semibold shrink-0" style={{ color: '#f97316' }}>
          <Flame size={13} />{streak} daga
        </span>
      )}
      <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
        {habit.completions.length} alls
      </span>
      <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)', padding: 4 }}>
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const allDone = todayDone === habits.length && habits.length > 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag
            {allDone && habits.length > 0 && ' 🎉'}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="card-sm flex flex-col gap-2">
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${Math.round((todayDone / habits.length) * 100)}%`, background: allDone ? '#22c55e' : 'var(--accent)' }} />
          </div>
          <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
            {Math.round((todayDone / habits.length) * 100)}%
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr vani</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input text-sm" placeholder="Nafn vana..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="text-xl w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: icon === i ? 'rgba(0,212,170,0.15)' : 'var(--surface2)', border: icon === i ? '1px solid var(--accent)' : '1px solid transparent' }}>
                  {i}
                </button>
              ))}
              <input className="input text-center w-9 h-9 text-xl p-0" value={icon}
                onChange={e => setIcon(e.target.value)} style={{ borderRadius: 12 }} />
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{ background: c, outline: color === c ? `2px solid white` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-3">⭐</div>
          <div className="text-sm">Engir vanur ennþá</div>
          <div className="text-xs mt-1">Bættu við fyrsta vananum þínum</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map(h => (
            <HabitRow
              key={h.id}
              habit={h}
              onToggle={toggle}
              onRemove={remove}
              isDone={isDoneToday(h.id)}
              streak={streakFor(h.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
