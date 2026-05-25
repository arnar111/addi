import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Flame, Plus, Trash2, X, Check } from 'lucide-react'

const EMOJI_OPTIONS = ['🏋️','📚','💧','🧘','🏃','🌅','✍️','🎸','🥗','😴','🧹','💊','🚶','🎯','📝','🏊']
const COLOR_OPTIONS = ['#00d4aa','#8b5cf6','#3b82f6','#f97316','#ec4899','#22c55e','#eab308','#ef4444']

const last7Days = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

const DAY_LABELS_IS = ['Su','Má','Þr','Mi','Fi','Fö','La']

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')
  const days = last7Days()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const totalDone = habits.filter(h => isDoneToday(h.id)).length
  const pct = habits.length ? Math.round((totalDone / habits.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Venjur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {todayDone}/{habits.length} lokið í dag
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný venja
        </button>
      </div>

      {/* Today progress */}
      {habits.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Framvinda í dag</span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--accent)' }} />
          </div>
          {pct === 100 && (
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--success)' }}>
              🎉 Allar venjur loknar í dag!
            </p>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný venja</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn venju..." value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{ background: icon === e ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: `1px solid ${icon === e ? 'var(--accent)' : 'transparent'}` }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</p>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{ background: c, border: color === c ? `3px solid ${c}` : '3px solid transparent', outline: color === c ? `2px solid ${c}44` : 'none' }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-sm">Engar venjur ennþá</p>
          <p className="text-xs mt-1">Byrjaðu með eina litla venju</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="card flex flex-col gap-3"
                   style={{ borderColor: done ? `${h.color}44` : 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(h.id)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all shrink-0"
                    style={{ background: done ? `${h.color}22` : 'var(--surface2)', border: `2px solid ${done ? h.color : 'var(--border)'}` }}>
                    {done ? <Check size={20} style={{ color: h.color }} /> : h.icon}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {h.name}
                      {done && <span className="text-xs" style={{ color: h.color }}>✓</span>}
                    </div>
                    {streak > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Flame size={12} style={{ color: '#f97316' }} />
                        <span className="text-xs font-medium" style={{ color: '#f97316' }}>{streak} daga í röð</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Week view */}
                <div className="flex gap-1">
                  {days.map((day, i) => {
                    const dayDate = new Date(day + 'T12:00:00')
                    const dayLabel = DAY_LABELS_IS[dayDate.getDay()]
                    const completed = h.completions.includes(day)
                    const isToday = i === 6
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs" style={{ color: isToday ? 'var(--accent)' : 'var(--muted)', fontSize: 9 }}>
                          {dayLabel}
                        </span>
                        <div className="w-full aspect-square rounded-md flex items-center justify-center"
                             style={{
                               background: completed ? `${h.color}33` : 'var(--surface2)',
                               border: `1px solid ${completed ? h.color + '66' : 'transparent'}`,
                             }}>
                          {completed && <div className="w-2 h-2 rounded-full" style={{ background: h.color }} />}
                        </div>
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
