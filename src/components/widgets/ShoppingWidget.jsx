import { useState } from 'react'
import { useShopping } from '../../hooks/useShopping'
import { ShoppingCart, Plus, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ShoppingWidget() {
  const { pending, add, toggle } = useShopping()
  const [text, setText] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    add(text)
    setText('')
  }

  const show = pending.slice(0, 5)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={15} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Innkaup</h3>
          {pending.length > 0 && (
            <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
              {pending.length}
            </span>
          )}
        </div>
        <Link to="/shopping" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          className="input text-sm"
          placeholder="Bæta við vöru..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
          <Plus size={16} />
        </button>
      </form>

      {show.length === 0 ? (
        <p className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Tómur listi 🛒</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {show.map(item => (
            <li
              key={item.id}
              className="flex items-center gap-2.5 p-2 rounded-xl"
              style={{ background: 'var(--surface2)' }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: 'var(--accent)', background: 'transparent' }}
              />
              <span className="text-sm flex-1 truncate">{item.name}</span>
            </li>
          ))}
          {pending.length > 5 && (
            <li className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
              +{pending.length - 5} fleiri...
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
