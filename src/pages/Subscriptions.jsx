import { useState } from 'react'
import { useSubscriptions, SUB_STATUSES, CURRENCIES, toISK, formatForeign } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, ExternalLink, AlertTriangle, Edit2, Check, TrendingDown } from 'lucide-react'

const CATEGORIES = ['AI', 'Skemmtun', 'Þróun', 'Íþróttir', 'Menntun', 'Hugbúnaður', 'Annað']
const BILLING_CYCLES = [['monthly', 'Mánaðarlegt'], ['yearly', 'Árlegt']]

function SubCard({ sub, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...sub })

  const monthlyCost = sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount
  const monthlyISK = toISK(monthlyCost, sub.currency)
  const status = SUB_STATUSES[sub.status] || SUB_STATUSES.active

  const save = () => {
    onUpdate(sub.id, form)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card flex flex-col gap-3 animate-slide-up" style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Breyta áskrift</span>
          <button onClick={() => setEditing(false)}><X size={15} style={{ color: 'var(--muted)' }} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn</label>
            <input className="input text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð</label>
            <input className="input text-sm" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Gjaldmiðill</label>
            <select className="input text-sm" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Tíðni</label>
            <select className="input text-sm" value={form.billingCycle} onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value }))}>
              {BILLING_CYCLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Staða</label>
            <select className="input text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {Object.entries(SUB_STATUSES).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Næsta greiðsla</label>
            <input type="date" className="input text-sm" value={form.nextBilling || ''} onChange={e => setForm(f => ({ ...f, nextBilling: e.target.value || null }))} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="btn btn-primary flex-1 justify-center text-sm">
            <Check size={14} /> Vista
          </button>
          <button onClick={() => setEditing(false)} className="btn btn-ghost px-3"><X size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="card flex items-center gap-3 py-3 transition-all"
         style={{
           borderColor: sub.status === 'failed' ? 'rgba(239,68,68,0.3)' :
                        sub.status === 'paused' ? 'rgba(249,115,22,0.2)' : 'var(--border)',
           background: sub.status === 'failed' ? 'rgba(239,68,68,0.03)' : 'var(--surface)',
         }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
           style={{ background: `${sub.color}22` }}>
        {sub.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{sub.name}</span>
          {sub.status === 'failed' && <AlertTriangle size={12} style={{ color: 'var(--danger)', flexShrink: 0 }} />}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {formatForeign(sub.amount, sub.currency)}{sub.billingCycle === 'yearly' ? '/ár' : '/mán'}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>·</span>
          <span className="text-xs font-medium" style={{ color: sub.status === 'active' ? 'var(--accent)' : 'var(--muted)' }}>
            {formatShortISK(monthlyISK)}/mán
          </span>
        </div>
        {sub.nextBilling && sub.status === 'active' && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Næst: {new Date(sub.nextBilling).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </div>
        )}
        {sub.status !== 'active' && (
          <span className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-full mt-0.5"
                style={{ background: `${status.color}20`, color: status.color }}>
            {status.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {sub.url && (
          <a href={sub.url} target="_blank" rel="noopener noreferrer"
             className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface2)]">
            <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
          </a>
        )}
        <button onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface2)]">
          <Edit2 size={13} style={{ color: 'var(--muted)' }} />
        </button>
        <button onClick={() => onRemove(sub.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.1)]">
          <Trash2 size={13} style={{ color: 'var(--muted)' }} />
        </button>
      </div>
    </div>
  )
}

const EMPTY_FORM = {
  name: '', icon: '📱', color: '#00d4aa', amount: 10, currency: 'USD',
  billingCycle: 'monthly', status: 'active', nextBilling: '', url: '', category: 'Annað',
}

export default function Subscriptions() {
  const { subs, add, remove, update, monthlyISK, yearlyISK, failedSubs } = useSubscriptions()
  const [tab, setTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = tab === 'active' ? subs.filter(s => s.status === 'active')
    : tab === 'failed' ? subs.filter(s => s.status === 'failed' || s.status === 'paused')
    : subs.filter(s => s.status !== 'cancelled')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    add({ ...form, nextBilling: form.nextBilling || null })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const monthly = monthlyISK()
  const yearly = yearlyISK()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegur kostnaður</div>
            <div className="text-3xl font-semibold">{formatISK(monthly)}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {formatISK(yearly)} á ári
            </div>
          </div>
          {failedSubs.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                <AlertTriangle size={14} />
                {failedSubs.length} bilun{failedSubs.length > 1 ? 'ar' : ''}
              </div>
              <button onClick={() => setTab('failed')} className="text-xs" style={{ color: 'var(--danger)' }}>
                Skoða →
              </button>
            </div>
          )}
        </div>

        {failedSubs.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl flex items-start gap-2"
               style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <TrendingDown size={14} style={{ color: 'var(--danger)', marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              Greiðslumál hjá: {failedSubs.map(s => s.name).join(', ')}. Uppfærðu greiðsluupplýsingar til að koma í veg fyrir tjón.
            </p>
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up" style={{ border: '1px solid rgba(0,212,170,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={15} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn</label>
              <input className="input text-sm" placeholder="t.d. Spotify" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð</label>
              <input className="input text-sm" type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Gjaldmiðill</label>
              <select className="input text-sm" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Tíðni</label>
              <select className="input text-sm" value={form.billingCycle} onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value }))}>
                {BILLING_CYCLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Staða</label>
              <select className="input text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.entries(SUB_STATUSES).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Næsta greiðsla</label>
              <input type="date" className="input text-sm" value={form.nextBilling} onChange={e => setForm(f => ({ ...f, nextBilling: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['all', 'Allar'], ['active', 'Virkar'], ['failed', 'Vandamál']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
            {t === 'failed' && failedSubs.length > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                    style={{ background: 'var(--danger)', color: '#fff' }}>
                {failedSubs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {tab === 'failed' ? 'Engar bilaðar áskriftir 🎉' : 'Engar áskriftir enn'}
          </div>
        ) : (
          filtered.map(s => (
            <SubCard key={s.id} sub={s} onRemove={remove} onUpdate={update} />
          ))
        )}
      </div>
    </div>
  )
}
