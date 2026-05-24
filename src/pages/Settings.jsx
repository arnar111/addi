import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Wallet, Trash2, Info, Calendar, ExternalLink } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const [paydayDay, setPaydayDay] = useLocalStorage('addi_payday', 25)
  const [income, setIncome] = useLocalStorage('addi_income', 0)

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_subscriptions']
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

      {/* Finance settings */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Fjármál</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Calendar size={11} /> Launadagur (dagur mánaðarins)
          </label>
          <div className="flex items-center gap-3">
            <input className="input text-sm" type="number" min={1} max={31}
              value={paydayDay} onChange={e => setPaydayDay(Math.max(1, Math.min(31, Number(e.target.value))))}
              style={{ maxWidth: 100 }} />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {paydayDay}. hvers mánaðar
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg laun (ISK) — valkvæmt</label>
          <input className="input text-sm" type="number" placeholder="0"
            value={income || ''} onChange={e => setIncome(Number(e.target.value))} />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Notað til að sýna sparnaðarhlutfall í fjármálum
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <ExternalLink size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Tenglar</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['🏦', 'Lendo', 'https://lendoapp.is'],
            ['⚽', 'Man United', 'https://www.manutd.com'],
            ['📰', 'RÚV', 'https://www.ruv.is'],
            ['🌡️', 'Veður', 'https://en.vedur.is'],
          ].map(([icon, label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 rounded-xl text-sm transition-all"
               style={{ background: 'var(--surface2)', color: 'var(--text)', textDecoration: 'none' }}>
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
              <ExternalLink size={11} className="ml-auto" style={{ color: 'var(--muted)' }} />
            </a>
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
          Á iPhone: Veldu "Deila" → "Bæta við heimaskjá" til að nota Addi eins og native app.
          Á Android: Veldu "Bæta við heimaskjá" úr Chrome valmynd.
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
