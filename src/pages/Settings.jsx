import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Info, Trash2, ExternalLink, Bell } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Alfred.is', url: 'https://alfred.is', desc: 'Íslenskt atvinnumiðlun', icon: '💼' },
  { label: 'The Athletic', url: 'https://theathletic.com', desc: 'Íþróttafréttir', icon: '⚽' },
  { label: 'LinkedIn', url: 'https://linkedin.com/jobs', desc: 'Störf á LinkedIn', icon: '🔗' },
  { label: 'Glassdoor', url: 'https://glassdoor.com', desc: 'Launakannanir', icon: '💰' },
  { label: 'Wolt', url: 'https://wolt.com', desc: 'Matarafgreiðsla', icon: '🍔' },
  { label: 'Trip.com', url: 'https://trip.com', desc: 'Ferðalög', icon: '✈️' },
]

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Hafnarfjörður')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_jobs', 'addi_subscriptions']
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
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Veðurstaður er stilltur á Hafnarfjörður</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <ExternalLink size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Flýtileiðir</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 rounded-xl transition-all"
               style={{ background: 'var(--surface2)' }}>
              <span className="text-xl">{l.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium">{l.label}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{l.desc}</div>
              </div>
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
            ['Útgáfa', '1.0'],
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
        <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <Bell size={14} /> 📱 Setja upp á heimaskjá (iPhone 16)
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Safari → Deila (□↑) → "Bæta við heimaskjá" → Bæta við.
          Addi keyrir þá eins og native app með fullskjásham.
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
