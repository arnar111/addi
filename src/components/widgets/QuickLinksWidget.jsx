import { useState } from 'react'
import { useLinks } from '../../hooks/useLinks'
import { Plus, Trash2, X, Link } from 'lucide-react'

const LINK_ICONS = ['🔗','🏦','📰','📺','🌦️','💼','🛍️','📧','🎵','📱','🏠','✈️','🎮','📊','🌐']

export default function QuickLinksWidget() {
  const { links, add, remove } = useLinks()
  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [icon, setIcon] = useState('🔗')

  const handleAdd = (e) => {
    e.preventDefault()
    add(label, url, icon)
    setLabel(''); setUrl(''); setIcon('🔗')
    setShowForm(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Flýtitenglar</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ color: 'var(--accent)' }} className="text-xs flex items-center gap-1">
          <Plus size={13} /> Bæta við
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <select className="input text-sm shrink-0" style={{ width: 52, padding: '8px 6px' }}
              value={icon} onChange={e => setIcon(e.target.value)}>
              {LINK_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
            <input className="input text-sm flex-1" placeholder="Nafn" value={label} onChange={e => setLabel(e.target.value)} autoFocus />
          </div>
          <input className="input text-sm" placeholder="URL (t.d. mbl.is)" value={url} onChange={e => setUrl(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center text-xs">Vista</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost"><X size={14} /></button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-4 gap-2">
        {links.map(l => (
          <div key={l.id} className="relative group">
            <a href={l.url} target="_blank" rel="noreferrer"
               className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:bg-[var(--surface2)]"
               style={{ textDecoration: 'none' }}>
              <span className="text-2xl">{l.icon}</span>
              <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', wordBreak: 'break-word' }}>{l.label}</span>
            </a>
            <button onClick={() => remove(l.id)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'var(--danger)', fontSize: 8 }}>
              <X size={8} color="#fff" />
            </button>
          </div>
        ))}

        {links.length === 0 && (
          <div className="col-span-4 text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
            Bættu við flýtitengil
          </div>
        )}
      </div>
    </div>
  )
}
