import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X } from 'lucide-react'

const WEEK_DAYS = ['M', 'Þ', 'M', 'F', 'L', 'S', 'S']

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function HabitRow({ habit, onToggle, onRemove }) {
  const last7 = getLast7Days()
  const today = new Date().toISOString().split('T')[0]
  const doneToday = habit.completions.includes(today)

  let streak = 0
  const d = new Date()
  while (true) {
    const s = d.toISOString().split('T')[0]
    if (habit.completions.includes(s)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }

  return (
    <div className="card" style={{ border: `1px solid ${doneToday ? habit.color + '33' : 'var(--border)'}` }}>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => onToggle(habit.id)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
                style={{ background: doneToday ? `${habit.color}22` : 'var(--surface2)' }}>
          {habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{habit.name}</div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
              <Flame size={11} /> {streak} daga streak
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {doneToday && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${habit.color}22`, color: habit.color }}>
              ✓ Lokið
            </span>
          )}
          <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)', opacity: 0.5 }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* 7-day grid */}
      <div className="flex gap-1.5">
        {last7.map((day, i) => {
          const done = habit.completions.includes(day)
          const isToday = day === today
          return (
            <div key={day} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs" style={{ color: isToday ? 'var(--text)' : 'var(--muted)', fontSize: 10 }}>
                {WEEK_DAYS[new Date(day).getDay() === 0 ? 6 : new Date(day).getDay() - 1]}
              </span>
              <button onClick={() => {
                if (isToday) onToggle(habit.id)
              }}
                      className="w-full rounded-lg transition-all"
                      style={{
                        height: 28,
                        background: done ? habit.color : 'var(--surface2)',
                        opacity: isToday ? 1 : done ? 0.7 : 0.4,
                        cursor: isToday ? 'pointer' : 'default',
                        border: isToday ? `1px solid ${habit.color}55` : '1px solid transparent',
                      }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const ICONS = ['🏋️', '📚', '💧', '🧘', '🦜', '🥤', '🏃', '🧠', '💊', '🛌', '✍️', '🎯', '🚴', '🍎', '⭐']
  const COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#ef4444', '#3b82f6', '#22c55e', '#ec4899', '#eab308']

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
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{todayDone}/{habits.length} lokið í dag</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Vanur
        </button>
      </div>

      {/* Progress bar */}
      <div className="card-sm">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
          <span>Í dag</span>
          <span style={{ color: todayDone === habits.length && habits.length > 0 ? 'var(--success)' : 'var(--text)' }}>
            {todayDone}/{habits.length}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{
                 width: habits.length > 0 ? `${(todayDone / habits.length) * 100}%` : '0%',
                 background: todayDone === habits.length && habits.length > 0 ? 'var(--success)' : 'var(--accent)',
               }} />
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr vanur</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input text-sm" placeholder="Nafn vana..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                        className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                        style={{ background: icon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)', border: `1px solid ${icon === ic ? 'rgba(0,212,170,0.3)' : 'transparent'}` }}>
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
                        className="w-7 h-7 rounded-full transition-all"
                        style={{ background: c, border: `2px solid ${color === c ? 'white' : 'transparent'}` }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Habit rows */}
      {habits.length === 0 ? (
        <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
          Engir vanir ennþá — bættu við fyrsta vananum!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => (
            <HabitRow key={h.id} habit={h} onToggle={toggle} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
