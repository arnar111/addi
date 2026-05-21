import { useState } from 'react'
import { useShopping, SHOPPING_CATS } from '../hooks/useShopping'
import { Plus, Trash2, Check, ShoppingCart, X } from 'lucide-react'

const CAT_MAP = SHOPPING_CATS.reduce((acc, c) => { acc[c.id] = c; return acc }, {})

export default function Shopping() {
  const { items, add, toggle, remove, clearDone, pending, done } = useShopping()
  const [text, setText] = useState('')
  const [cat, setCat] = useState('matur')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    add(text, cat)
    setText('')
    setShowForm(false)
  }

  const displayed = filter === 'all'
    ? [...pending, ...done]
    : filter === 'done'
    ? done
    : pending.filter(i => i.category === filter)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaupaskrá</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {pending.length} eftir{done.length > 0 ? ` · ${done.length} keypt` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {done.length > 0 && (
            <button onClick={clearDone} className="btn btn-ghost text-xs py-2" style={{ color: 'var(--danger)' }}>
              <Trash2 size={13} /> Hreinsa
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Bæta við
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <input
            className="input"
            placeholder="Heiti vöru..."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {SHOPPING_CATS.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: cat === c.id ? `${c.color}22` : 'var(--surface2)',
                  color: cat === c.id ? c.color : 'var(--muted)',
                  border: `1px solid ${cat === c.id ? c.color + '44' : 'transparent'}`,
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">Bæta við</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[{ id: 'all', label: 'Allt', icon: '🛒' }, ...SHOPPING_CATS].map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === c.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === c.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === c.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Item list */}
      {displayed.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3" style={{ color: 'var(--muted)' }}>
          <ShoppingCart size={36} style={{ opacity: 0.3 }} />
          <p className="text-sm">Tómur listi! Bættu vörum við.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayed.map(item => {
            const c = CAT_MAP[item.category] || SHOPPING_CATS[4]
            return (
              <div
                key={item.id}
                className="card flex items-center gap-3 py-3 transition-all"
                style={{ opacity: item.done ? 0.5 : 1 }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: item.done ? 'var(--success)' : c.color,
                    background: item.done ? 'var(--success)' : 'transparent',
                  }}
                >
                  {item.done && <Check size={12} color="#000" />}
                </button>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-sm"
                  style={{ background: `${c.color}22` }}
                >
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{c.label}</p>
                </div>
                <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
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
