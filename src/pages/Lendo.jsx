import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Target, TrendingUp, Package } from 'lucide-react'

export default function Lendo() {
  const {
    rentals, addRental, removeRental,
    monthlyGoal, setMonthlyGoal,
    currentMonth, monthlyIncome, totalRentals, avgPerRental, goalProgress,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [itemId, setItemId] = useState('veisluset')
  const [days, setDays] = useState('1')
  const [customPrice, setCustomPrice] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [tab, setTab] = useState('overview')

  const income = monthlyIncome()
  const pct = goalProgress()
  const isGoalMet = pct >= 100
  const selectedItem = LENDO_ITEMS.find(i => i.id === itemId)
  const estimatedIncome = customPrice ? Number(customPrice) : (selectedItem?.price || 0) * Number(days || 1)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!itemId) return
    addRental(itemId, days || 1, note, date || null, customPrice || null)
    setDays('1')
    setCustomPrice('')
    setNote('')
    setDate('')
    setShowForm(false)
  }

  const month = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó leigur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{month}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Skrá leiguna
        </button>
      </div>

      {/* Income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.08))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Leigutekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(income)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-base font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent3)' }}>
              {formatShortISK(monthlyGoal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3 flex gap-2 items-center">
            <input className="input text-sm flex-1" type="number" value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))} />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-ghost py-2"><X size={14} /></button>
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent3)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{isGoalMet ? '🎉 Markmiðið náð!' : `${formatShortISK(monthlyGoal - income)} eftir`}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Package size={16} />, label: 'Leigur', value: totalRentals() },
          { icon: <TrendingUp size={16} />, label: 'Meðaltal', value: formatShortISK(avgPerRental()) },
          { icon: <Target size={16} />, label: 'Framvinda', value: `${pct}%` },
        ].map(s => (
          <div key={s.label} className="card-sm flex flex-col gap-1">
            <div style={{ color: 'var(--muted)' }}>{s.icon}</div>
            <div className="text-base font-semibold">{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leiguna</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LENDO_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => setItemId(item.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: itemId === item.id ? 'rgba(249,115,22,0.12)' : 'var(--surface2)',
                  border: `1px solid ${itemId === item.id ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                  color: itemId === item.id ? '#f97316' : 'var(--text)',
                }}>
                <span>{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{item.label}</div>
                  {item.price > 0 && <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(item.price)}/dag</div>}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => setDays(e.target.value)} placeholder="1" />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>
                Verð (ISK) {selectedItem?.price ? `· sjálfgefið ${formatShortISK(selectedItem.price * (days || 1))}` : ''}
              </label>
              <input className="input text-sm" type="number" value={customPrice}
                onChange={e => setCustomPrice(e.target.value)} placeholder={String(selectedItem?.price * (Number(days) || 1) || '')} />
            </div>
          </div>

          <input className="input text-sm" type="date" value={date}
            onChange={e => setDate(e.target.value)} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />

          {estimatedIncome > 0 && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl text-sm"
                 style={{ background: 'rgba(249,115,22,0.08)', color: '#f97316' }}>
              <span>Áætlaðar leigutekjur</span>
              <span className="font-semibold">{formatISK(estimatedIncome)}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full justify-center"
                  style={{ background: '#f97316' }}>
            Bæta við leigusögu
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Þessi mánuður'], ['all', 'Öll saga']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Rental list */}
      <div className="flex flex-col gap-2">
        {(tab === 'overview' ? currentMonth() : rentals).length === 0 ? (
          <div className="card text-center py-8 flex flex-col items-center gap-2" style={{ color: 'var(--muted)' }}>
            <span style={{ fontSize: 32 }}>🪑</span>
            <p className="text-sm">Engar leigur skráðar ennþá</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary mt-1"
                    style={{ background: '#f97316', fontSize: 13 }}>
              <Plus size={14} /> Skrá fyrstu leiguna
            </button>
          </div>
        ) : (tab === 'overview' ? currentMonth() : rentals).map(r => {
          const item = LENDO_ITEMS.find(i => i.id === r.itemId) || LENDO_ITEMS[0]
          return (
            <div key={r.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: 'rgba(249,115,22,0.12)' }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#f97316' }}>{formatISK(r.income)}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                    {r.days} dag{r.days !== 1 ? 'ar' : 'ur'}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {item.label}{r.note ? ` · ${r.note}` : ''} ·{' '}
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
    </div>
  )
}
