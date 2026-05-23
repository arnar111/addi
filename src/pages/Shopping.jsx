import { useState } from 'react'
import { useShopping } from '../hooks/useShopping'
import { Plus, Trash2, X, Check, ShoppingCart } from 'lucide-react'

export default function Shopping() {
  const { lists, addItem, toggleItem, removeItem, clearDone, addList, totalPending } = useShopping()
  const [activeList, setActiveList] = useState(lists[0]?.id || '')
  const [newItem, setNewItem] = useState('')
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const list = lists.find(l => l.id === activeList)
  const pending = list?.items.filter(i => !i.done) || []
  const done = list?.items.filter(i => i.done) || []

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItem.trim() || !activeList) return
    addItem(activeList, newItem.trim())
    setNewItem('')
  }

  const handleAddList = (e) => {
    e.preventDefault()
    if (!newListName.trim()) return
    addList(newListName.trim())
    setNewListName('')
    setShowNewList(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Innkaup</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {totalPending} {totalPending === 1 ? 'hlutur' : 'hlutir'} eftir
          </p>
        </div>
        <button onClick={() => setShowNewList(v => !v)} className="btn btn-primary">
          <Plus size={16} /> Listi
        </button>
      </div>

      {showNewList && (
        <form onSubmit={handleAddList} className="card flex gap-2 animate-slide-up">
          <input className="input text-sm flex-1" placeholder="Nafn á lista..."
            value={newListName} onChange={e => setNewListName(e.target.value)} autoFocus />
          <button type="submit" className="btn btn-primary px-3">Búa til</button>
          <button type="button" onClick={() => setShowNewList(false)} className="btn btn-ghost px-3">
            <X size={14} />
          </button>
        </form>
      )}

      {/* List tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {lists.map(l => {
          const count = l.items.filter(i => !i.done).length
          return (
            <button key={l.id} onClick={() => setActiveList(l.id)}
              className="btn shrink-0 text-sm"
              style={{
                background: activeList === l.id ? `${l.color}20` : 'var(--surface)',
                color: activeList === l.id ? l.color : 'var(--muted)',
                border: `1px solid ${activeList === l.id ? l.color + '40' : 'var(--border)'}`,
              }}>
              {l.icon} {l.name}
              {count > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: l.color + '30', color: l.color }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {list && (
        <>
          {/* Add item */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input className="input text-sm flex-1" placeholder={`Bæta við ${list.name}...`}
              value={newItem} onChange={e => setNewItem(e.target.value)} />
            <button type="submit" className="btn btn-primary px-4">
              <Plus size={16} />
            </button>
          </form>

          {list.items.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
              <div className="text-sm font-medium">Listi er tómur</div>
              <div className="text-xs mt-1">Bættu hlutum við {list.name}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {/* Pending items */}
              {pending.map(item => (
                <div key={item.id} className="card flex items-center gap-3 py-3">
                  <button onClick={() => toggleItem(list.id, item.id)}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90"
                    style={{ borderColor: list.color }}>
                  </button>
                  <span className="text-sm flex-1">{item.text}</span>
                  <button onClick={() => removeItem(list.id, item.id)}
                          style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {/* Done items */}
              {done.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-1 pt-2 pb-1">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      Klárað ({done.length})
                    </span>
                    <button onClick={() => clearDone(list.id)} className="text-xs"
                            style={{ color: 'var(--danger)' }}>
                      Hreinsa
                    </button>
                  </div>
                  {done.map(item => (
                    <div key={item.id} className="card flex items-center gap-3 py-3"
                         style={{ opacity: 0.45 }}>
                      <button onClick={() => toggleItem(list.id, item.id)}
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: 'var(--success)', background: 'var(--success)' }}>
                        <Check size={11} color="#000" />
                      </button>
                      <span className="text-sm flex-1"
                            style={{ textDecoration: 'line-through' }}>
                        {item.text}
                      </span>
                      <button onClick={() => removeItem(list.id, item.id)}
                              style={{ color: 'var(--muted)', padding: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
