import { useState, useRef } from 'react'
import { useShoppingList } from '../hooks/useShoppingList'
import { Plus, X, Trash2, Check, ShoppingCart } from 'lucide-react'

export default function Shopping() {
  const { add, toggle, remove, clearDone, pending, done } = useShoppingList()
  const [input, setInput] = useState('')
  const [qty, setQty] = useState('')
  const inputRef = useRef(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    add(input, qty)
    setInput('')
    setQty('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Verslunarlistinn</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {pending.length} eftir · {done.length} tékkaðar
          </p>
        </div>
        {done.length > 0 && (
          <button onClick={clearDone} className="btn btn-ghost text-xs py-1.5"
                  style={{ color: 'var(--danger)' }}>
            <Trash2 size={12} /> Hreinsa
          </button>
        )}
      </div>

      <form onSubmit={handleAdd} className="card flex gap-2">
        <input
          ref={inputRef}
          className="input text-sm flex-1"
          placeholder="Bæta við hlut..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
        />
        <input
          className="input text-sm"
          style={{ width: 64 }}
          placeholder="Magn"
          value={qty}
          onChange={e => setQty(e.target.value)}
        />
        <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 14px' }}>
          <Plus size={16} />
        </button>
      </form>

      {pending.length === 0 && done.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3">
          <ShoppingCart size={40} style={{ color: 'var(--muted)' }} />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Listinn er tómur</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Bættu við hlutum hér að ofan</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="flex flex-col gap-2">
              {pending.map(item => (
                <div
                  key={item.id}
                  className="card flex items-center gap-3 py-3.5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggle(item.id)}
                >
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                       style={{ borderColor: 'var(--accent)' }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{item.text}</span>
                    {item.qty && (
                      <span className="text-xs ml-2 px-1.5 py-0.5 rounded-md"
                            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                        {item.qty}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); remove(item.id) }}
                    style={{ color: 'var(--muted)', padding: 4 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {done.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium px-1" style={{ color: 'var(--muted)' }}>
                Tékkaðar ({done.length})
              </div>
              {done.map(item => (
                <div
                  key={item.id}
                  className="card flex items-center gap-3 py-3"
                  style={{ opacity: 0.45, cursor: 'pointer' }}
                  onClick={() => toggle(item.id)}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                       style={{ background: 'var(--accent)' }}>
                    <Check size={12} color="#000" />
                  </div>
                  <span className="text-sm flex-1 line-through">{item.text}</span>
                  {item.qty && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.qty}</span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); remove(item.id) }}
                    style={{ color: 'var(--muted)', padding: 4 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
