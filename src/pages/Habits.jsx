import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check, Calendar } from 'lucide-react'

const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '😴', '✍️', '🥗', '💊', '🎯', '🧹', '🚶', '🍎', '☕', '🎵', '💰', '🏊', '🚴', '🧠', '❤️']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ef4444', '#22c55e', '#ec4899', '#eab308', '#06b6d4', '#a855f7']

function last7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function HabitRow({ habit, onToggle, onRemove, isDone, streak }) {
  const days = last7Days()
  return (
    <div className="card transition-all"
         style={{ borderColor: isDone ? `${habit.color}44` : 'var(--border)' }}>
      <div className="flex items-center gap-3">
        <button onClick={() => onToggle(habit.id)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
          style={{
            background: isDone ? `${habit.color}25` : 'var(--surface2)',
            border: `2px solid ${isDone ? habit.color : 'transparent'}`,
          }}>
          {habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{habit.name}</span>
            {isDone && <Check size={13} style={{ color: habit.color }} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                <Flame size={11} />{streak}d
              </span>
            )}
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {habit.completions.length} skipta
            </span>
          </div>
        </div>
        <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)', padding: 6 }}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* 7-day mini grid */}
      <div className="flex gap-1.5 mt-3 items-center">
        {days.map(day => {
          const done = habit.completions.includes(day)
          const d = new Date(day)
          const isToday = day === days[6]
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full h-5 rounded-md transition-all"
                   style={{
                     background: done ? habit.color : 'var(--surface2)',
                     opacity: isToday ? 1 : done ? 0.75 : 0.4,
                     border: isToday ? `1px solid ${habit.color}60` : 'none',
                   }} />
              <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>
                {d.toLocaleDateString('is-IS', { weekday: 'narrow' })}
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

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const pct = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{todayDone}/{habits.length} lokið í dag</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Daily progress */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.07))' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Dagleg framvinda</span>
          <span className="text-sm font-bold" style={{ color: pct === 100 ? 'var(--accent)' : 'var(--text)' }}>
            {todayDone}/{habits.length}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: pct === 100
                   ? 'var(--accent)'
                   : 'linear-gradient(90deg, var(--accent), var(--accent2))',
               }} />
        </div>
        {pct === 100 && habits.length > 0 && (
          <p className="text-sm text-center mt-2 font-semibold" style={{ color: 'var(--accent)' }}>
            🎉 Frábært! Öll verkefni kláruð í dag!
          </p>
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
          <input className="input" placeholder="Nafn vana..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{
                    background: icon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `2px solid ${icon === ic ? 'rgba(0,212,170,0.5)' : 'transparent'}`,
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `3px solid ${color === c ? '#fff' : 'transparent'}`,
                    transform: color === c ? 'scale(1.25)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            Bæta við vana
          </button>
        </form>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-semibold">Engir vanur ennþá</div>
          <div className="text-xs mt-1">Bættu við fyrsta vananum þínum!</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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
