import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, X, Trash2, Flame, Check } from 'lucide-react'

const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '😴', '✍️', '🎯', '☀️', '🧠', '🎵']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e']

const lastNDays = (n) => {
  const days = []
  const d = new Date()
  for (let i = 0; i < n; i++) {
    const day = new Date(d)
    day.setDate(d.getDate() - i)
    days.push(day.toISOString().split('T')[0])
  }
  return days.reverse()
}

const DAY_LABEL = ['S', 'M', 'Þ', 'M', 'F', 'F', 'L']

function HabitCard({ habit, done, streak, onToggle, onRemove }) {
  const days = lastNDays(7)

  return (
    <div className="card flex flex-col gap-3"
         style={{
           background: done ? `${habit.color}10` : 'var(--surface)',
           border: `1px solid ${done ? habit.color + '40' : 'var(--border)'}`,
         }}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(habit.id)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all"
          style={{
            background: done ? habit.color : 'var(--surface2)',
            border: `1px solid ${done ? habit.color : 'var(--border)'}`,
          }}>
          <span style={{ filter: done ? 'none' : 'grayscale(0.2)' }}>{habit.icon}</span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate">{habit.name}</span>
            <button onClick={() => {
                if (confirm(`Eyða vananum "${habit.name}"?`)) onRemove(habit.id)
              }} style={{ color: 'var(--muted)' }}>
              <Trash2 size={13} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: streak > 0 ? '#f97316' : 'var(--muted)' }}>
              <Flame size={12} /> {streak} {streak === 1 ? 'dagur' : 'dagar'}
            </span>
            <button onClick={() => onToggle(habit.id)}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: done ? habit.color : 'var(--muted)' }}>
              {done ? <><Check size={12} /> Lokið í dag</> : 'Smella til að klára'}
            </button>
          </div>
        </div>
      </div>

      {/* Last 7 days mini calendar */}
      <div className="flex items-center gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {days.map((d, i) => {
          const isDone = habit.completions.includes(d)
          const isToday = i === days.length - 1
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full aspect-square max-w-[28px] rounded-md transition-all"
                style={{
                  background: isDone ? habit.color : 'var(--surface2)',
                  border: isToday ? `1.5px solid ${habit.color}` : '1px solid transparent',
                  opacity: isDone ? 1 : 0.5,
                }} />
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                {DAY_LABEL[new Date(d).getDay()]}
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
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} kláraðir í dag · {pct}%
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Today summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Framvinda í dag</div>
            <div className="text-2xl font-semibold mt-1">{todayDone} <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}>af {habits.length}</span></div>
          </div>
          <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>{pct}%</div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      {/* Add habit form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr vani</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Heiti vana (t.d. Ganga 30 mín)" autoFocus
            value={name} onChange={e => setName(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Tákn</label>
            <div className="grid grid-cols-6 gap-1.5">
              {ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="aspect-square rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: icon === i ? `${color}22` : 'var(--surface2)',
                    border: `1px solid ${icon === i ? color + '55' : 'transparent'}`,
                  }}>{i}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Litur</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `2px solid ${color === c ? '#fff' : 'transparent'}`,
                  }} />
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Búa til</button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">🌱</div>
          <div className="text-sm">Engir vanir ennþá</div>
          <div className="text-xs mt-1">Smelltu á "Nýr" til að byrja</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => (
            <HabitCard key={h.id} habit={h}
              done={isDoneToday(h.id)}
              streak={streakFor(h.id)}
              onToggle={toggle}
              onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
