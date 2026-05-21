import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Trophy } from 'lucide-react'

const EMOJI_OPTIONS = ['🏋️','🏃','📚','💧','🧘','🥗','💊','🌅','🎯','✍️','🧹','🛌','🚿','💻','🎸','🌿','🏊','🤸','🧠','🥤']
const COLOR_OPTIONS = ['#00d4aa','#8b5cf6','#3b82f6','#f97316','#ef4444','#22c55e','#eab308','#ec4899']

function last7() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

const DAYS7 = last7()

function HabitRow({ habit, onToggle, isDone, streak, onRemove }) {
  return (
    <div className="card flex flex-col gap-3 transition-all"
         style={{ borderColor: isDone ? habit.color + '55' : 'var(--border)' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(habit.id)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all"
          style={{
            background: isDone ? `${habit.color}22` : 'var(--surface2)',
            border: `2px solid ${isDone ? habit.color : 'transparent'}`,
            transform: isDone ? 'scale(1.05)' : 'scale(1)',
          }}>
          {isDone ? '✓' : habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{habit.name}</div>
          {streak > 0 ? (
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#f97316' }}>
              <Flame size={11} /> {streak} daga streak
            </div>
          ) : isDone ? (
            <div className="text-xs mt-0.5" style={{ color: habit.color }}>Lokið í dag ✓</div>
          ) : null}
        </div>
        <button onClick={() => onRemove(habit.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex gap-1">
        {DAYS7.map((day, i) => {
          const done = habit.completions.includes(day)
          const isToday = i === 6
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-md transition-all"
                   style={{
                     height: 20,
                     background: done ? habit.color : 'var(--surface2)',
                     opacity: done ? 1 : 0.35,
                     outline: isToday ? `1.5px solid ${habit.color}77` : 'none',
                     outlineOffset: '1px',
                   }} />
              <span style={{ fontSize: 9, color: isToday ? habit.color : 'var(--muted)' }}>
                {new Date(day + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'short' }).charAt(0).toUpperCase()}
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
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add(newName.trim(), newIcon, newColor)
    setNewName('')
    setNewIcon('⭐')
    setNewColor('#00d4aa')
    setShowForm(false)
  }

  const progress = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0
  const r = 32
  const circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{todayDone}/{habits.length} lokið í dag</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      <div className="card flex items-center gap-4"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="relative shrink-0">
          <svg width="80" height="80" className="-rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" strokeWidth="5" stroke="var(--surface2)" />
            <circle cx="40" cy="40" r={r} fill="none" strokeWidth="5"
              stroke="var(--accent)" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{progress}%</span>
          </div>
        </div>
        <div>
          <div className="font-semibold">Dagleg framvinda</div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {todayDone} af {habits.length} vanir fullnægt
          </div>
          {progress === 100 && habits.length > 0 && (
            <div className="flex items-center gap-1 text-sm mt-1" style={{ color: '#f97316' }}>
              <Trophy size={14} /> Frábærlega gert!
            </div>
          )}
          {progress === 0 && habits.length > 0 && (
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Byrjaðu daginn! 💪</div>
          )}
        </div>
      </div>

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
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setNewIcon(e)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all"
                  style={{
                    background: newIcon === e ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1.5px solid ${newIcon === e ? 'var(--accent)' : 'transparent'}`,
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2.5">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setNewColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    boxShadow: newColor === c ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : 'none',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við vana</button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {habits.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-3">
            <span className="text-5xl">🏆</span>
            <div>
              <div className="font-medium mb-1">Engin vanir enn</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Bættu við fyrsta vananum þínum!</div>
            </div>
          </div>
        ) : habits.map(h => (
          <HabitRow
            key={h.id}
            habit={h}
            onToggle={toggle}
            isDone={isDoneToday(h.id)}
            streak={streakFor(h.id)}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  )
}
