import { useState } from 'react'
import { useShopping, SHOP_CATEGORIES } from '../hooks/useShopping'
import { Plus, Trash2, ShoppingCart, Check } from 'lucide-react'

const QUICK_STORES = [
  { name: 'Wolt', url: 'https://wolt.com/is', icon: '🛵', color: '#009de0' },
  { name: 'indó', url: 'https://indo.is', icon: '🛒', color: '#00a86b' },
  { name: 'Dropp', url: 'https://dropp.is', icon: '📦', color: '#ff6b35' },
  { name: 'Hagkaup', url: 'https://www.hagkaup.is', icon: '🏪', color: '#e63946' },
]

export default function Shopping() {
  const { items, add, toggle, remove, clearDone, pending, done } = useShopping()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('food')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    add(text.trim(), category)
    setText('')
  }

  const getCat = (id) => SHOP_CATEGORIES.find(c => c.id === id) || SHOP_CATEGORIES[SHOP_CATEGORIES.length - 1]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaupslisti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {pending.length} {pending.length === 1 ? 'hlutur' : 'hlutir'} eftir
            {done.length > 0 ? ` · ${done.length} keyptir` : ''}
          </p>
        </div>
        {done.length > 0 && (
          <button onClick={clearDone} className="btn btn-ghost text-xs py-1.5" style={{ color: 'var(--muted)' }}>
            <Trash2 size={12} /> Hreinsa
          </button>
        )}
      </div>

      {/* Quick store links */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {QUICK_STORES.map(s => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: `${s.color}18`,
              color: s.color,
              border: `1px solid ${s.color}33`,
              textDecoration: 'none',
            }}
          >
            {s.icon} {s.name}
          </a>
        ))}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="card flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            className="input text-sm"
            placeholder="Bæta við hlut..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 14px' }}>
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SHOP_CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className="px-2.5 py-1 rounded-xl text-xs transition-all"
              style={{
                background: category === c.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: category === c.id ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${category === c.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </form>

      {/* List */}
      {items.length === 0 ? (
        <div className="card text-center py-10 flex flex-col items-center gap-3" style={{ color: 'var(--muted)' }}>
          <ShoppingCart size={36} style={{ opacity: 0.25 }} />
          <p className="text-sm">Innkaupslisti er tómur</p>
          <p className="text-xs">Bættu við hlutum hér að ofan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pending.map(i => (
            <div key={i.id} className="card flex items-center gap-3 py-2.5">
              <button
                onClick={() => toggle(i.id)}
                className="w-5 h-5 rounded-full border-2 shrink-0 transition-all"
                style={{ borderColor: 'var(--accent)' }}
              />
              <span className="text-base shrink-0">{getCat(i.category).icon}</span>
              <span className="text-sm flex-1">{i.text}</span>
              <button onClick={() => remove(i.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {done.length > 0 && (
            <>
              <div className="text-xs px-1 mt-1 font-medium" style={{ color: 'var(--muted)' }}>
                Keypt ({done.length})
              </div>
              {done.map(i => (
                <div
                  key={i.id}
                  className="card flex items-center gap-3 py-2.5"
                  style={{ opacity: 0.45 }}
                >
                  <button
                    onClick={() => toggle(i.id)}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: 'var(--success)', background: 'var(--success)' }}
                  >
                    <Check size={10} color="#000" />
                  </button>
                  <span className="text-base shrink-0">{getCat(i.category).icon}</span>
                  <span className="text-sm flex-1 line-through">{i.text}</span>
                  <button onClick={() => remove(i.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
