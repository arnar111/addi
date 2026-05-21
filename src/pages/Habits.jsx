import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check } from 'lucide-react'

const ICONS = ['🏋️','🧘','📚','💧','🚶','🏃','🍎','🥗','☕','🎯','✍️','🎨','🎵','🌿','💊','😴','🧹','📝','🌅','❄️']
const COLORS = ['#00d4aa','#8b5cf6','#f97316','#3b82f6','#ec4899','#22c55e','#eab308','#ef4444','#06b6d4','#a855f7']

function StreakDots({ completions }) {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ key, done: completions.includes(key), isToday: i === 0 })
  }
  return (
    <div className="flex gap-1">
      {days.map(d => (
        <div key={d.key} className="w-4 h-4 rounded-sm"
             style={{ background: d.done ? 'var(--accent)' : 'var(--surface2)', opacity: d.isToday ? 1 : 0.7 }} />
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

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const totalStreak = habits.reduce((s, h) => s + streakFor(h.id), 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} í dag · {totalStreak} streaks
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Nýr vani</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <button type="button" className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: color + '22', border: `1px solid ${color}44` }}>
              {icon}
            </button>
            <input className="input text-sm" placeholder="Nafn vana..." value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
                  style={{ background: icon === ic ? color + '33' : 'var(--surface2)', transform: icon === ic ? 'scale(1.15)' : 'scale(1)' }}>
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
                  style={{ background: c, transform: color === c ? 'scale(1.25)' : 'scale(1)', outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Progress bar */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Daglegur framgangur</span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{todayDone}/{habits.length}</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: habits.length ? `${(todayDone / habits.length) * 100}%` : '0%', background: 'var(--accent)' }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <div key={h.id} className="card transition-all"
                 style={{ borderColor: done ? h.color + '44' : 'var(--border)', background: done ? `${h.color}08` : 'var(--surface)' }}>
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(h.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
                  style={{ background: done ? h.color : h.color + '22', transform: done ? 'scale(1.05)' : 'scale(1)' }}>
                  {done ? '✓' : h.icon}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{h.name}</span>
                    {streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#f97316' }}>
                        <Flame size={11} />{streak}
                      </span>
                    )}
                  </div>
                  <StreakDots completions={h.completions} />
                </div>

                <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 6 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {habits.length === 0 && (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-sm">Byrjaðu með fyrsta vanann þinn</p>
        </div>
      )}
    </div>
  )
}
