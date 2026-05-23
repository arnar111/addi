import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, Timer, FileText, Trophy, Briefcase, ChevronRight } from 'lucide-react'

const QUICK_NAV = [
  { to: '/notes', icon: FileText, label: 'Minnisblöð', desc: 'Skoða öll minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari', desc: 'Pomodoro & einbeiting' },
]

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_jobs']
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
            <MapPin size={11} /> Staður
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Veðurstaður er stilltur á Reykjavík</p>
        </div>
      </div>

      {/* Quick nav to pages not in bottom nav */}
      <div className="card flex flex-col gap-1 p-2">
        <p className="text-xs px-2 py-1 font-semibold" style={{ color: 'var(--muted)' }}>FLEIRI SÍÐUR</p>
        {QUICK_NAV.map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[var(--surface2)]"
                style={{ textDecoration: 'none', color: 'var(--text)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: 'var(--surface2)' }}>
              <Icon size={17} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</div>
            </div>
            <ChevronRight size={15} style={{ color: 'var(--muted)' }} />
          </Link>
        ))}
      </div>

      {/* PWA install hint */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone: Safari → Deila 󰏁 → "Bæta við heimaskjá" til að nota Addi eins og native app án vafrastiku.
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Á Android: Chrome → valmynd → "Bæta við heimaskjá"
        </p>
      </div>

      {/* App info */}
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
