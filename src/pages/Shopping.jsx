import { useState } from 'react'
import { useShopping } from '../hooks/useShopping'
import { Plus, Trash2, Check, X, ShoppingCart } from 'lucide-react'

export default function Shopping() {
  const { unchecked, checked, add, toggle, remove, clearChecked } = useShopping()
  const [input, setInput] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    add(input)
    setInput('')
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaupaseðill</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {unchecked.length} eftir{checked.length > 0 ? ` · ${checked.length} lokið` : ''}
          </p>
        </div>
        {checked.length > 0 && (
          <button onClick={clearChecked} className="btn btn-ghost text-xs" style={{ color: 'var(--danger)' }}>
            <Trash2 size={13} /> Hreinsa
          </button>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="input text-sm"
          placeholder="Bæta við vöru..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary shrink-0">
          <Plus size={16} />
        </button>
      </form>

      {unchecked.length === 0 && checked.length === 0 && (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Tómur innkaupaseðill</p>
        </div>
      )}

      {unchecked.length > 0 && (
        <div className="flex flex-col gap-2">
          {unchecked.map(item => (
            <div key={item.id} className="card flex items-center gap-3 py-3">
              <button onClick={() => toggle(item.id)}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: 'var(--accent)' }}>
              </button>
              <span className="flex-1 text-sm">{item.name}</span>
              <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {checked.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs px-1 font-medium" style={{ color: 'var(--muted)' }}>Lokið</div>
          {checked.map(item => (
            <div key={item.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.5 }}>
              <button onClick={() => toggle(item.id)}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: 'var(--success)', background: 'var(--success)' }}>
                <Check size={12} color="#000" />
              </button>
              <span className="flex-1 text-sm" style={{ textDecoration: 'line-through' }}>{item.name}</span>
              <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
