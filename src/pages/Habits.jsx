import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Flame, Check, Calendar } from 'lucide-react'

const HABIT_COLORS = [
  '#00d4aa', '#8b5cf6', '#3b82f6', '#f97316',
  '#ef4444', '#22c55e', '#f59e0b', '#ec4899',
]

const HABIT_ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🎯', '✍️', '🎸', '🥗', '😴', '🌿', '🧹', '💊', '🚴', '🎨', '🏊']

function HabitCard({ habit, done, streak, onToggle, onRemove }) {
  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ border: done ? `1px solid ${habit.color}44` : undefined }}>
      <button
        onClick={() => onToggle(habit.id)}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
        style={{
          background: done ? `${habit.color}25` : 'var(--surface2)',
          border: `2px solid ${done ? habit.color : 'var(--border)'}`,
        }}>
        {done ? <Check size={18} style={{ color: habit.color }} strokeWidth={3} /> : habit.icon}
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{habit.name}</div>
        <div className="flex items-center gap-3 mt-0.5">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
              <Flame size={11} />
              {streak} {streak === 1 ? 'dagur' : streak < 5 ? 'dagar' : 'dagar'} streak
            </span>
          )}
          {done && (
            <span className="text-xs" style={{ color: habit.color }}>✓ Lokið í dag</span>
          )}
        </div>
      </div>

      <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)' }} className="shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function WeekView({ habit, isDoneToday }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const s = d.toISOString().split('T')[0]
    days.push({ dateStr: s, done: habit.completions.includes(s), isToday: i === 0 })
  }

  return (
    <div className="flex gap-1">
      {days.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full aspect-square rounded-lg"
            style={{
              background: day.done ? `${habit.color}55` : 'var(--surface2)',
              border: day.isToday ? `1px solid ${habit.color}` : '1px solid transparent',
            }}
          />
          <span style={{ fontSize: 9, color: 'var(--muted)' }}>
            {new Date(day.dateStr + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'short' }).slice(0, 2)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')
  const [showWeek, setShowWeek] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const completedToday = habits.filter(h => isDoneToday(h.id))
  const pendingToday = habits.filter(h => !isDoneToday(h.id))
  const allDone = habits.length > 0 && todayDone === habits.length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný venja
        </button>
      </div>

      {/* Progress */}
      {habits.length > 0 && (
        <div className="card" style={{
          background: allDone
            ? 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(34,197,94,0.08))'
            : 'linear-gradient(135deg, rgba(0,212,170,0.04), rgba(139,92,246,0.04))',
          border: allDone ? '1px solid rgba(0,212,170,0.3)' : undefined,
        }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">{allDone ? '🎉 Frábært! Allt lokið!' : 'Daglegur framgangur'}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {new Date().toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {Math.round((todayDone / habits.length) * 100)}%
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{
                   width: `${(todayDone / habits.length) * 100}%`,
                   background: allDone ? 'var(--success)' : 'var(--accent)',
                 }} />
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný venja</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-12 text-center text-xl" value={icon} onChange={e => setIcon(e.target.value)} style={{ padding: '8px 4px' }} />
            <input className="input flex-1" placeholder="Nafn venju" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          {/* Icon picker */}
          <div className="grid grid-cols-8 gap-1.5">
            {HABIT_ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => setIcon(ic)}
                className="aspect-square rounded-lg text-lg flex items-center justify-center transition-all"
                style={{ background: icon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)', border: `1px solid ${icon === ic ? 'var(--accent)' : 'transparent'}` }}>
                {ic}
              </button>
            ))}
          </div>
          {/* Color picker */}
          <div className="flex gap-2">
            {HABIT_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-all"
                style={{ background: c, border: `3px solid ${color === c ? 'white' : 'transparent'}`, outline: color === c ? `2px solid ${c}` : 'none' }} />
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Pending habits */}
      {pendingToday.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>Eftir í dag</div>
          {pendingToday.map(habit => (
            <div key={habit.id}>
              <HabitCard
                habit={habit}
                done={false}
                streak={streakFor(habit.id)}
                onToggle={toggle}
                onRemove={remove}
              />
              {showWeek === habit.id && (
                <div className="px-3 pb-3 -mt-1 card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                  <WeekView habit={habit} isDoneToday={isDoneToday} />
                </div>
              )}
              <button
                onClick={() => setShowWeek(v => v === habit.id ? null : habit.id)}
                className="w-full text-center text-xs py-0.5"
                style={{ color: 'var(--muted)' }}>
                <Calendar size={10} className="inline mr-1" />
                {showWeek === habit.id ? 'Loka' : 'Sjá viku'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed habits */}
      {completedToday.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>Lokið í dag ✓</div>
          {completedToday.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              done={true}
              streak={streakFor(habit.id)}
              onToggle={toggle}
              onRemove={remove}
            />
          ))}
        </div>
      )}

      {habits.length === 0 && (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🌱</div>
          <div className="text-sm font-medium mb-1">Engar venjur ennþá</div>
          <div className="text-xs">Byrjaðu með eina litla venju og byggðu upp þaðan</div>
        </div>
      )}
    </div>
  )
}
