import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Key, TrendingUp } from 'lucide-react'

const QUICK = [
  { label: 'Dagur', amount: 7000, type: 'dagur', desc: 'Mán–Fös', emoji: '☀️' },
  { label: 'Helgi', amount: 10000, type: 'helgi', desc: 'Lau–Sun', emoji: '🎉' },
]

function MonthChart({ byMonth }) {
  const entries = Object.entries(byMonth()).sort(([a], [b]) => a.localeCompare(b)).slice(-6)
  if (entries.length < 2) return null
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {entries.map(([key, val]) => {
        const pct = (val / max) * 100
        const [, m] = key.split('-')
        const monthName = new Date(key + '-01').toLocaleDateString('is-IS', { month: 'short' })
        return (
          <div key={key} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-md transition-all"
                 style={{ height: `${Math.max(4, pct * 0.48)}px`, background: 'var(--accent)', opacity: m === String(new Date().getMonth() + 1).padStart(2, '0') ? 1 : 0.4 }} />
            <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{monthName}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Lendo() {
  const { rentals, addRental, removeRental, goal, setGoal, monthlyTotal, remaining, goalPct, allTimeTotal, currentMonth, byMonth } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [customDate, setCustomDate] = useState('')
  const [tab, setTab] = useState('history')

  const total = monthlyTotal()
  const pct = goalPct()
  const left = remaining()
  const isOver = left <= 0
  const month = currentMonth()
  const thisMonthStr = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  const handleQuick = (q) => addRental(q.amount, q.type, q.label)

  const handleCustom = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental(
      Number(amount),
      'custom',
      note,
      customDate ? new Date(customDate).toISOString() : null
    )
    setAmount('')
    setNote('')
    setCustomDate('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó 🏠</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Veislusett · Garðabær · {thisMonthStr}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly overview card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.02))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Mánaðarmarkmið</div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="font-semibold">{formatISK(goal)}</span>
              <button onClick={() => setShowGoalEdit(!showGoalEdit)}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ color: 'var(--accent)', background: 'rgba(0,212,170,0.12)' }}>
                Breyta
              </button>
            </div>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3">
            <input className="input text-sm" type="number" value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{isOver ? '🎉 Markmið náð!' : `${formatISK(Math.abs(left))} eftir`}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Leigur</div>
            <div className="font-bold text-lg">{month.length}</div>
          </div>
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Meðaltal</div>
            <div className="font-bold text-lg">
              {month.length ? formatShortISK(Math.round(total / month.length)) : '–'}
            </div>
          </div>
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Alls tíma</div>
            <div className="font-bold text-lg">{formatShortISK(allTimeTotal())}</div>
          </div>
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="grid grid-cols-2 gap-2">
        {QUICK.map(q => (
          <button key={q.type} onClick={() => handleQuick(q)}
            className="card text-left transition-all active:scale-95 hover:border-[rgba(0,212,170,0.3)]"
            style={{ cursor: 'pointer' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{q.label}</span>
              <span className="text-base">{q.emoji}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(q.amount)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{q.desc} · ýttu til að skrá</div>
          </button>
        ))}
      </div>

      {/* Custom form */}
      {showForm && (
        <form onSubmit={handleCustom} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Sérsniðin leiga</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Minnismiði (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning (valkvæmt)</label>
            <input className="input" type="date" value={customDate}
              onChange={e => setCustomDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá leigutekjur</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['history', 'Leigur'], ['chart', 'Þróun']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'chart' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Mánaðarlegar tekjur</span>
          </div>
          <MonthChart byMonth={byMonth} />
          {Object.keys(byMonth()).length < 2 && (
            <div className="text-xs text-center mt-4" style={{ color: 'var(--muted)' }}>
              Skráðu fleiri leigur til að sjá þróun
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="flex flex-col gap-2">
          {rentals.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <Key size={36} className="mx-auto mb-3 opacity-25" />
              <div className="font-medium">Engar leigur ennþá</div>
              <div className="text-xs mt-1">Notaðu hnappana hér að ofan til að skrá fyrstu leigu</div>
            </div>
          ) : (
            rentals.slice(0, 30).map(r => {
              const isThisMonth = new Date(r.date).getMonth() === new Date().getMonth()
              return (
                <div key={r.id} className="card flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                       style={{ background: 'rgba(0,212,170,0.1)' }}>
                    {r.type === 'helgi' ? '🎉' : '🏠'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                      {formatISK(r.amount)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {r.note || r.type} · {new Date(r.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  {isThisMonth && (
                    <div className="text-xs px-1.5 py-0.5 rounded shrink-0"
                         style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>þ.m.</div>
                  )}
                  <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
