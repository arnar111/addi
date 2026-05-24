import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHabits } from '../hooks/useHabits'
import { User, MapPin, Info, Trash2, Plus, X, Flame, ExternalLink } from 'lucide-react'

const HABIT_ICONS = ['🏋️', '📚', '💧', '🧘', '🏃', '🥗', '☕', '🎸', '✍️', '🌅', '💊', '🚶', '🧹', '💻', '🎯', '😴']
const HABIT_COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e', '#eab308', '#ef4444']

const MY_APPS = [
  { name: 'Lendo App', url: 'https://lendoapp.is', icon: '🏦', desc: 'Lánveitandi' },
  { name: 'Spiran', url: 'https://spiran.netlify.app', icon: '🌿', desc: 'Plönturakningur' },
  { name: 'Draumakaup', url: 'https://draumakaup.netlify.app', icon: '⚽', desc: 'Man United millifærslur' },
  { name: 'Betri Þú', url: 'https://betrithu.netlify.app', icon: '💪', desc: 'Persónuleg þróun' },
  { name: 'Gleði', url: 'https://gledi.netlify.app', icon: '😊', desc: 'Gleðirakningur' },
  { name: 'Mamma Uppskriftir', url: 'https://mamma-recipes-arnar.netlify.app', icon: '🍳', desc: 'Uppskriftir' },
  { name: 'Claude Námskeið', url: 'https://claudenamskeid.netlify.app', icon: '🤖', desc: 'AI námskeið' },
  { name: 'Netlify', url: 'https://app.netlify.com', icon: '⚡', desc: 'Hýsing' },
]

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { habits, add: addHabit, remove: removeHabit, update: updateHabit, isDoneToday, streakFor } = useHabits()

  const [showHabitForm, setShowHabitForm] = useState(false)
  const [hName, setHName] = useState('')
  const [hIcon, setHIcon] = useState('⭐')
  const [hColor, setHColor] = useState('#00d4aa')

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!hName.trim()) return
    addHabit(hName.trim(), hIcon, hColor)
    setHName(''); setShowHabitForm(false)
  }

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_income', 'addi_savings', 'addi_life_goals']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2">
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

      {/* Habit management */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={15} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm">Vanar</span>
          </div>
          <button onClick={() => setShowHabitForm(v => !v)} className="btn btn-ghost text-xs py-1 px-2">
            <Plus size={13} /> Bæta við
          </button>
        </div>

        {showHabitForm && (
          <form onSubmit={handleAddHabit} className="flex flex-col gap-3 p-3 rounded-xl animate-slide-up"
                style={{ background: 'var(--surface2)' }}>
            <div className="flex flex-wrap gap-1.5">
              {HABIT_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setHIcon(ic)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: hIcon === ic ? 'rgba(0,212,170,0.25)' : 'var(--surface)', border: hIcon === ic ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
                  {ic}
                </button>
              ))}
            </div>
            <input className="input text-sm" placeholder="Nafn vana..." value={hName} onChange={e => setHName(e.target.value)} autoFocus />
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Litur:</span>
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setHColor(c)}
                  className="w-5 h-5 rounded-full"
                  style={{ background: c, outline: hColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2, transform: hColor === c ? 'scale(1.25)' : 'scale(1)' }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 text-sm">Búa til vana</button>
              <button type="button" onClick={() => setShowHabitForm(false)} className="btn btn-ghost"><X size={14} /></button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span className="text-lg">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{h.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                    {streak > 0 && (
                      <span className="text-xs" style={{ color: '#f97316' }}>🔥 {streak} dagar í röð</span>
                    )}
                    {done && <span className="text-xs" style={{ color: 'var(--success)' }}>✓ Lokið í dag</span>}
                  </div>
                </div>
                <button onClick={() => removeHabit(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* My Apps */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 15 }}>⚡</span>
          <span className="font-semibold text-sm">Öpp mín</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {MY_APPS.map(app => (
            <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span style={{ fontSize: 20 }}>{app.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{app.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{app.desc}</div>
              </div>
              <ExternalLink size={13} style={{ color: 'var(--muted)', shrink: 0 }} />
            </a>
          ))}
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[['Útgáfa', '1.1.0'], ['Útgáfudagur', 'Maí 2026'], ['Tækni', 'React + Vite'], ['Hýsing', 'Netlify']].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA hint */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá (iPhone)</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Í Safari: Veldu <strong>Deila ↑</strong> → <strong>Bæta við heimaskjá</strong> til að nota Addi eins og native app með fullskjámynd og hraðari hleðslu.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2">
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
