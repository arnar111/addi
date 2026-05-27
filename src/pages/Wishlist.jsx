import { useState } from 'react'
import { useWishlist, STORES, PRIORITY_COLORS, PRIORITY_LABELS } from '../hooks/useWishlist'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Tag, TrendingDown, ExternalLink, ShoppingBag } from 'lucide-react'

function WishItem({ item, onRemove, onUpdate }) {
  const isAtTarget = item.currentPrice <= (item.targetPrice || Infinity)
  const savings = item.onSale && item.originalPrice ? item.originalPrice - item.currentPrice : 0
  const pct = item.originalPrice && item.onSale ? Math.round((savings / item.originalPrice) * 100) : 0

  return (
    <div className="card" style={{
      border: item.onSale ? '1px solid rgba(34,197,94,0.3)' : undefined,
      background: item.onSale ? 'linear-gradient(135deg, rgba(34,197,94,0.04), transparent)' : undefined,
    }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'var(--surface2)' }}>
          {item.icon || '🛒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{item.name}</span>
            {item.onSale && (
              <span className="text-xs px-1.5 py-0.5 rounded-lg font-bold"
                    style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
                -{pct}% SALE
              </span>
            )}
            <span className="text-xs px-1.5 py-0.5 rounded-lg"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              {item.store}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold" style={{ color: item.onSale ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(item.currentPrice)}
            </span>
            {item.onSale && item.originalPrice && (
              <span className="text-xs line-through" style={{ color: 'var(--muted)' }}>
                {formatISK(item.originalPrice)}
              </span>
            )}
          </div>

          {item.targetPrice && (
            <div className="flex items-center gap-1 mt-0.5">
              <Tag size={10} style={{ color: 'var(--muted)' }} />
              <span className="text-xs" style={{ color: isAtTarget ? 'var(--success)' : 'var(--muted)' }}>
                {isAtTarget ? '✅ Náð markverði!' : `Markverð: ${formatISK(item.targetPrice)}`}
              </span>
            </div>
          )}

          {item.note && (
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.note}</div>
          )}

          {item.saleEnds && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent3)' }}>
              ⏰ Sale lýkur: {new Date(item.saleEnds).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLORS[item.priority] }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{PRIORITY_LABELS[item.priority]}</span>
          </div>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
               style={{ color: 'var(--muted)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => onRemove(item.id)} style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Wishlist() {
  const { items, add, remove, update, onSale, totalSavings } = useWishlist()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [store, setStore] = useState('Steam')
  const [currentPrice, setCurrentPrice] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [priority, setPriority] = useState('medium')
  const [icon, setIcon] = useState('🎮')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add({
      name: name.trim(),
      icon,
      store,
      currentPrice: Number(currentPrice) || 0,
      originalPrice: Number(currentPrice) || 0,
      targetPrice: Number(targetPrice) || null,
      priority,
      url: url.trim() || null,
      note: note.trim() || null,
      onSale: false,
    })
    setName('')
    setStore('Steam')
    setCurrentPrice('')
    setTargetPrice('')
    setPriority('medium')
    setIcon('🎮')
    setUrl('')
    setNote('')
    setShowForm(false)
  }

  const filtered = filter === 'sale' ? items.filter(i => i.onSale)
    : filter === 'target' ? items.filter(i => i.currentPrice <= (i.targetPrice || Infinity))
    : items

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Óskalisti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{items.length} hlutir · {onSale.length} í sölu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Sale alert */}
      {onSale.length > 0 && (
        <div className="card flex items-center gap-3"
             style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <TrendingDown size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
              {onSale.length} {onSale.length === 1 ? 'hlutur' : 'hlutir'} í sölu!
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Sparaðu {formatISK(totalSavings)} á þessum hlutum núna
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við lista</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-12 text-center text-xl" value={icon} onChange={e => setIcon(e.target.value)} placeholder="🎮" style={{ padding: '8px 4px' }} />
            <input className="input flex-1" placeholder="Nafn vöru" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Verð (ISK)" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
            <input className="input flex-1" type="number" placeholder="Markverð (ISK)" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {STORES.map(s => (
              <button key={s} type="button" onClick={() => setStore(s)}
                className="py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: store === s ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: store === s ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${store === s ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {Object.entries(PRIORITY_LABELS).map(([p, l]) => (
              <button key={p} type="button" onClick={() => setPriority(p)}
                className="flex-1 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: priority === p ? `${PRIORITY_COLORS[p]}22` : 'var(--surface2)',
                  color: priority === p ? PRIORITY_COLORS[p] : 'var(--muted)',
                  border: `1px solid ${priority === p ? PRIORITY_COLORS[p] + '44' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <input className="input" placeholder="URL (valkvæmt)" value={url} onChange={e => setUrl(e.target.value)} />
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', 'Allt'], ['sale', '🏷️ Í sölu'], ['target', '✅ Náð markverði']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Item list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
            <div>{filter === 'all' ? 'Óskalistinn er tómur' : 'Engir hlutir í þessum flokki'}</div>
          </div>
        ) : filtered.map(item => (
          <WishItem key={item.id} item={item} onRemove={remove} onUpdate={update} />
        ))}
      </div>
    </div>
  )
}
