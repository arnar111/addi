import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, Smartphone, Trophy } from 'lucide-react'

const PL_TEAMS = [
  'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
  'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Ipswich',
  'Leicester', 'Liverpool', 'Man City', 'Man Utd', 'Newcastle',
  'Nottm Forest', 'Southampton', 'Spurs', 'West Ham', 'Wolves',
]

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const [favTeam, setFavTeam] = useLocalStorage('addi_fav_team', 'Arsenal')

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes', 'addi_budget', 'addi_subscriptions', 'addi_wishlist']
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

      {/* Favourite PL team */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={15} style={{ color: '#f59e0b' }} />
          <span className="font-semibold text-sm">Premier League lið</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Uppáhalds lið þitt birtist með hápunkti á mælaborðinu.</p>
        <div className="grid grid-cols-2 gap-1.5">
          {PL_TEAMS.map(team => (
            <button key={team} onClick={() => setFavTeam(team)}
              className="py-2 px-3 rounded-xl text-xs text-left font-medium transition-all"
              style={{
                background: favTeam === team ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                color: favTeam === team ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${favTeam === team ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
              }}>
              {favTeam === team ? '✓ ' : ''}{team}
            </button>
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

      {/* PWA install hint */}
      <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📱 Setja upp á heimaskjá</div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong>iPhone:</strong> Veldu "Deila" → "Bæta við heimaskjá" í Safari til að nota Addi eins og native app.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong>Android:</strong> Veldu "Bæta við heimaskjá" úr Chrome valmynd.
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
