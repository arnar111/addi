import { useState } from 'react'
import { useSubscriptions, SUBSCRIPTION_CATEGORIES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, CreditCard, TrendingDown, Check, AlertCircle, Trash2 } from 'lucide-react'

export default function Subscriptions() {
  const { subs, activeSubs, add, remove, toggle, update, monthlyTotal, yearlyTotal, upcomingRenewals, daysUntilRenewal } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [newSub, setNewSub] = useState({ name: '', icon: '💳', category: 'other', amount: '', billing: 'monthly', renewDay: 1 })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newSub.name || !newSub.amount) return
    add({ ...newSub, amount: Number(newSub.amount), active: true, color: SUBSCRIPTION_CATEGORIES.find(c => c.id === newSub.category)?.color || '#64748b' })
    setNewSub({ name: '', icon: '💳', category: 'other', amount: '', billing: 'monthly', renewDay: 1 })
    setShowForm(false)
  }

  const savingsIfCancelled = (sub) => sub.amount * 12

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Mánaðarleg útgjöld</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.07))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-3xl font-semibold">{formatISK(monthlyTotal)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent2)' }}>{formatISK(yearlyTotal)}</div>
          </div>
        </div>
        <div className="flex gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <span>{activeSubs.length} virkar áskriftir</span>
          <span>·</span>
          <span>{subs.length - activeSubs.length} óvirkar</span>
        </div>
      </div>

      {/* Upcoming renewals */}
      {upcomingRenewals.length > 0 && (
        <div className="card" style={{ border: '1px solid rgba(249,115,22,0.3)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={15} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm" style={{ color: '#f97316' }}>Endurnýjun á næstu 7 dögum</span>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingRenewals.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </span>
                <span className="text-sm font-medium" style={{ color: s.daysUntil <= 2 ? '#f97316' : 'var(--muted)' }}>
                  {s.daysUntil === 0 ? 'Í dag' : s.daysUntil === 1 ? 'Á morgun' : `${s.daysUntil} dagar`}
                  <span className="ml-2 font-semibold" style={{ color: 'var(--text)' }}>{formatShortISK(s.amount)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Heiti</label>
              <input className="input text-sm" placeholder="Netflix" value={newSub.name}
                onChange={e => setNewSub(s => ({ ...s, name: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK/mán)</label>
              <input className="input text-sm" type="number" placeholder="2.990" value={newSub.amount}
                onChange={e => setNewSub(s => ({ ...s, amount: e.target.value }))} required />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Flokkur</label>
            <div className="grid grid-cols-4 gap-1.5">
              {SUBSCRIPTION_CATEGORIES.map(c => (
                <button key={c.id} type="button" onClick={() => setNewSub(s => ({ ...s, category: c.id }))}
                  className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                  style={{
                    background: newSub.category === c.id ? `${c.color}22` : 'var(--surface2)',
                    border: `1px solid ${newSub.category === c.id ? c.color + '55' : 'transparent'}`,
                  }}>
                  <span>{c.icon}</span>
                  <span style={{ color: newSub.category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagur endurnýjunar (1-31)</label>
            <input className="input text-sm" type="number" min="1" max="31" value={newSub.renewDay}
              onChange={e => setNewSub(s => ({ ...s, renewDay: Number(e.target.value) }))} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Subscriptions by category */}
      {SUBSCRIPTION_CATEGORIES.map(cat => {
        const catSubs = subs.filter(s => s.category === cat.id)
        if (catSubs.length === 0) return null
        const catTotal = catSubs.filter(s => s.active).reduce((sum, s) => sum + s.amount, 0)
        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                {cat.icon} {cat.label}
              </span>
              {catTotal > 0 && <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(catTotal)}/mán</span>}
            </div>
            <div className="flex flex-col gap-2">
              {catSubs.map(s => {
                const days = s.renewDay ? daysUntilRenewal(s.renewDay) : null
                return (
                  <div key={s.id} className="card flex items-center gap-3 py-3 transition-all"
                    style={{ opacity: s.active ? 1 : 0.5 }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{ background: `${s.color || '#64748b'}20` }}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{s.name}</span>
                        {s.active && days !== null && days <= 7 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                            {days === 0 ? 'Í dag' : `${days}d`}
                          </span>
                        )}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {formatISK(s.amount)}/mán · {formatShortISK(s.amount * 12)}/ár
                        {s.renewDay && s.active ? ` · dag ${s.renewDay}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggle(s.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: s.active ? 'rgba(0,212,170,0.15)' : 'var(--surface2)' }}>
                        <Check size={13} style={{ color: s.active ? 'var(--accent)' : 'var(--muted)' }} />
                      </button>
                      <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Savings tip */}
      <div className="card" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown size={14} style={{ color: 'var(--accent2)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent2)' }}>Sparnaðarábending</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Þú ert að eyða <strong style={{ color: 'var(--text)' }}>{formatISK(yearlyTotal)}</strong> á ári í áskriftir.
          {subs.filter(s => !s.active).length > 0
            ? ` Þú ert nú þegar með ${subs.filter(s => !s.active).length} óvirkar áskriftir sem þú gætir sagt upp.`
            : ' Skoðaðu hvort þú nýtir þér allar áskriftirnar vel.'
          }
        </p>
      </div>
    </div>
  )
}
