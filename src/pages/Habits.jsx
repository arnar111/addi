import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check } from 'lucide-react'

const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '😴', '🎯', '✍️', '🎸', '🌿', '💊', '🚴', '🧹', '📓', '🎨', '🧠', '☀️', '🥤', '🫁']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#a78bfa']

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')
  const last7 = getLast7Days()
  const todayStr = new Date().toISOString().split('T')[0]

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const todayDone = habits.filter(h => isDoneToday(h.id)).length
  const pct = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag · {pct}%
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Today progress bar */}
      {habits.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Daglegur framgangur</span>
            <span className="text-2xl font-bold" style={{ color: pct === 100 ? 'var(--accent)' : 'var(--text)' }}>
              {pct === 100 ? '🎉' : `${pct}%`}
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-700"
                 style={{ width: `${pct}%`, background: pct === 100 ? 'var(--accent)' : `linear-gradient(90deg, var(--accent), var(--accent2))` }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            <span>{todayDone} af {habits.length} vanur</span>
            {pct === 100 && <span style={{ color: 'var(--accent)' }}>Fullkomið! ✨</span>}
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
          <input className="input" placeholder="Nafn vana..." value={name} onChange={e => setName(e.target.value)} autoFocus />

          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(em => (
                <button key={em} type="button" onClick={() => setIcon(em)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                  style={{ background: icon === em ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: `1px solid ${icon === em ? 'var(--accent)' : 'transparent'}` }}>
                  {em}
                </button>
              ))}
              <input type="text" className="input w-16 text-center text-sm" maxLength={2}
                placeholder={icon} value={icon} onChange={e => setIcon(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{ background: c, border: `2px solid ${color === c ? 'white' : 'transparent'}`, transform: color === c ? 'scale(1.2)' : 'scale(1)' }} />
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við vana
          </button>
        </form>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🌱</div>
          <p className="font-medium mb-1">Engin vanur ennþá</p>
          <p className="text-xs">Bættu við fyrsta vananum þínum</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="card transition-all"
                   style={{ borderColor: done ? h.color + '44' : 'var(--border)', background: done ? `${h.color}0a` : 'var(--surface)' }}>
                <div className="flex items-center gap-3">
                  {/* Check button */}
                  <button onClick={() => toggle(h.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all"
                    style={{ background: done ? `${h.color}33` : 'var(--surface2)', border: `2px solid ${done ? h.color : 'var(--border)'}` }}>
                    {done ? <Check size={18} style={{ color: h.color }} /> : <span>{h.icon}</span>}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{h.name}</span>
                      {streak > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#f97316' }}>
                          <Flame size={12} /> {streak}
                        </span>
                      )}
                    </div>
                    {/* 7-day grid */}
                    <div className="flex gap-1 mt-2">
                      {last7.map((day, i) => {
                        const isToday = day === todayStr
                        const completed = h.completions.includes(day)
                        return (
                          <div key={day} title={day}
                            className="flex flex-col items-center gap-0.5">
                            <div className="w-5 h-5 rounded-md transition-all"
                                 style={{
                                   background: completed ? h.color : 'var(--surface2)',
                                   border: isToday ? `2px solid ${h.color}` : '2px solid transparent',
                                   opacity: completed ? 1 : 0.4,
                                 }} />
                            <span style={{ fontSize: 9, color: isToday ? h.color : 'var(--muted)' }}>
                              {new Date(day + 'T12:00:00').toLocaleDateString('is-IS', { weekday: 'narrow' })}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
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
