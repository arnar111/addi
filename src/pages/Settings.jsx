import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, ExternalLink, Home } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Addi')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const [lendoGoal, setLendoGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_income', 'addi_notes', 'addi_budget', 'addi_lendo_rentals']
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
            <MapPin size={11} /> Staður
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
        </div>
      </div>

      {/* Lendó settings */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home size={15} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm">Lendó</span>
          </div>
          <a href="https://lendoapp.is" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
            Opna Lendó <ExternalLink size={11} />
          </a>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg tekjumarkmið (ISK)</label>
          <input className="input text-sm" type="number" value={lendoGoal}
            onChange={e => setLendoGoal(Number(e.target.value))} />
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2">
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
          Á iPhone: Veldu "Deila" → "Bæta við heimaskjá" til að nota Addi eins og native app í fullskjá.
        </p>
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <span className="font-semibold text-sm">Tenglar</span>
        <div className="flex flex-col gap-2">
          {[
            { name: 'Lendó', url: 'https://lendoapp.is', icon: '🏠' },
            { name: 'Alfred greiðslur', url: 'https://alfred.is', icon: '💳' },
            { name: 'Academia.edu', url: 'https://academia.edu', icon: '📄' },
            { name: 'Coursera', url: 'https://coursera.org', icon: '🎓' },
          ].map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 p-2.5 rounded-xl"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span>{l.icon}</span>
              <span className="text-sm flex-1">{l.name}</span>
              <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða öllum gögnum í appinu. Ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
