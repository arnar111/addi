import { useLocalStorage } from '../hooks/useLocalStorage'
import { User, MapPin, Trash2, Info, Smartphone, Timer, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLendo } from '../hooks/useLendo'
import { useFinance } from '../hooks/useFinance'
import { formatShortISK } from '../utils/currency'

export default function Settings() {
  const [name, setName] = useLocalStorage('addi_name', 'Arnar')
  const { goal: lendoGoal, setGoal: setLendoGoal } = useLendo()
  const { budget, setBudget } = useFinance()

  const clearData = () => {
    if (!confirm('Ertu viss? Þetta mun eyða öllum gögnum!')) return
    const keys = [
      'addi_tasks', 'addi_habits', 'addi_expenses', 'addi_notes',
      'addi_budget', 'addi_lendo_bookings', 'addi_lendo_goal',
    ]
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
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'var(--surface2)' }}>
          <MapPin size={14} style={{ color: 'var(--muted)' }} />
          <span style={{ color: 'var(--muted)' }}>Veðurstöðin er stillt á</span>
          <span className="ml-auto font-medium">Reykjavík</span>
        </div>
      </div>

      {/* Lendo settings */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store size={15} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm">Lendo</span>
          </div>
          <Link to="/lendo" className="text-xs" style={{ color: 'var(--accent)' }}>
            Opna →
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarmarkmið (ISK)</label>
          <input className="input text-sm" type="number" value={lendoGoal}
            onChange={e => setLendoGoal(Number(e.target.value))} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Núv.: {formatShortISK(lendoGoal)} / mán.
          </span>
        </div>
      </div>

      {/* Finance settings */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Timer size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Fjárhagsáætlun</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</label>
          <input className="input text-sm" type="number"
            value={budget.monthly}
            onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Núv.: {formatShortISK(budget.monthly)} / mán.
          </span>
        </div>
      </div>

      {/* PWA install */}
      <div className="card flex flex-col gap-2"
        style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-center gap-2">
          <Smartphone size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
            Setja upp á heimaskjá
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á iPhone: Veldu "Deila" (□↑) → "Bæta við heimaskjá" til að nota Addi eins og native app með fullskjá.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Á Android: Veldu "⋮" í Chrome → "Bæta við heimaskjá".
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
            ['Útgáfa', 'v1.0'],
            ['Útgáfudagur', 'Maí 2026'],
            ['Tækni', 'React + Vite'],
            ['Hýsing', 'Netlify'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 p-2.5 rounded-xl"
              style={{ background: 'var(--surface2)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{k}</span>
              <span className="font-medium text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card flex flex-col gap-3"
        style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
            Hættuleg svæði
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Eyðir öllum gögnum: verkefni, venjur, gjöld, Lendo bókanir og minnisblöð. Ekki hægt að afturkalla.
        </p>
        <button onClick={clearData} className="btn btn-danger w-full justify-center">
          <Trash2 size={14} /> Eyða öllum gögnum
        </button>
      </div>
    </div>
  )
}
