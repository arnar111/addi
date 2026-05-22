import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useSavings } from '../hooks/useSavings'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK } from '../utils/currency'
import { User, MapPin, Trash2, Info, BarChart2, CreditCard, Target } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { monthlyTotal: subTotal, annualTotal: subAnnual } = useSubscriptions()
  const { goals, totalSaved } = useSavings()
  const { monthlyTotal, budget } = useFinance()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_subs', 'addi_shopping', 'addi_savings']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const spending = monthlyTotal()
  const savingsProgress = goals.length > 0
    ? Math.round((totalSaved / goals.reduce((s, g) => s + g.target, 0)) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
      </div>

      {/* Stats overview */}
      <div className="card flex flex-col gap-3"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Yfirlit</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Útgjöld mán.', value: formatShortISK(spending), icon: '💸' },
            { label: 'Áskriftir', value: formatShortISK(subTotal), icon: '📱' },
            { label: 'Sparnaður', value: `${savingsProgress}%`, icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-1 p-2.5 rounded-xl items-center text-center"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-xl">{s.icon}</span>
              <span className="font-semibold text-sm">{s.value}</span>
              <span className="text-xs leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription summary */}
      {subTotal > 0 && (
        <div className="card flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={15} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm">Áskriftir</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Mánaðarlegt</span>
            <span className="font-semibold">{formatISK(subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Árlegt</span>
            <span className="font-semibold" style={{ color: 'var(--danger)' }}>{formatISK(subAnnual)}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Áskriftir eru {Math.round((subTotal / budget.monthly) * 100)}% af mánaðarlegri fjárhagsáætlun.
          </p>
        </div>
      )}

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
            <MapPin size={11} /> Staður
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
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

      {/* PWA install */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone: Veldu "Deila" → "Bæta við heimaskjá" til að nota Addi eins og native app.
          Á Android: Veldu "Bæta við heimaskjá" úr Chrome valmynd.
        </p>
      </div>

      {/* Danger */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Þetta mun eyða öllum gögnum í appinu og er ekki hægt að afturkalla.</p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
