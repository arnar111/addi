import { useState } from 'react'
import { useWatchlist, WATCH_STATUSES, WATCH_TYPES } from '../hooks/useWatchlist'
import { Plus, Trash2, X, ChevronDown } from 'lucide-react'

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="text-base transition-all"
          style={{ color: s <= (value ?? 0) ? '#eab308' : 'var(--muted)', opacity: s <= (value ?? 0) ? 1 : 0.3 }}>
          ★
        </button>
      ))}
    </div>
  )
}

function WatchItem({ item, onRemove, onStatusChange, onRatingChange }) {
  const [expanded, setExpanded] = useState(false)
  const type = WATCH_TYPES.find(t => t.id === item.type) ?? WATCH_TYPES[0]
  const status = WATCH_STATUSES.find(s => s.id === item.status) ?? WATCH_STATUSES[0]

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: `${status.color}18` }}>
          {type.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight">{item.title}</div>
          {item.genre && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.genre}</div>
          )}
          {item.status === 'watched' && item.rating && (
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= item.rating ? '#eab308' : 'var(--muted)', opacity: s <= item.rating ? 1 : 0.3, fontSize: 11 }}>★</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(e => !e)} className="p-1 rounded-lg"
                  style={{ color: 'var(--muted)' }}>
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => onRemove(item.id)} className="p-1 rounded-lg"
                  style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1 animate-slide-up">
          <div className="flex gap-2">
            {WATCH_STATUSES.map(s => (
              <button key={s.id} onClick={() => onStatusChange(item.id, s.id)}
                className="btn text-xs flex-1 justify-center py-1.5"
                style={{
                  background: item.status === s.id ? `${s.color}20` : 'var(--surface2)',
                  color: item.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${item.status === s.id ? s.color + '40' : 'transparent'}`,
                  padding: '6px 4px',
                  fontSize: 11,
                }}>
                {s.label}
              </button>
            ))}
          </div>
          {item.status === 'watched' && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Einkunn:</span>
              <StarRating value={item.rating} onChange={r => onRatingChange(item.id, r)} />
            </div>
          )}
          {item.note && (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.note}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Watchlist() {
  const { items, add, remove, updateStatus, updateRating } = useWatchlist()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('movie')
  const [genre, setGenre] = useState('')
  const [tab, setTab] = useState('want')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    add(title.trim(), type, '', genre.trim())
    setTitle('')
    setGenre('')
    setShowForm(false)
  }

  const tabItems = items.filter(i => i.status === tab)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Myndasafn</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {items.filter(i => i.status === 'want').length} á lista · {items.filter(i => i.status === 'watched').length} séð
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný færsla</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Titill kvikmyndar eða þáttar" value={title}
                 onChange={e => setTitle(e.target.value)} autoFocus />
          <input className="input" placeholder="Tegund (t.d. Drama, Thriller)" value={genre}
                 onChange={e => setGenre(e.target.value)} />
          <div className="flex gap-2">
            {WATCH_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setType(t.id)}
                className="btn text-xs flex-1 justify-center py-1.5"
                style={{
                  background: type === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: type === t.id ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${type === t.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við lista</button>
        </form>
      )}

      <div className="flex gap-2">
        {WATCH_STATUSES.map(s => {
          const count = items.filter(i => i.status === s.id).length
          return (
            <button key={s.id} onClick={() => setTab(s.id)}
              className="btn text-xs flex-1 justify-center"
              style={{
                background: tab === s.id ? `${s.color}18` : 'var(--surface)',
                color: tab === s.id ? s.color : 'var(--muted)',
                border: `1px solid ${tab === s.id ? s.color + '40' : 'var(--border)'}`,
                padding: '8px 4px',
              }}>
              {s.label} {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        {tabItems.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {tab === 'want' ? 'Engar kvikmyndir á listanum' :
               tab === 'watching' ? 'Ekki að horfa á neitt núna' :
               'Engar kvikmyndir séðar ennþá'}
            </p>
          </div>
        ) : (
          tabItems.map(item => (
            <WatchItem
              key={item.id}
              item={item}
              onRemove={remove}
              onStatusChange={updateStatus}
              onRatingChange={updateRating}
            />
          ))
        )}
      </div>
    </div>
  )
}
