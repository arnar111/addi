import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Flame } from 'lucide-react'

const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '😴', '✍️', '🎯', '🚴', '🧠', '🎸', '💊', '🌅', '🛁', '📵']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444']

const DAYS_IS = ['S', 'M', 'Þ', 'M', 'F', 'L', 'S']

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function HabitRow({ habit, toggle, isDoneToday, streakFor, onRemove }) {
  const done = isDoneToday(habit.id)
  const streak = streakFor(habit.id)
  const week = last7Days()

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => toggle(habit.id)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all"
          style={{
            background: done ? `${habit.color}25` : 'var(--surface2)',
            border: `2px solid ${done ? habit.color : 'var(--border)'}`,
          }}>
          {habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{habit.name}</div>
          <div className="flex items-center gap-3 mt-0.5">
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#f97316' }}>
                <Flame size={11} /> {streak} daga streak
              </span>
            )}
            {done && <span className="text-xs" style={{ color: habit.color }}>✓ Lokið í dag</span>}
            {!done && !streak && <span className="text-xs" style={{ color: 'var(--muted)' }}>Ekki lokið í dag</span>}
          </div>
        </div>
        <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* Week heatmap */}
      <div className="flex gap-1">
        {week.map((day, i) => {
          const isDone = habit.completions.includes(day)
          const isToday = i === 6
          return (
            <div key={day} className="flex flex-col items-center gap-1 flex-1">
              <div className="rounded-md w-full aspect-square flex items-center justify-center"
                   style={{
                     background: isDone ? `${habit.color}30` : 'var(--surface2)',
                     border: `1px solid ${isDone ? habit.color + '60' : isToday ? 'var(--accent)' : 'transparent'}`,
                   }}>
                {isDone && <span style={{ fontSize: 10, color: habit.color }}>✓</span>}
              </div>
              <span className="text-xs" style={{ color: isToday ? 'var(--accent)' : 'var(--muted)', fontSize: 9 }}>
                {DAYS_IS[new Date(day + 'T12:00:00').getDay()]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const allDoneToday = todayDone === habits.length && habits.length > 0
  const pct = habits.length ? Math.round((todayDone / habits.length) * 100) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {allDoneToday ? '🎉 Allt lokið í dag!' : `${todayDone}/${habits.length} lokið í dag`}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="card py-3" style={{
          background: allDoneToday
            ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(0,212,170,0.08))'
            : 'var(--surface)',
          border: `1px solid ${allDoneToday ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
        }}>
          <div className="flex items-center gap-4">
            {/* Ring */}
            <div className="relative w-14 h-14 shrink-0">
              <svg width={56} height={56} className="-rotate-90">
                <circle cx={28} cy={28} r={22} fill="none" strokeWidth={4} stroke="var(--surface2)" />
                <circle cx={28} cy={28} r={22} fill="none" strokeWidth={4}
                  stroke={allDoneToday ? '#22c55e' : 'var(--accent)'}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={2 * Math.PI * 22 * (1 - pct / 100)}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold">{pct}%</span>
              </div>
            </div>
            <div>
              <div className="font-semibold">{todayDone} af {habits.length}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>venjum lokið í dag</div>
              {allDoneToday && (
                <div className="text-xs mt-1 font-medium" style={{ color: '#22c55e' }}>Frábær dagur! 💪</div>
              )}
            </div>
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
          <input className="input" placeholder="Nafn venju..." value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{ background: icon === ic ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: `1px solid ${icon === ic ? 'var(--accent)' : 'transparent'}` }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ background: c, border: `3px solid ${color === c ? '#fff' : 'transparent'}`, opacity: color === c ? 1 : 0.6 }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="card text-center py-10 flex flex-col items-center gap-3">
          <span className="text-4xl">🌱</span>
          <div>
            <div className="font-medium">Engar venjur enn</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Bættu við fyrstu venjunni þinni</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => (
            <HabitRow
              key={h.id}
              habit={h}
              toggle={toggle}
              isDoneToday={isDoneToday}
              streakFor={streakFor}
              onRemove={remove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
