import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Info, Trash2, Smartphone, Heart, Bell } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Addi')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const [lendoGoal, setLendoGoal] = useLocalStorage('lendo_goal', 200000)

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'lendo_bookings']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Stillingar</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Sérsníða Addi appið þitt</p>
      </div>

      {/* Profile */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Prófíll</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn / Gælunafn</label>
          <input className="input text-sm" value={name} onChange={e => setName(e.target.value)}
                 placeholder="Addi" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <MapPin size={11} /> Staður (veður)
          </label>
          <input className="input text-sm" value={city} onChange={e => setCity(e.target.value)}
                 placeholder="Reykjavík" />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Veðurstaður Reykjavík (64.14°N, 21.90°W) – Open-Meteo API
          </p>
        </div>
      </div>

      {/* Lendó settings */}
      <div className="card flex flex-col gap-4" style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🪑</span>
          <span className="font-semibold text-sm">Lendó stillingar</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarmarkmið (ISK)</label>
          <input className="input text-sm" type="number" value={lendoGoal}
                 onChange={e => setLendoGoal(Number(e.target.value))} />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Núverandi markmið: {new Intl.NumberFormat('is-IS').format(lendoGoal)} kr/mánuður
          </p>
        </div>
      </div>

      {/* App info */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Um Addi app</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Útgáfa', '1.0.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
            ['Veður', 'Open-Meteo'],
            ['Fótbolti', 'ESPN API'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Einkenni */}
      <div className="card flex flex-col gap-2.5" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Heart size={15} style={{ color: 'var(--accent2)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--accent2)' }}>Þitt Addi</span>
        </div>
        {[
          ['🔴', 'Arsenal FC · A* 2025/26'],
          ['🪑', 'Lendó leigustarfsemi'],
          ['🦜', 'Duolingo · 13 ára röð'],
          ['⚽', 'World Cup 2026 · 15 dagar'],
          ['🌍', 'Reykjavík · Garðabær'],
        ].map(([icon, text]) => (
          <div key={text} className="flex items-center gap-2 text-sm">
            <span>{icon}</span>
            <span style={{ color: 'var(--muted)' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* PWA install */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á iPhone</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone 16 Pro Max: Ýttu á <strong>Deila</strong> ↗ → <strong>"Bæta við heimaskjá"</strong> til að nota Addi eins og native app – fullan skjá, engin vafraslá.
        </p>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            📱 iPhone 16 Pro Max
          </span>
          <span className="px-2 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            💻 macOS / Windows
          </span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Hættuleg svæði</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Þetta mun eyða öllum gögnum: verkefnum, venjum, útgjöldum, minnisblöðum og Lendó gögnum. Þetta er óafturkræft.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
