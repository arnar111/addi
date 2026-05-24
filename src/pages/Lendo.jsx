import { useState } from 'react'
import { useLendo, MONTHLY_GOAL, LENDO_CATS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp } from 'lucide-react'

function GoalBar({ rev }) {
  const pct = Math.min(100, Math.round((rev / MONTHLY_GOAL) * 100))
  const isGoal = rev >= MONTHLY_GOAL
  const left = MONTHLY_GOAL - rev

  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(139,92,246,0.06))' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </div>
          <div className="text-3xl font-semibold" style={{ color: isGoal ? 'var(--success)' : 'var(--text)' }}>
            {formatISK(rev)}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{isGoal ? 'Markmiðið náð!' : 'Vantar'}</div>
          <div className="text-lg font-semibold" style={{ color: isGoal ? 'var(--success)' : '#f97316' }}>
            {isGoal ? '🎉' : formatShortISK(left)}
          </div>
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: isGoal ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af marki</span>
        <span>Markmið: {formatISK(MONTHLY_GOAL)}</span>
      </div>
    </div>
  )
}

const today = () => new Date().toISOString().split('T')[0]

export default function Lendo() {
  const { recentBookings, addBooking, removeBooking, monthlyRevenue, monthlyBookings, streak } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState(today())
  const [category, setCategory] = useState('veislusett')
  const [amount, setAmount] = useState('7000')
  const [days, setDays] = useState('1')
  const [note, setNote] = useState('')

  const rev = monthlyRevenue()
  const bk = monthlyBookings()
  const st = streak()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addBooking({ date, category, amount: Number(amount) * Number(days), note, days: Number(days) })
    setAmount('7000')
    setNote('')
    setDays('1')
    setDate(today())
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🏠 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigutekjur</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      <GoalBar rev={rev} />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Leigur', value: bk, icon: '📋' },
          { label: 'Meðaltal', value: bk > 0 ? formatShortISK(rev / bk) : '–', icon: '📊' },
          { label: 'Mánaðar-streak', value: `${st} mán`, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-bold text-base">{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigutekjur</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input text-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input text-sm" type="number" min="1" value={days} onChange={e => setDays(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Verð á dag (ISK)</label>
            <input className="input" type="number" placeholder="7000" value={amount} onChange={e => setAmount(e.target.value)} />
            {days > 1 && amount && (
              <div className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
                Samtals: {formatISK(Number(amount) * Number(days))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {LENDO_CATS.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span className="text-base">{c.icon}</span>
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>

          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <TrendingUp size={14} /> Skrá tekjur
          </button>
        </form>
      )}

      <div>
        <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>NÝLEGAR LEIGUR</h2>
        {recentBookings.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            <div className="text-3xl mb-2">🏠</div>
            <div className="text-sm">Engar leigur skráðar enn</div>
            <div className="text-xs mt-1">Ýttu á + Leiga til að byrja</div>
          </div>
        ) : recentBookings.map(b => {
          const cat = LENDO_CATS.find(c => c.id === b.category) || LENDO_CATS[3]
          return (
            <div key={b.id} className="card flex items-center gap-3 py-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: `${cat.color}22` }}>{cat.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{formatISK(b.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {cat.label}
                  {b.days > 1 ? ` · ${b.days} dagar` : ''}
                  {b.note ? ` · ${b.note}` : ''}
                  {' · '}
                  {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
