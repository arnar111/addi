import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLendo } from '../hooks/useLendo'
import { User, MapPin, Trash2, Info, ExternalLink, Home, Target, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Addi')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const lendo = useLendo()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_lendo', 'addi_jobs']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-bold">Stillingar</h1>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
               style={{ background: 'var(--accent)', color: '#000' }}>A</div>
          <div>
            <div className="font-semibold">Arnar Friðriksson</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>arnar1992@gmail.com</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Gælunafn</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <MapPin size={11} /> Staður (veður)
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)} />
        </div>
      </div>

      {/* Lendó settings */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Home size={15} style={{ color: '#22c55e' }} />
          <span className="font-semibold text-sm">Lendó Stillingar</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarlegt tekjumarkmið (ISK)</label>
          <input className="input text-sm" type="number" value={lendo.monthlyGoal}
            onChange={e => lendo.updateGoal(Number(e.target.value))} />
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          Skráningar eru stillanlegar á Fjármál → Tekjur síðunni.
        </div>
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-2">
        <div className="text-sm font-semibold mb-1">Hlekkir</div>
        {[
          { label: '🏠 Lendó', url: 'https://lendo.is', desc: 'Leigumarkaðurinn þinn' },
          { label: '💼 LinkedIn', url: 'https://linkedin.com', desc: 'Premium prófíll' },
          { label: '📰 The Athletic', url: 'https://theathletic.com', desc: 'Fótboltar fréttir' },
          { label: '🎯 Alfred.is', url: 'https://alfred.is', desc: 'Starf á Íslandi' },
          { label: '🛒 Krónan', url: 'https://kronan.is', desc: 'Dagvöruverslun' },
        ].map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 py-2 rounded-xl px-2 no-underline transition-all hover:bg-[var(--surface2)]">
            <div className="flex-1">
              <div className="text-sm">{l.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{l.desc}</div>
            </div>
            <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
          </a>
        ))}
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Útgáfa', 'v2.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-semibold text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA install */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.25)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone 16 Pro Max: Smelltu á <strong>Deila ↑</strong> → <strong>"Bæta við heimaskjá"</strong>.
          Þú fær fullt skjá app með Dynamic Island stuðningi! 🔥
        </p>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Eyða gögnum</span>
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
