import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Heimildin', icon: '📰', url: 'https://www.heimildin.is', color: '#3b82f6', external: true },
  { label: 'Athletic', icon: '⚽', url: 'https://www.theathletic.com', color: '#ef4444', external: true },
  { label: 'Reddit', icon: '🤖', url: 'https://www.reddit.com/r/Anthropic', color: '#ff6314', external: true },
  { label: 'Uppreisn', icon: '🗳️', url: 'https://www.uppreisn.is', color: '#8b5cf6', external: true },
  { label: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com', color: '#0a66c2', external: true },
  { label: 'Audible', icon: '🎧', url: 'https://www.audible.com', color: '#f97316', external: true },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all hover:opacity-80 active:scale-95"
            style={{
              background: `${link.color}18`,
              border: `1px solid ${link.color}30`,
              textDecoration: 'none',
            }}>
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs font-medium text-center leading-tight" style={{ color: link.color }}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
