import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Flame, Check } from 'lucide-react'

const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '🛌', '💊', '🎯', '✍️', '🌿', '🚴', '🧠', '💪', '🎸', '🌅']
const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ef4444', '#22c55e', '#eab308', '#ec4899', '#06b6d4', '#a855f7']

function StreakDots({ habit }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  return (
    <div className="flex gap-1">
      {days.map((day, i) => {
        const done = habit.completions.includes(day)
        const isToday = i === 6
        return (
          <div
            key={day}
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{
              background: done ? habit.color : 'var(--surface2)',
              border: isToday ? `1.5px solid ${habit.color}` : 'none',
              opacity: done ? 1 : 0.5,
            }}
            title={new Date(day).toLocaleDateString('is-IS', { weekday: 'short' })}
          />
        )
      })}
    </div>
  )
}

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()

  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00d4aa')

  const totalToday = habits.length
  const pct = totalToday ? Math.round((todayDone / totalToday) * 100) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add(newName.trim(), newIcon, newColor)
    setNewName('')
    setNewIcon('⭐')
    setNewColor('#00d4aa')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{totalToday} í dag · {pct}%
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný venja
        </button>
      </div>

      {/* Progress bar */}
      {totalToday > 0 && (
        <div className="card py-3">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--muted)' }}>
            <span>Daglegur framgangur</span>
            <span style={{ color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>
              {pct === 100 ? '🔥 Fullkomið!' : `${pct}%`}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? 'var(--success)' : 'var(--accent)',
              }}
            />
          </div>
          <div className="flex gap-1 mt-3 justify-center">
            {habits.map(h => (
              <div
                key={h.id}
                className="text-base"
                style={{ opacity: isDoneToday(h.id) ? 1 : 0.3 }}
                title={h.name}
              >
                {h.icon}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Ný venja</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input
            className="input"
            placeholder="Nafn venju..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewIcon(icon)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{
                    background: newIcon === icon ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1.5px solid ${newIcon === icon ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                  }}
                >
                  {icon}
                </button>
              ))}
              <input
                type="text"
                className="input w-9 h-9 text-center text-lg p-0"
                placeholder="✏️"
                value={ICONS.includes(newIcon) ? '' : newIcon}
                onChange={e => setNewIcon(e.target.value || '⭐')}
                maxLength={2}
              />
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className="w-7 h-7 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: newColor === c ? 'scale(1.25)' : 'scale(1)',
                    outline: newColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við venju</button>
        </form>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-4">
          <div className="text-5xl">✨</div>
          <div>
            <div className="font-semibold">Engar venjur enn</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Byrjaðu að byggja góðar venjur</div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={14} /> Bæta við fyrstu venju
          </button>
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
                  border: `1px solid ${done ? h.color + '44' : 'var(--border)'}`,
                  background: done ? `${h.color}08` : 'var(--surface)',
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(h.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-all active:scale-90"
                    style={{
                      background: done ? h.color : `${h.color}22`,
                      border: `2px solid ${done ? h.color : h.color + '44'}`,
                    }}
                  >
                    {done ? <Check size={18} color="#000" strokeWidth={3} /> : h.icon}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{h.name}</span>
                      {streak >= 2 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold"
                              style={{ color: streak >= 7 ? '#f97316' : 'var(--accent)' }}>
                          <Flame size={12} />
                          {streak}
                        </span>
                      )}
                    </div>
                    <StreakDots habit={h} />
                  </div>
                  <button onClick={() => remove(h.id)} className="p-1 shrink-0" style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 7-day summary */}
      {habits.length > 0 && (
        <div className="card">
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>7 DAGA YFIRLIT</div>
          <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date()
              d.setDate(d.getDate() - (6 - i))
              const dayStr = d.toISOString().split('T')[0]
              const completedCount = habits.filter(h => h.completions.includes(dayStr)).length
              const pct = habits.length ? completedCount / habits.length : 0
              return (
                <div key={dayStr} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 rounded-full transition-all"
                    style={{
                      height: `${Math.max(8, pct * 40)}px`,
                      background: pct > 0 ? `rgba(0,212,170,${0.3 + pct * 0.7})` : 'var(--surface2)',
                    }}
                  />
                  <span style={{ fontSize: 10 }}>
                    {i === 6 ? 'Í dag' : d.toLocaleDateString('is-IS', { weekday: 'short' }).slice(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
