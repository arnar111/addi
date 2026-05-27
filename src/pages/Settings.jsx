import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, Smartphone, Bell, ExternalLink } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useFinance } from '../hooks/useFinance'
import { useHabits } from '../hooks/useHabits'
import { useTasks } from '../hooks/useTasks'
import { formatISK, formatShortISK } from '../utils/currency'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { monthlyTotal: subMonthly, yearlyTotal: subYearly, subs } = useSubscriptions()
  const { monthlyTotal, budget } = useFinance()
  const { habits, todayDone } = useHabits()
  const { tasks, pending, done } = useTasks()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_income', 'addi_subscriptions']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const dataSize = (() => {
    let total = 0
    for (let key in localStorage) {
      if (key.startsWith('addi_')) total += (localStorage[key] || '').length
    }
    return (total / 1024).toFixed(1)
  })()

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
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Veðurstaður er stilltur á Reykjavík</p>
        </div>
      </div>

      {/* Stats */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Tölfræði</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['✅ Verkefni', `${tasks.length} total`],
            ['🔥 Vanir', `${habits.length} vanir`],
            ['💳 Áskriftir', `${formatShortISK(subMonthly)}/mán`],
            ['💾 Gögn', `${dataSize} KB`],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
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
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Setja upp á heimaskjá</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>iPhone (Safari):</strong> Veldu "Deila" (⬆️) → "Bæta við heimaskjá"
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Android (Chrome):</strong> Veldu ⋮ → "Bæta við heimaskjá"
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða öllum gögnum í appinu. Þetta er ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
