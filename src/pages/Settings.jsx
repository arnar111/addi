import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { User, MapPin, Trash2, Info, Bell, CreditCard } from 'lucide-react'
import { formatISK } from '../utils/currency'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { subs, monthlyTotal, alerts } = useSubscriptions()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_income', 'addi_notes', 'addi_budget', 'addi_subs']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
      </div>

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
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Veður er sótt fyrir Reykjavík (64.1°N, 21.9°W)</p>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Áskriftir</span>
          {alerts.length > 0 && (
            <span className="badge ml-auto" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              {alerts.length} vandamál
            </span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Samtals á mánuði</span>
          <span className="font-semibold">{formatISK(monthlyTotal())}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {subs.map(s => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <span>{s.icon}</span>
              <span className="flex-1">{s.name}</span>
              <span style={{ color: s.status !== 'ok' ? 'var(--danger)' : 'var(--muted)', fontSize: 12 }}>
                {s.status !== 'ok' ? '⚠️ ' : ''}{s.amount.toLocaleString('is-IS')} kr
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '1.1.0'],
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

      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone: Veldu "Deila" → "Bæta við heimaskjá" til að nota Addi eins og native app.
          Virkar einnig á Android með Chrome.
        </p>
      </div>

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
