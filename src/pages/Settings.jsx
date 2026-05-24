import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHabits } from '../hooks/useHabits'
import { User, MapPin, Trash2, Info, Plus, X, Flame } from 'lucide-react'

const HABIT_COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899', '#eab308', '#ef4444', '#0ea5e9']
const HABIT_ICONS = ['🏋️', '🥤', '💧', '📚', '🧘', '🏃', '🥗', '😴', '🎯', '💊', '🚴', '✍️']

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { habits, add: addHabit, remove: removeHabit, isDoneToday, streakFor } = useHabits()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitIcon, setHabitIcon] = useState('⭐')
  const [habitColor, setHabitColor] = useState('#00d4aa')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_projects', 'addi_subscriptions']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!habitName.trim()) return
    addHabit(habitName.trim(), habitIcon, habitColor)
    setHabitName('')
    setHabitIcon('⭐')
    setShowHabitForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Prófíll</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <MapPin size={11} /> Staður (veður)
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
        </div>
      </div>

      {/* Habits management */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Flame size={15} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm">Vanur</span>
          </div>
          <button onClick={() => setShowHabitForm(!showHabitForm)} className="btn btn-ghost text-xs py-1 px-2">
            <Plus size={13} /> Bæta við
          </button>
        </div>

        {showHabitForm && (
          <form onSubmit={handleAddHabit} className="flex flex-col gap-3 p-3 rounded-xl animate-slide-up"
                style={{ background: 'var(--surface2)' }}>
            <div className="flex gap-2">
              <input className="input text-lg text-center" style={{ maxWidth: 52, padding: '8px' }}
                value={habitIcon} onChange={e => setHabitIcon(e.target.value)} maxLength={2} />
              <input className="input text-sm flex-1" placeholder="Nafn vana..." value={habitName}
                onChange={e => setHabitName(e.target.value)} autoFocus />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setHabitColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `2px solid ${habitColor === c ? 'var(--text)' : 'transparent'}`,
                    transform: habitColor === c ? 'scale(1.15)' : 'scale(1)',
                  }} />
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {HABIT_ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => setHabitIcon(icon)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{
                    background: habitIcon === icon ? 'var(--surface)' : 'transparent',
                    border: `1px solid ${habitIcon === icon ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 justify-center text-sm">Bæta við</button>
              <button type="button" onClick={() => setShowHabitForm(false)} className="btn btn-ghost">
                <X size={14} />
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-1.5">
          {habits.map(h => {
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span className="text-xl">{h.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium">{h.name}</span>
                  {streak > 0 && (
                    <span className="ml-2 text-xs" style={{ color: '#f97316' }}>
                      🔥 {streak} dagar
                    </span>
                  )}
                </div>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: h.color }} />
                <button onClick={() => removeHabit(h.id)} style={{ color: 'var(--muted)' }}>
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '1.0.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA install hint */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone 16: Veldu <strong style={{ color: 'var(--text)' }}>Deila</strong> → <strong style={{ color: 'var(--text)' }}>Bæta við heimaskjá</strong> til að nota Addi eins og native app án vafraslá.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Þetta mun eyða öllum gögnum í appinu. Þetta er ekki hægt að afturkalla.</p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
