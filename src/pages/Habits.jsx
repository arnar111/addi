import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check, Trophy, Target } from 'lucide-react'

const HABIT_ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '😴', '✍️', '🎯', '💊', '🚴', '🧹', '☀️', '🌿', '🎨', '🎸']
const HABIT_COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#ef4444', '#eab308']

function WeekDots({ habit, isDoneToday, streakFor }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const s = d.toISOString().split('T')[0]
    days.push({ date: s, done: habit.completions.includes(s), isToday: i === 0 })
  }
  const streak = streakFor(habit.id)

  return (
    <div className="flex items-center gap-1">
      {days.map(({ date, done, isToday }) => (
        <div key={date}
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: done ? habit.color : 'var(--surface2)',
            border: isToday ? `2px solid ${habit.color}` : '2px solid transparent',
            opacity: done ? 1 : 0.4,
          }}>
          {done && <Check size={10} color="#000" strokeWidth={3} />}
        </div>
      ))}
      {streak > 0 && (
        <span className="flex items-center gap-0.5 ml-1 text-xs font-bold" style={{ color: '#f97316' }}>
          <Flame size={11} />{streak}
        </span>
      )}
    </div>
  )
}

function AddHabitModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), icon, color)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md card flex flex-col gap-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Nýr vani</h3>
          <button onClick={onClose}><X size={18} style={{ color: 'var(--muted)' }} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="input" placeholder="Nafn vana..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />

          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: icon === i ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                    border: `2px solid ${icon === i ? 'var(--accent)' : 'transparent'}`,
                  }}>{i}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    outline: color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: 2,
                  }} />
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við vana
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showAdd, setShowAdd] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const totalStreaks = habits.reduce((s, h) => s + streakFor(h.id), 0)
  const longestStreak = habits.reduce((max, h) => Math.max(max, streakFor(h.id)), 0)
  const completionRate = habits.length
    ? Math.round((todayDone / habits.length) * 100)
    : 0

  const weekDayLabels = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    weekDayLabels.push(i === 0 ? 'Í dag' : d.toLocaleDateString('is-IS', { weekday: 'short' }))
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {showAdd && <AddHabitModal onAdd={add} onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} í dag · {completionRate}% hlutfall
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Target size={16} />, label: 'Í dag', value: `${todayDone}/${habits.length}`, color: 'var(--accent)' },
          { icon: <Flame size={16} />, label: 'Lengst', value: `${longestStreak}d`, color: '#f97316' },
          { icon: <Trophy size={16} />, label: 'Samtals', value: `${totalStreaks}d`, color: '#eab308' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="card-sm flex flex-col items-center gap-1 py-3">
            <span style={{ color }}>{icon}</span>
            <span className="text-lg font-bold">{value}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Week header labels */}
      {habits.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {weekDayLabels.map((label, i) => (
              <div key={i} className="w-5 text-center" style={{ fontSize: 9, color: 'var(--muted)' }}>
                {label.slice(0, 2)}
              </div>
            ))}
            <div className="w-10" />
          </div>
        </div>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3">
          <div className="text-4xl">🌱</div>
          <p className="font-medium">Engin vanur enn</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Byrjaðu með einn vana í dag</p>
          <button onClick={() => setShowAdd(true)} className="btn btn-primary mt-1">
            <Plus size={16} /> Bæta við vana
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            return (
              <div key={h.id} className="card flex items-center gap-3 py-3 transition-all"
                   style={{
                     borderColor: done ? h.color + '44' : 'var(--border)',
                     background: done ? `${h.color}08` : 'var(--surface)',
                   }}>
                <button onClick={() => toggle(h.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-all"
                  style={{
                    background: done ? h.color : 'var(--surface2)',
                    border: `2px solid ${done ? h.color : 'var(--border)'}`,
                    fontSize: done ? 20 : 18,
                  }}>
                  {done ? <Check size={18} color="#000" strokeWidth={3} /> : h.icon}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{h.name}</span>
                    {done && <span className="text-xs" style={{ color: h.color }}>✓</span>}
                  </div>
                  <WeekDots habit={h} isDoneToday={isDoneToday} streakFor={streakFor} />
                </div>

                {confirmDelete === h.id ? (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => remove(h.id)}
                      className="btn text-xs py-1 px-2"
                      style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      Já
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="btn btn-ghost text-xs py-1 px-2">
                      Nei
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(h.id)} className="shrink-0"
                          style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Motivational footer */}
      {todayDone === habits.length && habits.length > 0 && (
        <div className="card text-center py-4 animate-slide-up"
             style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,170,0.25)' }}>
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-semibold text-sm">Frábært! Allir vanir lokið í dag!</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Þú ert að gera einstaklegt starf</p>
        </div>
      )}
    </div>
  )
}
