import { useState } from 'react'
import { useNotes } from '../hooks/useNotes'
import { useShopping } from '../hooks/useShopping'
import { SHOP_CATS } from '../hooks/useShopping'
import { Plus, Search, Pin, Trash2, Edit2, X, Check, ShoppingCart } from 'lucide-react'

// ── Notes ──────────────────────────────────────────────────────────────────
function NoteCard({ note, onRemove, onPin, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(note.text)
  const save = () => { onUpdate(note.id, text); setEditing(false) }

  return (
    <div className="card flex flex-col gap-2"
         style={{ borderColor: note.pinned ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
      {editing ? (
        <>
          <textarea className="input resize-none text-sm leading-relaxed" rows={4} value={text}
            onChange={e => setText(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <button onClick={save} className="btn btn-primary text-xs py-1.5 px-3"><Check size={12} /> Vista</button>
            <button onClick={() => { setText(note.text); setEditing(false) }} className="btn btn-ghost text-xs py-1.5 px-3"><X size={12} /></button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
          <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(note.updatedAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex gap-1">
              <button onClick={() => onPin(note.id)} style={{ color: note.pinned ? 'var(--accent)' : 'var(--muted)', padding: 4 }}>
                <Pin size={13} />
              </button>
              <button onClick={() => setEditing(true)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Edit2 size={13} />
              </button>
              <button onClick={() => onRemove(note.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function NotesTab({ showNewForm, onCloseForm }) {
  const { notes, add, update, remove, pin, search } = useNotes()
  const [query, setQuery] = useState('')
  const [newText, setNewText] = useState('')

  const results = search(query)
  const handleAdd = (e) => { e.preventDefault(); add(newText); setNewText(''); onCloseForm() }

  return (
    <div className="flex flex-col gap-3">
      {showNewForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <textarea className="input resize-none text-sm" rows={4} placeholder="Skrifaðu minnisblað..."
            value={newText} onChange={e => setNewText(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">Vista</button>
            <button type="button" onClick={onCloseForm} className="btn btn-ghost"><X size={16} /></button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input className="input pl-9 text-sm" placeholder="Leita í minnisblöðum..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {results.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          {query ? 'Engar niðurstöður' : 'Engin minnisblöð enn'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map(n => (
            <NoteCard key={n.id} note={n} onRemove={remove} onPin={pin} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Shopping ───────────────────────────────────────────────────────────────
function ShoppingTab() {
  const { items, addItem, toggle, remove, clearDone, clearAll, pending, done } = useShopping()
  const [text, setText] = useState('')
  const [cat, setCat] = useState('other')
  const [showCats, setShowCats] = useState(false)

  const catInfo = SHOP_CATS.find(c => c.id === cat) || SHOP_CATS[SHOP_CATS.length - 1]

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(text, cat)
    setText('')
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleAdd} className="card flex flex-col gap-2">
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowCats(!showCats)}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg transition-all"
            style={{ background: 'var(--surface2)', border: showCats ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
            {catInfo.icon}
          </button>
          <input className="input text-sm flex-1" placeholder="Bæta við vöru..." value={text}
            onChange={e => setText(e.target.value)} />
          <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
            <Plus size={16} />
          </button>
        </div>
        {showCats && (
          <div className="grid grid-cols-4 gap-1.5">
            {SHOP_CATS.map(c => (
              <button key={c.id} type="button" onClick={() => { setCat(c.id); setShowCats(false) }}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: cat === c.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${cat === c.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  color: cat === c.id ? 'var(--accent)' : 'var(--muted)',
                }}>
                <span className="text-base">{c.icon}</span>
                <span style={{ fontSize: 9 }}>{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {items.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {pending.length} eftir · {done.length} í körfu
          </span>
          <div className="flex gap-3">
            {done.length > 0 && (
              <button onClick={clearDone} className="text-xs" style={{ color: 'var(--accent)' }}>
                Hreinsa lokið
              </button>
            )}
            <button onClick={clearAll} className="text-xs" style={{ color: 'var(--danger)' }}>
              Hreinsa allt
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="card text-center py-10 flex flex-col items-center gap-2" style={{ color: 'var(--muted)' }}>
          <ShoppingCart size={28} className="opacity-40" />
          <span className="text-sm">Innkaupalisti tómur</span>
          <span className="text-xs">Bættu við vöru hér að ofan</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {pending.map(item => {
            const c = SHOP_CATS.find(c => c.id === item.category) || SHOP_CATS[SHOP_CATS.length - 1]
            return (
              <div key={item.id} className="card flex items-center gap-3 py-3">
                <button onClick={() => toggle(item.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{ borderColor: 'var(--accent)' }} />
                <span className="text-xl shrink-0">{c.icon}</span>
                <span className="text-sm flex-1">{item.text}</span>
                <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
          {done.map(item => {
            const c = SHOP_CATS.find(c => c.id === item.category) || SHOP_CATS[SHOP_CATS.length - 1]
            return (
              <div key={item.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.45 }}>
                <button onClick={() => toggle(item.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--success)', border: '2px solid var(--success)' }}>
                  <Check size={12} color="#000" />
                </button>
                <span className="text-xl shrink-0">{c.icon}</span>
                <span className="text-sm flex-1 line-through">{item.text}</span>
                <button onClick={() => remove(item.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Notes() {
  const { notes } = useNotes()
  const { pending } = useShopping()
  const [tab, setTab] = useState('notes')
  const [showNewForm, setShowNewForm] = useState(false)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">
            {tab === 'notes' ? 'Minnisblöð' : 'Innkaupalisti'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {tab === 'notes' ? `${notes.length} minnisblöð` : `${pending.length} vara eftir`}
          </p>
        </div>
        {tab === 'notes' && (
          <button onClick={() => setShowNewForm(f => !f)} className="btn btn-primary">
            <Plus size={16} /> Nýtt
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['notes', 'Minnisblöð'], ['shopping', '🛒 Innkaup']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{label}</button>
        ))}
      </div>

      {tab === 'notes' && <NotesTab showNewForm={showNewForm} onCloseForm={() => setShowNewForm(false)} />}
      {tab === 'shopping' && <ShoppingTab />}
    </div>
  )
}
