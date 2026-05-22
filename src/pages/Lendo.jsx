import { useState } from 'react'
import { useLendo, LENDO_CATS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target } from 'lucide-react'

function MiniBar({ months }) {
  const max = Math.max(...months.map(m => m.total), 1)
  return (
    <div className="flex items-end gap-1 h-16">
      {months.map((m, i) => {
        const h = Math.max(4, Math.round((m.total / max) * 64))
        const isLast = i === months.length - 1
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-sm transition-all"
                 style={{
                   height: h,
                   background: isLast ? 'var(--accent)' : 'var(--surface2)',
                   border: isLast ? '1px solid rgba(0,212,170,0.4)' : 'none',
                 }} />
            <span style={{ fontSize: 9, color: isLast ? 'var(--accent)' : 'var(--muted)' }}>{m.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Lendo() {
  const { rentals, addRental, removeRental, target, setTarget, monthlyTotal, allTimeTotal, monthlyByCategory, last6Months, categories } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showTargetEdit, setShowTargetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('set')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const pct = Math.min(100, Math.round((total / target) * 100))
  const isOver = total >= target
  const catTotals = monthlyByCategory()
  const months = last6Months()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })} ·{' '}
            <span style={{ color: 'var(--accent)' }}>{formatShortISK(allTimeTotal())} samtals</span>
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(139,92,246,0.06))', borderColor: 'rgba(249,115,22,0.2)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mark</div>
            <button onClick={() => setShowTargetEdit(!showTargetEdit)}
                    className="text-lg font-semibold" style={{ color: isOver ? 'var(--success)' : '#f97316' }}>
              {formatShortISK(target)}
            </button>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : '#f97316' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          <span>{formatShortISK(Math.max(0, target - total))} eftir</span>
        </div>

        {showTargetEdit && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt mark (ISK)</label>
            <input className="input text-sm" type="number"
                   value={target}
                   onChange={e => setTarget(Number(e.target.value))} />
          </div>
        )}
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note}
                 onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                  color: category === c.id ? c.color : 'var(--text)',
                }}>
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['history', 'Saga']].map(([t, l]) => (
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
        <div className="flex flex-col gap-3">
          {/* Chart */}
          <div className="card">
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Síðustu 6 mánuðir</div>
            <MiniBar months={months} />
          </div>

          {/* Category breakdown */}
          <div className="card flex flex-col gap-3">
            <div className="text-sm font-semibold">Eftir flokkum</div>
            {categories.map(c => {
              const amt = catTotals[c.id] || 0
              const pct = total > 0 ? Math.round((amt / total) * 100) : 0
              return (
                <div key={c.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{c.icon} {c.label}</span>
                    <span style={{ color: amt > 0 ? c.color : 'var(--muted)' }}>
                      {formatShortISK(amt)} {amt > 0 ? `(${pct}%)` : ''}
                    </span>
                  </div>
                  {amt > 0 && (
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="flex flex-col gap-2">
          {rentals.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar leigur ennþá 🏠
            </div>
          ) : rentals.map(r => {
            const cat = categories.find(c => c.id === r.category) || categories[3]
            return (
              <div key={r.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: `${cat.color}22` }}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: cat.color }}>
                    +{formatISK(r.amount)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{r.note ? ` · ${r.note}` : ''} ·{' '}
                    {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
