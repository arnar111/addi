import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, Flame, X, Check } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444']
const ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '💊', '😴', '🎯', '✍️', '🎸', '🌿', '🧠', '💻', '🚴', '🐕']

export default function Habits() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [color, setColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), icon, color)
    setName('')
    setIcon('🎯')
    setColor('#00d4aa')
    setShowForm(false)
  }

  const total = habits.length
  const done = habits.filter(h => isDoneToday(h.id)).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const circ = 2 * Math.PI * 26

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Vanur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{done}/{total} lokið í dag</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýr
        </button>
      </div>

      {/* Progress summary */}
      <div className="card flex items-center gap-4"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 64 64" className="-rotate-90 w-16 h-16">
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" stroke="var(--surface2)" />
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
              stroke="var(--accent)" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{pct}%</span>
          </div>
        </div>
        <div>
          <div className="font-semibold">
            {done === total && total > 0 ? '🎉 Allir vanir lokið!' : `${done} af ${total} vanir`}
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Nýr vani</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn vana..." value={name}
            onChange={e => setName(e.target.value)} autoFocus />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{
                    background: icon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1px solid ${icon === ic ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                  }}>{ic}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    transform: color === c ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: color === c ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : 'none',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary justify-center">Bæta við vana</button>
        </form>
      )}

      {/* Habits grid */}
      {habits.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">🌱</div>
          <div>Engin vanur enn. Bættu við fyrsta vanann!</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {habits.map(h => {
            const isDone = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="card relative"
                style={{
                  background: isDone ? `${h.color}18` : 'var(--surface)',
                  borderColor: isDone ? `${h.color}44` : 'var(--border)',
                  padding: 14,
                }}>
                <button onClick={() => remove(h.id)}
                  className="absolute top-2 right-2 p-1"
                  style={{ color: 'var(--muted)', opacity: 0.4 }}>
                  <Trash2 size={11} />
                </button>
                <button onClick={() => toggle(h.id)} className="w-full text-left">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl">{h.icon}</span>
                    {isDone && (
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                           style={{ background: h.color }}>
                        <Check size={10} color="#000" />
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-sm leading-tight pr-4">{h.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    {streak > 0 ? (
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#f97316' }}>
                        <Flame size={11} /> {streak}d
                      </div>
                    ) : (
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>0 days</div>
                    )}
                    <div className="text-xs" style={{ color: isDone ? h.color : 'var(--muted)' }}>
                      {isDone ? '✓ Lokið' : 'Í bið'}
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
