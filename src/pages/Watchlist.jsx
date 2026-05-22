import { useState } from 'react'
import { useWatchlist, WATCH_STATUSES, WATCH_TYPES } from '../hooks/useWatchlist'
import { Plus, Trash2, X, Star, ExternalLink } from 'lucide-react'

function RatingStars({ rating, onRate, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onRate(n)} style={{ color: n <= (rating || 0) ? '#eab308' : 'var(--muted)' }}>
          <Star size={size} fill={n <= (rating || 0) ? '#eab308' : 'none'} />
        </button>
      ))}
    </div>
  )
}

function WatchCard({ item, onStatusChange, onRate, onRemove }) {
  const type = WATCH_TYPES.find(t => t.id === item.type) || WATCH_TYPES[0]

  return (
    <div className="card flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'var(--surface2)' }}>
        {type.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm leading-tight">{item.title}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {item.year && `${item.year} · `}{item.genre}
            </div>
          </div>
          <button onClick={() => onRemove(item.id)} style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <Trash2 size={13} />
          </button>
        </div>

        {item.notes && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{item.notes}</p>
        )}

        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          {item.status === 'watched' ? (
            <RatingStars rating={item.rating} onRate={(r) => onRate(item.id, r)} />
          ) : (
            <div className="flex gap-1 flex-wrap">
              {WATCH_STATUSES.filter(s => s.id !== item.status).map(s => (
                <button key={s.id} onClick={() => onStatusChange(item.id, s.id)}
                  className="btn text-xs py-0.5 px-2"
                  style={{
                    background: `${s.color}15`,
                    color: s.color,
                    border: `1px solid ${s.color}33`,
                  }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Watchlist() {
  const { items, add, updateStatus, setRating, remove, byStatus, wantCount } = useWatchlist()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('want')
  const [form, setForm] = useState({ title: '', year: '', type: 'film', genre: '', notes: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    add({ ...form, status: tab === 'watched' ? 'want' : tab })
    setForm({ title: '', year: '', type: 'film', genre: '', notes: '' })
    setShowForm(false)
  }

  const displayed = byStatus(tab)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Myndalisti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {wantCount} til að horfa · {byStatus('watched').length} séð
          </p>
        </div>
        <div className="flex gap-2">
          <a href="https://www.patreon.com/popcorninbed" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost text-xs py-1.5">
            🍿 Patreon
          </a>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Bæta við
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {WATCH_STATUSES.map(s => (
          <button key={s.id} onClick={() => setTab(s.id)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === s.id ? `${s.color}18` : 'var(--surface)',
              color: tab === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${tab === s.id ? s.color + '44' : 'var(--border)'}`,
            }}>
            {s.icon} {s.label}
            {s.id === 'want' && wantCount > 0 && (
              <span className="ml-1 badge" style={{ background: `${s.color}22`, color: s.color }}>{wantCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við kvikmynd / þætti</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input text-sm col-span-2" placeholder="Titill *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <input className="input text-sm" type="number" placeholder="Ár" value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            {WATCH_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, type: t.id }))}
                className="btn text-xs py-1 flex-1"
                style={{
                  background: form.type === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: form.type === t.id ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${form.type === t.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Tegund (Drama, Þriller...)" value={form.genre}
            onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} />
          <textarea className="input text-sm resize-none" rows={2} placeholder="Minnispunktar..."
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Vista</button>
        </form>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {displayed.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            <div className="text-3xl mb-2">🎬</div>
            <div className="text-sm">
              {tab === 'want' ? 'Engar kvikmyndir á listanum' :
               tab === 'watching' ? 'Ekki að horfa á neitt' : 'Engar séðar kvikmyndir'}
            </div>
          </div>
        ) : displayed.map(item => (
          <WatchCard key={item.id} item={item} onStatusChange={updateStatus} onRate={setRating} onRemove={remove} />
        ))}
      </div>
    </div>
  )
}
