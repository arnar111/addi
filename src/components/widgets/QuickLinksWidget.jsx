import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Plus, X, GripVertical } from 'lucide-react'
import { useState } from 'react'

const DEFAULT_LINKS = [
  { id: '1', label: 'The Athletic', url: 'https://theathletic.com', emoji: '⚽' },
  { id: '2', label: 'Xbox', url: 'https://www.xbox.com', emoji: '🎮' },
  { id: '3', label: 'GOLF+', url: 'https://golfplus.com', emoji: '⛳' },
  { id: '4', label: 'Coursera', url: 'https://coursera.org', emoji: '🎓' },
  { id: '5', label: 'Reddit', url: 'https://reddit.com/r/ClaudeAI', emoji: '🤖' },
  { id: '6', label: 'alfred.is', url: 'https://alfred.is', emoji: '💼' },
  { id: '7', label: 'Audible', url: 'https://audible.com', emoji: '🎧' },
  { id: '8', label: 'Costco', url: 'https://costco.is', emoji: '🛒' },
]

export default function QuickLinksWidget() {
  const [links, setLinks] = useLocalStorage('addi_quicklinks', DEFAULT_LINKS)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newEmoji, setNewEmoji] = useState('🔗')
  const [editing, setEditing] = useState(false)

  const add = (e) => {
    e.preventDefault()
    if (!newLabel.trim() || !newUrl.trim()) return
    const url = newUrl.startsWith('http') ? newUrl : 'https://' + newUrl
    setLinks(prev => [...prev, { id: Date.now().toString(), label: newLabel.trim(), url, emoji: newEmoji }])
    setNewLabel(''); setNewUrl(''); setNewEmoji('🔗'); setAdding(false)
  }

  const remove = (id) => setLinks(prev => prev.filter(l => l.id !== id))

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Flýtileiðir</span>
        <div className="flex gap-2">
          <button onClick={() => setEditing(e => !e)} className="text-xs" style={{ color: 'var(--muted)' }}>
            {editing ? 'Lokið' : 'Breyta'}
          </button>
          <button onClick={() => setAdding(a => !a)} className="text-xs" style={{ color: 'var(--accent)' }}>
            <Plus size={13} style={{ display: 'inline' }} /> Bæta við
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={add} className="flex flex-col gap-2 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} className="input text-center w-12 px-1 shrink-0" maxLength={2} />
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} className="input text-sm" placeholder="Heiti" />
          </div>
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} className="input text-sm" placeholder="URL (t.d. google.com)" />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 text-xs py-1.5 justify-center">Bæta við</button>
            <button type="button" onClick={() => setAdding(false)} className="btn btn-ghost text-xs py-1.5"><X size={13} /></button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-4 gap-2">
        {links.map(link => (
          <div key={link.id} className="relative">
            <a href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all active:scale-95"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl leading-none">{link.emoji}</span>
              <span className="text-center leading-tight" style={{ fontSize: 10, color: 'var(--muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                {link.label}
              </span>
            </a>
            {editing && (
              <button onClick={() => remove(link.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--danger)', border: '2px solid var(--bg)' }}>
                <X size={9} color="#fff" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
