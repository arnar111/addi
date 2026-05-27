import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHabits } from '../hooks/useHabits'
import { useLendo } from '../hooks/useLendo'
import { User, MapPin, Trash2, Info, Bell, Home, Heart, Plus, X } from 'lucide-react'
import { formatISK } from '../utils/currency'
import { useState } from 'react'

const EMOJI_LIST = ['⭐', '🏃', '🧠', '🎯', '📖', '🎸', '🍎', '☕', '🧘', '🌿', '💪', '🛌', '🎨', '✍️', '🎵']
const COLOR_LIST = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#22c55e', '#ec4899', '#eab308', '#ef4444', '#00b4d8', '#a855f7']

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const { habits, add: addHabit, remove: removeHabit } = useHabits()
  const { goal, setGoal } = useLendo()
  const [showNewHabit, setShowNewHabit] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitIcon, setHabitIcon] = useState('⭐')
  const [habitColor, setHabitColor] = useState('#00d4aa')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða ÖLLUM gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits_v2', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_lendo', 'addi_income']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!habitName.trim()) return
    addHabit(habitName.trim(), habitIcon, habitColor)
    setHabitName('')
    setShowNewHabit(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      <div className="px-1 pt-4">
        <h1 className="text-xl font-bold">Stillingar</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Sérsníðaðu Addi eftir þér</p>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Prófíll</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <MapPin size={14} style={{ color: 'var(--muted)' }} />
          <div>
            <div className="text-sm font-medium">Reykjavík, Ísland</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Veðurstaður · 64.14°N 21.90°W</div>
          </div>
        </div>
      </div>

      {/* Lendó settings */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Home size={15} style={{ color: 'var(--lendo)' }} />
          <span className="font-semibold text-sm">Lendó markmið</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarlegar tekjumarkmið (ISK)</label>
          <input className="input text-sm" type="number" value={goal}
                 onChange={e => setGoal(Number(e.target.value))} />
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Núverandi markmið: {formatISK(goal)}
          </div>
        </div>
      </div>

      {/* Habits management */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Heart size={15} style={{ color: '#ef4444' }} />
            <span className="font-semibold text-sm">Vanir ({habits.length})</span>
          </div>
          <button onClick={() => setShowNewHabit(!showNewHabit)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>
            {showNewHabit ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>

        {showNewHabit && (
          <form onSubmit={handleAddHabit} className="flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
                style={{ background: 'var(--surface2)' }}>
            <input className="input text-sm" placeholder="Nafn á vana..." value={habitName}
                   onChange={e => setHabitName(e.target.value)} autoFocus />
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_LIST.map(e => (
                <button key={e} type="button" onClick={() => setHabitIcon(e)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                  style={{ background: habitIcon === e ? 'rgba(0,212,170,0.2)' : 'var(--surface)', border: `1px solid ${habitIcon === e ? 'var(--accent)' : 'var(--border)'}` }}>
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_LIST.map(c => (
                <button key={c} type="button" onClick={() => setHabitColor(c)}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: habitColor === c ? '#fff' : 'transparent' }} />
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center text-sm">Bæta við vana</button>
          </form>
        )}

        <div className="flex flex-col gap-1.5">
          {habits.map(h => (
            <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{h.icon}</span>
              <span className="flex-1 text-sm font-medium">{h.name}</span>
              <div className="w-3 h-3 rounded-full" style={{ background: h.color }} />
              <button onClick={() => removeHabit(h.id)} className="p-1" style={{ color: 'var(--muted)' }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Útgáfa', '1.0.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
          ].map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{k}</div>
              <div className="text-sm font-medium">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PWA install */}
      <div className="card" style={{ border: '1px solid rgba(0,212,170,0.2)', background: 'rgba(0,212,170,0.04)' }}>
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>iPhone (Safari):</strong> Veldu 🔗 → "Add to Home Screen"<br />
          <strong style={{ color: 'var(--text)' }}>Android (Chrome):</strong> Veldu ⋮ → "Add to Home Screen"<br />
          <strong style={{ color: 'var(--text)' }}>Desktop:</strong> Veldu install táknið í veffangastikunni
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða ÖLLUM gögnum í Addi appinu. Þetta er ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
