import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ExternalLink, Plus, X } from 'lucide-react'
import { useState } from 'react'

const DEFAULTS = [
  { id: '1', label: 'GitHub', url: 'https://github.com/arnar111', emoji: '🐙' },
  { id: '2', label: 'LinkedIn', url: 'https://linkedin.com', emoji: '💼' },
  { id: '3', label: 'The Athletic', url: 'https://theathletic.com', emoji: '📰' },
  { id: '4', label: 'SeatGeek', url: 'https://seatgeek.com', emoji: '🎟️' },
  { id: '5', label: 'Netlify', url: 'https://app.netlify.com', emoji: '🚀' },
  { id: '6', label: 'Solana', url: 'https://solscan.io', emoji: '◎' },
  { id: '7', label: 'Reddit', url: 'https://reddit.com/r/ClaudeCode', emoji: '👾' },
  { id: '8', label: 'Glassdoor', url: 'https://glassdoor.com', emoji: '🏢' },
]

export default function QuickLinksWidget() {
  const [links, setLinks] = useLocalStorage('addi_quicklinks', DEFAULTS)
  const [editing, setEditing] = useState(false)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Flýtileiðir</h3>
        <button onClick={() => setEditing(!editing)} className="text-xs"
                style={{ color: editing ? 'var(--danger)' : 'var(--accent)' }}>
          {editing ? 'Loka' : 'Breyta'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {links.map(link => (
          <div key={link.id} className="relative">
            <a href={link.url} target="_blank" rel="noreferrer"
               className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all"
               style={{ background: 'var(--surface2)' }}>
              <span className="text-xl">{link.emoji}</span>
              <span className="text-xs font-medium leading-tight text-center"
                    style={{ color: 'var(--muted)', fontSize: 10 }}>{link.label}</span>
            </a>
            {editing && (
              <button onClick={() => setLinks(prev => prev.filter(l => l.id !== link.id))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                style={{ background: 'var(--danger)', color: '#fff' }}>
                <X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
