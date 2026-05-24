import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWater } from '../hooks/useWater'
import { User, MapPin, Trash2, Info, Droplets, Bell } from 'lucide-react'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const [city, setCity] = useLocalStorage('addi_city', 'Reykjavík')
  const { goal: waterGoal, setGoal: setWaterGoal } = useWater()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = ['addi_tasks', 'addi_habits', 'addi_expenses', 'addi_income', 'addi_notes', 'addi_budget', 'addi_water']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) return alert('Þessi vafri styður ekki tilkynningar')
    const perm = await Notification.requestPermission()
    if (perm === 'granted') alert('Tilkynningar virkar! 🎉')
    else alert('Tilkynningar hafnaðar.')
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
        </div>
      </div>

      {/* Water goal */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Droplets size={15} style={{ color: '#3b82f6' }} />
          <span className="font-semibold text-sm">Vatnsdrykkja</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagleg markmið (glös)</label>
          <div className="flex gap-1">
            {[6, 7, 8, 9, 10, 12].map(n => (
              <button key={n} onClick={() => setWaterGoal(n)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: waterGoal === n ? 'rgba(59,130,246,0.15)' : 'var(--surface2)',
                  color: waterGoal === n ? '#3b82f6' : 'var(--muted)',
                  border: `1px solid ${waterGoal === n ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                }}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Tilkynningar</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Virkjaðu tilkynningar til að fá minningar um venjur og verkefni.
        </p>
        <button onClick={requestNotifications} className="btn btn-ghost text-sm">
          <Bell size={14} /> Virkja tilkynningar
        </button>
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
            ['Tækni', 'React 19 + Vite 8'],
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
