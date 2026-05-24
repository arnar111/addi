import { useState } from 'react'
import { useLendo, LENDO_CATEGORIES } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target, Calendar } from 'lucide-react'

function CategoryBar({ cat, amount }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base shrink-0">{cat.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: 'var(--muted)' }}>{cat.label}</span>
          <span className="font-medium">{formatShortISK(amount)}</span>
        </div>
      </div>
    </div>
  )
}

function RentalCard({ rental, onRemove }) {
  const cat = LENDO_CATEGORIES.find(c => c.id === rental.category) || LENDO_CATEGORIES[4]
  return (
    <div className="card flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
           style={{ background: `${cat.color}22` }}>{cat.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{formatISK(rental.amount)}</div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {rental.item || cat.label}
          {rental.renter ? ` · ${rental.renter}` : ''}
          {' · '}{new Date(rental.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <button onClick={() => onRemove(rental.id)} style={{ color: 'var(--muted)' }}>
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function Lendo() {
  const { rentals, goal, setGoal, addRental, removeRental, monthTotal, monthRentals, allTimeTotal, byCategory, streak } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('overview')

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('veislur')
  const [item, setItem] = useState('')
  const [renter, setRenter] = useState('')

  const now = new Date()
  const total = monthTotal()
  const mr = monthRentals()
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const remaining = goal - total
  const cats = byCategory()
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental({ amount: Number(amount), category, item, renter })
    setAmount('')
    setItem('')
    setRenter('')
    setShowForm(false)
  }

  const dailyNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏷️</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {now.toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Revenue overview card */}
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(139,92,246,0.07))',
                    borderColor: 'rgba(249,115,22,0.2)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
                    className="text-xs" style={{ color: 'var(--accent)' }}>Markmið ✏️</button>
            <div className="text-lg font-semibold"
                 style={{ color: pct >= 100 ? 'var(--success)' : 'var(--accent)' }}>
              {pct}%
            </div>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3 flex gap-2 items-center">
            <input className="input text-sm flex-1" type="number" value={goal}
                   onChange={e => setGoal(Number(e.target.value))} placeholder="Markmið (ISK)" />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`,
                        background: pct >= 100 ? 'var(--success)'
                          : pct > 70 ? '#f97316'
                          : 'linear-gradient(90deg, #f97316, #8b5cf6)' }} />
        </div>

        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct >= 100 ? '🎉 Markmiðið náð!' : `${formatShortISK(remaining)} eftir`}</span>
          <span>Markmið: {formatISK(goal)}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Leigur', value: mr.length, icon: '📋' },
            { label: 'Dagar eftir', value: daysLeft, icon: '📅' },
            { label: 'Þarf/dag', value: remaining > 0 ? formatShortISK(dailyNeeded) : '✓', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 py-2 rounded-xl"
                 style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-base">{s.icon}</span>
              <span className="text-sm font-semibold">{s.value}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input text-sm" placeholder="Hlutur (t.d. borðsett)" value={item}
                 onChange={e => setItem(e.target.value)} />
          <input className="input text-sm" placeholder="Leigutaki (valkvæmt)" value={renter}
                 onChange={e => setRenter(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {LENDO_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>
                  {c.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['rentals', 'Leigur'], ['alltime', 'Alla tíð']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Eftir flokkum</h3>
          {LENDO_CATEGORIES.map(c => {
            const amt = cats[c.id] || 0
            if (amt === 0) return null
            return <CategoryBar key={c.id} cat={c} amount={amt} />
          })}
          {Object.keys(cats).length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>
              Engar leigur enn þennan mánuð
            </p>
          )}
        </div>
      )}

      {tab === 'rentals' && (
        <div className="flex flex-col gap-2">
          {mr.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar leigur þennan mánuð
            </div>
          ) : mr.map(r => (
            <RentalCard key={r.id} rental={r} onRemove={removeRental} />
          ))}
        </div>
      )}

      {tab === 'alltime' && (
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Heildar tekjur', value: formatISK(allTimeTotal()), icon: '💰' },
                { label: 'Heildar leigur', value: rentals.length, icon: '📋' },
                { label: 'Streak (mánuðir)', value: streak(), icon: '🔥' },
                { label: 'Meðaltal/leiga', value: rentals.length ? formatShortISK(allTimeTotal() / rentals.length) : '—', icon: '📊' },
              ].map(s => (
                <div key={s.label} className="flex flex-col gap-1 p-3 rounded-xl"
                     style={{ background: 'var(--surface2)' }}>
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-base font-semibold">{s.value}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {rentals.slice(0, 20).map(r => (
              <RentalCard key={r.id} rental={r} onRemove={removeRental} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
