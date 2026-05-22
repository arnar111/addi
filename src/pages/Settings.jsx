import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHabits } from '../hooks/useHabits'
import { User, MapPin, Trash2, Info, Plus, X, Timer, Smartphone } from 'lucide-react'
import { useState } from 'react'

const HABIT_ICONS = ['🏋️', '⛳', '📚', '💧', '🧘', '🎯', '🚶', '🏃', '🎵', '🍎', '✍️', '🌅', '💊', '🛌', '🧠']
const HABIT_COLORS = ['#00d4aa', '#22c55e', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#eab308', '#ef4444']

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { habits, add: addHabit, remove: removeHabit } = useHabits()
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitIcon, setHabitIcon] = useState('⭐')
  const [habitColor, setHabitColor] = useState('#00d4aa')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_subs']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!habitName.trim()) return
    addHabit(habitName.trim(), habitIcon, habitColor)
    setHabitName('')
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <span className="font-semibold text-sm">Vanur</span>
          </div>
          <button onClick={() => setShowHabitForm(!showHabitForm)}
                  className="btn text-xs py-1" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            <Plus size={12} /> Nýr vani
          </button>
        </div>

        {showHabitForm && (
          <form onSubmit={handleAddHabit} className="flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
                style={{ background: 'var(--surface2)' }}>
            <input className="input text-sm" placeholder="Heiti vana..." value={habitName}
                   onChange={e => setHabitName(e.target.value)} autoFocus />
            <div className="flex flex-wrap gap-1.5">
              {HABIT_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setHabitIcon(ic)}
                        className="w-8 h-8 rounded-lg text-base flex items-center justify-center"
                        style={{ background: habitIcon === ic ? 'rgba(0,212,170,0.2)' : 'var(--surface)',
                                 border: `1px solid ${habitIcon === ic ? 'var(--accent)' : 'transparent'}` }}>
                  {ic}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setHabitColor(c)}
                        className="w-7 h-7 rounded-full"
                        style={{ background: c, border: `2px solid ${habitColor === c ? '#fff' : 'transparent'}` }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 text-xs justify-center">Vista</button>
              <button type="button" onClick={() => setShowHabitForm(false)} className="btn btn-ghost">
                <X size={14} />
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {habits.map(h => (
            <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{h.icon}</span>
              <span className="text-sm flex-1">{h.name}</span>
              <button onClick={() => removeHabit(h.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pomodoro / Timer quick access */}
      <div className="card flex items-center gap-3"
           style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
        <Timer size={18} style={{ color: 'var(--accent)' }} />
        <div className="flex-1">
          <div className="text-sm font-medium">Pomodoro tímari</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>25 mín einbeiting · 5 mín hlé</div>
        </div>
        <a href="/timer" className="btn text-xs"
           style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
          Opna
        </a>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '2.0.0'],
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
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Setja upp á heimaskjá</div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>iPhone:</strong> Deila → "Bæta við heimaskjá"<br />
          <strong style={{ color: 'var(--text)' }}>Android:</strong> Chrome → "Bæta við heimaskjá"
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
