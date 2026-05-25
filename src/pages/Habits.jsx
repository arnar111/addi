import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ef4444', '#22c55e', '#ec4899', '#eab308']
const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🎯', '🍎', '😴', '✍️', '🎵', '🌿', '💊', '🚴', '🧠', '🌞', '💪']

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const days = last7Days()
  const todayDone = habits.filter(h => isDoneToday(h.id)).length

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
          <h1 className="text-xl font-semibold">Vanir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Weekly stats bar */}
      {habits.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">Þessi vika</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Síðustu 7 dagar</span>
          </div>
          <div className="flex gap-1.5">
            {days.map((day, i) => {
              const doneCount = habits.filter(h => h.completions.includes(day)).length
              const pct = habits.length > 0 ? doneCount / habits.length : 0
              const isToday = i === 6
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-lg overflow-hidden relative" style={{ height: 36, background: 'var(--surface2)' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-lg transition-all"
                      style={{
                        height: `${Math.max(pct * 100, pct > 0 ? 15 : 0)}%`,
                        background: isToday ? 'var(--accent)' : 'rgba(0,212,170,0.35)',
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{
                    color: isToday ? 'var(--accent)' : 'var(--muted)',
                    fontWeight: isToday ? 600 : 400,
                    fontSize: 10,
                  }}>
                    {new Date(day + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'short' }).slice(0, 1).toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add habit form */}
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
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: icon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1px solid ${icon === ic ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    boxShadow: color === c ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : 'none',
                  }}
                />
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
          <div className="text-3xl mb-3">🌱</div>
          <p className="text-sm">Engir vanir ennþá</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Bættu við fyrsta vana þínum</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggle(h.id)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
                    style={{
                      background: done ? `${h.color}22` : 'var(--surface2)',
                      border: `1px solid ${done ? h.color + '55' : 'transparent'}`,
                    }}
                  >
                    {done ? <Check size={20} style={{ color: h.color }} /> : <span>{h.icon}</span>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{h.name}</span>
                      {streak > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#f97316' }}>
                          <Flame size={11} /> {streak}
                        </span>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: done ? h.color : 'var(--muted)' }}>
                      {done ? '✓ Lokið í dag' : 'Ólokið í dag'}
                    </span>
                  </div>
                  <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 7-day mini history */}
                <div className="flex gap-1">
                  {days.map((day, i) => {
                    const completed = h.completions.includes(day)
                    const isToday = i === 6
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-full h-5 rounded flex items-center justify-center"
                          style={{
                            background: completed ? `${h.color}2a` : 'var(--surface2)',
                            border: isToday ? `1px solid ${completed ? h.color + '66' : 'var(--border)'}` : 'none',
                          }}
                        >
                          {completed && <Check size={10} style={{ color: h.color }} />}
                        </div>
                        {isToday && (
                          <span style={{ fontSize: 8, color: 'var(--accent)' }}>í dag</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
