import { useState, useRef } from 'react'
import { useShopping } from '../hooks/useShopping'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, ShoppingCart, Check, RotateCcw } from 'lucide-react'

function ShoppingItem({ item, onToggle, onRemove, onSetPrice }) {
  const [editingPrice, setEditingPrice] = useState(false)
  const [price, setPrice] = useState(String(item.price || ''))
  const priceRef = useRef(null)

  const commitPrice = () => {
    onSetPrice(item.id, price)
    setEditingPrice(false)
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
         style={{ background: item.done ? 'var(--surface2)' : 'var(--surface)', border: `1px solid ${item.done ? 'transparent' : 'var(--border)'}`, opacity: item.done ? 0.6 : 1 }}>
      <button onClick={() => onToggle(item.id)}
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={{ borderColor: item.done ? 'var(--accent)' : 'var(--border)', background: item.done ? 'var(--accent)' : 'transparent' }}>
        {item.done && <Check size={12} color="#000" />}
      </button>

      <span className="flex-1 text-sm" style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
        {item.name}
      </span>

      {editingPrice ? (
        <input
          ref={priceRef}
          type="number"
          className="w-20 text-right text-sm bg-transparent border-b outline-none"
          style={{ borderColor: 'var(--accent)', color: 'var(--text)' }}
          value={price}
          onChange={e => setPrice(e.target.value)}
          onBlur={commitPrice}
          onKeyDown={e => e.key === 'Enter' && commitPrice()}
          autoFocus
        />
      ) : (
        <button onClick={() => { setEditingPrice(true); setPrice(String(item.price || '')) }}
          className="text-sm text-right min-w-[60px]"
          style={{ color: item.price > 0 ? 'var(--text)' : 'var(--muted)' }}>
          {item.price > 0 ? formatShortISK(item.price) : '+ verð'}
        </button>
      )}

      <button onClick={() => onRemove(item.id)} style={{ color: 'var(--muted)', padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  )
}

export default function Shopping() {
  const { items, addItem, toggleItem, removeItem, setPrice, clearDone, clearAll, pending, done, checkedTotal, grandTotal, pct } = useShopping()
  const [name, setName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const inputRef = useRef(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addItem(name.trim(), itemPrice)
    setName('')
    setItemPrice('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaupaseðill</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {done.length}/{items.length} atriði · {pending.length} eftir
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clearAll} className="btn btn-ghost text-xs" style={{ color: 'var(--muted)' }}>
            <RotateCcw size={14} /> Hreinsa
          </button>
        )}
      </div>

      {/* Running total card */}
      {items.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.06))' }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Í körfunni</div>
              <div className="text-3xl font-semibold" style={{ color: checkedTotal > 0 ? 'var(--accent)' : 'var(--text)' }}>
                {formatShortISK(checkedTotal)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarverð</div>
              <div className="text-lg font-medium">{formatShortISK(grandTotal)}</div>
            </div>
          </div>
          {grandTotal > 0 && (
            <>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${pct}%`, background: 'var(--accent)' }} />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {pct}% í körfu · {formatShortISK(grandTotal - checkedTotal)} eftir
              </div>
            </>
          )}
        </div>
      )}

      {/* Add item form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          ref={inputRef}
          className="input flex-1"
          placeholder="Bæta við vöru..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          className="input w-24 text-sm"
          placeholder="Verð"
          value={itemPrice}
          onChange={e => setItemPrice(e.target.value)}
        />
        <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '10px 14px' }}>
          <Plus size={16} />
        </button>
      </form>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <ShoppingCart size={36} className="mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-medium mb-1">Tómur innkaupaseðill</p>
          <p className="text-xs">Bættu við vörum hér að ofan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {/* Pending items */}
          {pending.map(item => (
            <ShoppingItem key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} onSetPrice={setPrice} />
          ))}

          {/* Done divider */}
          {done.length > 0 && (
            <>
              <div className="flex items-center gap-2 py-1">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs shrink-0 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  <Check size={11} /> {done.length} í körfu
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <button onClick={clearDone} className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
                  <X size={11} />
                </button>
              </div>
              {done.map(item => (
                <ShoppingItem key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} onSetPrice={setPrice} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
