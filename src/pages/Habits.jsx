import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Check, Flame } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444']
const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🍎', '💊', '😴', '✍️', '🎯', '🚿', '☀️', '🧹', '💪', '⚽', '🎸']

function last7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('is-IS', { weekday: 'short' }).slice(0, 2)
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')

  const days = last7Days()
  const today = days[days.length - 1]
  const pct = habits.length ? Math.round((todayDone / habits.length) * 100) : 0
  const circ = 2 * Math.PI * 26

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
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} í dag · {pct}%
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný venja
        </button>
      </div>

      {/* Progress overview */}
      <div className="card flex items-center gap-4"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="relative w-16 h-16 shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--surface2)" strokeWidth="6" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{pct}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {todayDone === habits.length && habits.length > 0
              ? '🎉 Allar venjur kláraðar!'
              : `${todayDone} af ${habits.length} lokið í dag`}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          {habits.length > 0 && (
            <div className="flex gap-1 mt-2">
              {habits.map(h => (
                <div key={h.id} className="w-2 h-2 rounded-full transition-all"
                     style={{ background: isDoneToday(h.id) ? h.color : 'var(--surface2)' }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add habit form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Ný venja</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input text-sm" placeholder="Nafn venju..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
                  style={{
                    background: icon === i ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                    border: `1px solid ${icon === i ? 'var(--accent)' : 'transparent'}`,
                  }}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: color === c ? 'scale(1.3)' : 'scale(1)',
                    border: color === c ? '2px solid white' : 'none',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Habits list */}
      <div className="flex flex-col gap-3">
        {habits.map(h => {
          const streak = streakFor(h.id)
          const doneToday = isDoneToday(h.id)
          const totalDone = h.completions.length
          return (
            <div key={h.id} className="card flex flex-col gap-3"
                 style={{ borderColor: doneToday ? h.color + '44' : 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(h.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: doneToday ? h.color + '22' : 'var(--surface2)',
                    border: `2px solid ${doneToday ? h.color : 'var(--border)'}`,
                  }}>
                  {doneToday
                    ? <Check size={18} color={h.color} strokeWidth={2.5} />
                    : <span className="text-xl">{h.icon}</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {h.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {streak > 0 ? (
                      <div className="flex items-center gap-0.5 text-xs" style={{ color: '#f97316' }}>
                        <Flame size={11} /> {streak}d streak
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>Engin streak</span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>· {totalDone} sinnum total</span>
                  </div>
                </div>
                <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>

              {/* 7-day grid */}
              <div className="flex gap-1">
                {days.map(d => {
                  const done = h.completions.includes(d)
                  const isToday = d === today
                  return (
                    <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-md transition-all"
                           style={{
                             height: 20,
                             background: done ? h.color + (isToday ? 'ff' : '99') : 'var(--surface2)',
                             border: isToday && !done ? `1px solid ${h.color}44` : 'none',
                           }} />
                      <span style={{ fontSize: 9, color: isToday ? h.color : 'var(--muted)' }}>
                        {dayLabel(d)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {habits.length === 0 && !showForm && (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🌱</div>
          <div className="font-medium mb-1">Engar venjur enn</div>
          <div className="text-xs">Byrjaðu á einni og byggðu upp streak!</div>
        </div>
      )}
    </div>
  )
}
