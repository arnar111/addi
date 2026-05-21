import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, Flame, X, Check } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#ef4444', '#eab308']
const EMOJIS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '😴', '✍️', '🎸', '💊', '🧹', '🛁', '📝', '🎯', '🌿', '☕', '🚴', '🧠', '🫁', '🍎']

function WeekGrid({ habit }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const s = d.toISOString().split('T')[0]
    const done = habit.completions.includes(s)
    const isToday = i === 0
    days.push({ s, done, isToday, label: d.toLocaleDateString('is-IS', { weekday: 'short' }) })
  }

  return (
    <div className="flex gap-1 mt-1">
      {days.map(d => (
        <div key={d.s} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="rounded-lg flex items-center justify-center text-xs font-bold transition-all"
            style={{
              width: '100%',
              aspectRatio: '1',
              background: d.done ? `${habit.color}33` : 'var(--surface2)',
              border: `1px solid ${d.done ? habit.color + '66' : 'transparent'}`,
              color: d.done ? habit.color : 'transparent',
              outline: d.isToday ? `1.5px solid ${habit.color}88` : 'none',
              outlineOffset: 1,
            }}>
            {d.done ? '✓' : ''}
          </div>
          <span style={{ color: 'var(--muted)', fontSize: 9 }}>
            {d.label.slice(0, 3)}
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

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const completedAll = habits.length > 0 && todayDone === habits.length
  const pct = habits.length ? Math.round((todayDone / habits.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag{completedAll ? ' 🔥' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr vani
        </button>
      </div>

      {habits.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Framfarir í dag</div>
            <div className="text-sm font-bold" style={{ color: completedAll ? 'var(--success)' : 'var(--accent)' }}>
              {pct}%
            </div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: completedAll
                  ? 'var(--success)'
                  : 'linear-gradient(90deg, var(--accent), var(--accent2))',
              }}
            />
          </div>
          {completedAll && (
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--success)' }}>
              Frábærlegt! Þú hefur lokið öllum vana í dag 🎉
            </p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr vani</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input
            className="input"
            placeholder="Nafn vana..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: icon === e ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1px solid ${icon === e ? 'var(--accent)' : 'transparent'}`,
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    outline: color === c ? `2.5px solid ${c}` : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">
              Bæta við vana
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🌱</div>
          <div className="text-sm font-medium mb-1">Engin vanur ennþá</div>
          <div className="text-xs">Smelltu á "Nýr vani" til að byrja</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div
                key={h.id}
                className="card transition-all"
                style={{
                  borderColor: done ? h.color + '55' : 'var(--border)',
                  background: done ? `${h.color}08` : 'var(--surface)',
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggle(h.id)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl transition-all"
                    style={{
                      background: done ? h.color : 'var(--surface2)',
                      border: `1.5px solid ${done ? h.color : 'var(--border)'}`,
                    }}>
                    {done ? <Check size={20} color="#000" strokeWidth={2.5} /> : h.icon}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{h.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {streak > 0 ? (
                        <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                          <Flame size={11} /> {streak} daga röð
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>Engin röð enn</span>
                      )}
                      {done && (
                        <span className="text-xs font-medium" style={{ color: h.color }}>· Lokið ✓</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(h.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <WeekGrid habit={h} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
