import { useState } from 'react'
import { useShopping, SHOP_CATEGORIES } from '../hooks/useShopping'
import { formatShortISK } from '../utils/currency'
import { Plus, Trash2, Check, ShoppingCart, X } from 'lucide-react'

export default function Shopping() {
  const { add, toggle, remove, clearDone, pending, done, totalEstimate } = useShopping()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('grocery')
  const [estimate, setEstimate] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    add(text.trim(), category, estimate || 0)
    setText('')
    setEstimate('')
    setShowForm(false)
  }

  const catOf = (id) => SHOP_CATEGORIES.find(c => c.id === id) || SHOP_CATEGORIES[5]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaupalisti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {pending.length} hlutar{totalEstimate > 0 ? ` · ~${formatShortISK(totalEstimate)}` : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {pending.length > 0 && totalEstimate > 0 && (
        <div className="card flex items-center gap-3"
             style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(59,130,246,0.06))' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(0,212,170,0.15)' }}>
            <ShoppingCart size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Áætlaður kostnaður</div>
            <div className="text-2xl font-semibold">{formatShortISK(totalEstimate)}</div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr hlutur</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn hlutar..." value={text}
            onChange={e => setText(e.target.value)} autoFocus />
          <input className="input" type="number" placeholder="Áætlað verð í kr (valkvæmt)"
            value={estimate} onChange={e => setEstimate(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5">
            {SHOP_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex items-center gap-1.5 py-2 px-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                  color: category === c.id ? c.color : 'var(--muted)',
                }}>
                <span>{c.icon}</span><span>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við lista</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {pending.length === 0 && done.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-3">
            <span className="text-5xl">🛒</span>
            <div>
              <div className="font-medium mb-1">Innkaupalisti er tómur</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Bættu við hlutum hér</div>
            </div>
          </div>
        ) : (
          <>
            {pending.map(item => {
              const c = catOf(item.category)
              return (
                <div key={item.id} className="card flex items-center gap-3 py-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: c.color }} />
                  <span className="text-xl shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.text}</div>
                    {item.estimate > 0 && (
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        ~{formatShortISK(item.estimate)}
                      </div>
                    )}
                  </div>
                  <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}

            {done.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1 mt-1">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Keypt ({done.length})</span>
                  <button onClick={clearDone} className="text-xs" style={{ color: 'var(--danger)' }}>Hreinsa</button>
                </div>
                {done.map(item => {
                  const c = catOf(item.category)
                  return (
                    <div key={item.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.5 }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                           style={{ background: c.color }}>
                        <Check size={12} color="#000" />
                      </div>
                      <span className="text-xl shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm line-through truncate">{item.text}</div>
                      </div>
                      <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
