import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Flame, TrendingUp, Package, Target, BarChart2 } from 'lucide-react'

const C = '#f59e0b'

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="card-sm flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
        {Icon && <Icon size={13} style={{ color: color || C }} />}
      </div>
      <div className="text-xl font-bold" style={{ color: color || C }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  )
}

export default function Lendo() {
  const {
    rentals, goal, setGoal,
    addRental, removeRental,
    currentMonth, monthlyEarnings, avgPerRental, totalEarnings,
    streak, byItem, recentRentals,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [item, setItem] = useState(LENDO_ITEMS[0])
  const [days, setDays] = useState('1')
  const [amount, setAmount] = useState('7000')
  const [note, setNote] = useState('')
  const [goalInput, setGoalInput] = useState(String(goal))

  const earned = monthlyEarnings()
  const pct    = Math.min(100, Math.round((earned / goal) * 100))
  const count  = currentMonth().length
  const s      = streak()
  const avg    = avgPerRental()
  const total  = totalEarnings()
  const items  = byItem()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount) return
    addRental(item, days, amount, note)
    setDays('1'); setAmount('7000'); setNote('')
    setShowForm(false)
  }

  const saveGoal = () => {
    const v = Number(goalInput)
    if (v > 0) setGoal(v)
    setShowGoalEdit(false)
  }

  const nowLabel = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {nowLabel} · {count} leiga{count !== 1 ? 'r' : ''} skráðar
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn"
                style={{ background: C, color: '#000', fontWeight: 600 }}>
          <Plus size={16} /> Skrá leigu
        </button>
      </div>

      {/* Monthly goal card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.06))',
        border: '1px solid rgba(245,158,11,0.25)',
      }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-4xl font-bold" style={{ color: C }}>{formatISK(earned)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Markmið: {formatShortISK(goal)}
            </div>
            <div className="text-2xl font-bold" style={{ color: pct >= 100 ? 'var(--success)' : C }}>
              {pct}%
            </div>
            {s > 0 && (
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#f97316' }}>
                <Flame size={12} /> {s} daga streak
              </div>
            )}
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : `linear-gradient(90deg, ${C}, #f97316)` }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{formatShortISK(earned)} af {formatShortISK(goal)}</span>
          <button onClick={() => { setGoalInput(String(goal)); setShowGoalEdit(!showGoalEdit) }}
                  style={{ color: C }}>
            Breyta markmiði
          </button>
        </div>

        {showGoalEdit && (
          <div className="mt-3 flex gap-2 animate-slide-up">
            <input className="input text-sm flex-1" type="number" value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              placeholder="Mánaðarlegt markmið (ISK)" />
            <button onClick={saveGoal} className="btn" style={{ background: C, color: '#000' }}>Vista</button>
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-ghost"><X size={14} /></button>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Leigur í mánuð" value={String(count)} icon={Package}
                  sub={count > 0 ? `${count} bókanir` : 'Engar enn'} />
        <StatCard label="Meðaltals leiga" value={avg > 0 ? formatShortISK(avg) : '—'} icon={BarChart2}
                  sub="á hverja bókun" />
        <StatCard label="Heildartekjur" value={formatShortISK(total)} icon={TrendingUp}
                  sub="síðan í byrjun" color="var(--accent)" />
        <StatCard label="Eftir af markmiði" value={formatShortISK(Math.max(0, goal - earned))} icon={Target}
                  sub={pct >= 100 ? '🎉 Markmiðið náð!' : `${100 - pct}% eftir`}
                  color={pct >= 100 ? 'var(--success)' : C} />
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: `1px solid rgba(245,158,11,0.3)` }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný leiga</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur til leigu</label>
            <select className="input text-sm" value={item} onChange={e => setItem(e.target.value)}>
              {LENDO_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => setDays(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input text-sm" type="number" value={amount}
                onChange={e => setAmount(e.target.value)} autoFocus />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Athugasemd (valkvæmt)</label>
            <input className="input text-sm" placeholder="t.d. nafn leigjanda eða tilvísun..."
              value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <button type="submit" className="btn w-full justify-center font-semibold"
                  style={{ background: C, color: '#000' }}>
            <Plus size={16} /> Skrá leigu
          </button>
        </form>
      )}

      {/* Income by item */}
      {Object.keys(items).length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-sm mb-3">Tekjur eftir hlutum</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(items)
              .sort(([, a], [, b]) => b - a)
              .map(([name, amt]) => {
                const p = Math.round((amt / earned) * 100)
                return (
                  <div key={name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate">{name}</span>
                      <span style={{ color: C }}>{formatShortISK(amt)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full"
                           style={{ width: `${p}%`, background: C }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Rental history */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-sm">Leiguferill</h3>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{rentals.length} samtals</span>
        </div>

        {recentRentals.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            <div className="text-4xl mb-3">🏠</div>
            <div className="text-sm font-medium">Engar leigur ennþá</div>
            <div className="text-xs mt-1">Skráðu fyrstu leigu þína hér að ofan</div>
          </div>
        ) : recentRentals.map(r => (
          <div key={r.id} className="card flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                 style={{ background: 'rgba(245,158,11,0.15)' }}>
              🏠
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{r.item}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {r.days} dag{r.days !== 1 ? 'ar' : 'ur'} · {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
                {r.note ? ` · ${r.note}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold" style={{ color: C }}>
                {formatShortISK(r.amount)}
              </span>
              <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
