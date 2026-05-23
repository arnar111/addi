import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, X, Flame, Trash2 } from 'lucide-react'

const ICONS = ['🏋️', '🏃', '📚', '💧', '🧘', '🥗', '😴', '⛳', '🎸', '✍️', '🎯', '💊', '🌳', '🎮', '⭐']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444']

function WeekDots({ completions, color }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().split('T')[0]
  })
  return (
    <div className="flex gap-1">
      {days.map((day, i) => (
        <div key={day}
          className="w-3.5 h-3.5 rounded-full"
          title={day}
          style={{
            background: completions.includes(day) ? color : 'var(--surface2)',
            border: i === 6 ? `1px solid ${color}` : '1px solid transparent',
          }} />
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

  const allDone = habits.length > 0 && todayDone === habits.length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag{allDone ? ' 🎉' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn btn-primary">
          <Plus size={16} /> Ný venja
        </button>
      </div>

      {/* Daily progress */}
      {habits.length > 0 && (
        <div className="card" style={{ padding: '12px 16px' }}>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: 'var(--muted)' }}>Framvinda dagsins</span>
            <span style={{ color: allDone ? 'var(--success)' : 'var(--accent)' }}>
              {todayDone}/{habits.length}
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{
                   width: `${habits.length ? (todayDone / habits.length) * 100 : 0}%`,
                   background: allDone ? 'var(--success)' : 'var(--accent)',
                 }} />
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Ný venja</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Heiti venju..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: icon === ic ? `${color}30` : 'var(--surface2)',
                    border: `2px solid ${icon === ic ? color : 'transparent'}`,
                    transform: icon === ic ? 'scale(1.1)' : 'scale(1)',
                  }}>
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
                  style={{
                    background: c,
                    border: `3px solid ${color === c ? '#fff' : 'transparent'}`,
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við venju</button>
        </form>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3">
          <span className="text-4xl">🌱</span>
          <div>
            <p className="text-sm font-medium">Engar venjur ennþá</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Bættu við daglegum venjum til að fylgjast með framvindu þinni
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="card transition-all"
                   style={{ borderLeft: `3px solid ${done ? h.color : 'var(--border)'}` }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(h.id)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all"
                    style={{
                      background: done ? `${h.color}25` : 'var(--surface2)',
                      border: `2px solid ${done ? h.color : 'var(--border)'}`,
                      transform: done ? 'scale(1.05)' : 'scale(1)',
                    }}>
                    {h.icon}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm">{h.name}</span>
                      {done && (
                        <span className="text-xs font-medium" style={{ color: h.color }}>✓ Lokið</span>
                      )}
                      {streak > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#f97316' }}>
                          <Flame size={11} />{streak}
                        </span>
                      )}
                    </div>
                    <WeekDots completions={h.completions} color={h.color} />
                  </div>
                  <button onClick={() => remove(h.id)}
                    style={{ color: 'var(--muted)', padding: 6, flexShrink: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
