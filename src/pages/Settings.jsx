import { useLocalStorage } from '../hooks/useLocalStorage'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { User, MapPin, Info, Trash2, Smartphone, Download, RefreshCw } from 'lucide-react'
import { formatISK } from '../utils/currency'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { monthlyTotal, monthlyIncome } = useFinance()
  const { monthlyTotal: subMonthly, subs } = useSubscriptions()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum í Addi!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_incomes', 'addi_notes', 'addi_budget', 'addi_subscriptions']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const stats = [
    { label: 'Útgjöld/mán', value: formatISK(monthlyTotal()) },
    { label: 'Tekjur/mán', value: monthlyIncome() > 0 ? formatISK(monthlyIncome()) : '—' },
    { label: 'Áskriftir/mán', value: formatISK(subMonthly()) },
    { label: 'Fjöldi áskrifta', value: `${subs.filter(s => s.active).length}` },
  ]

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
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Veðurgögn sótt frá Open-Meteo (Reykjavík: 64.1°N, 21.9°W)
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Þessi mánuður</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
              <span className="font-semibold text-sm">{value}</span>
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
            ['Útgáfa', '2.0.0'],
            ['Dagsetning', 'Maí 2026'],
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
      <div className="card flex flex-col gap-2"
           style={{ border: '1px solid rgba(0,212,170,0.2)', background: 'rgba(0,212,170,0.03)' }}>
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Setja upp á heimaskjá</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>iPhone (Safari):</strong> Veldu deila-hnapp → "Bæta við heimaskjá"
          {'\n'}
          <strong style={{ color: 'var(--text)' }}>Android (Chrome):</strong> Þrípunktar → "Bæta við heimaskjá"
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða öllum gögnum — verkefnum, venjum, fjármálum og minnisblöðum.
          Þetta er ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
