import { ExternalLink } from 'lucide-react'

const LINKS = [
  { label: 'Lendó', url: 'https://lendoapp.is', emoji: '🏠', color: '#00d4aa' },
  { label: 'The Athletic', url: 'https://theathletic.com', emoji: '⚽', color: '#e53e3e' },
  { label: 'Xbox', url: 'https://www.xbox.com', emoji: '🎮', color: '#107c10' },
  { label: 'Survivor', url: 'https://docs.google.com/spreadsheets/d/1BmIRZFKV6snv2CibGxAEehJgSIhbLfffibOMXypSFvo', emoji: '🏝️', color: '#f6ad55' },
  { label: 'Reddit', url: 'https://reddit.com/r/ClaudeAI', emoji: '🤖', color: '#ff4500' },
  { label: 'Coursera', url: 'https://coursera.org', emoji: '📚', color: '#0056d2' },
  { label: 'Audible', url: 'https://audible.com', emoji: '🎧', color: '#f69220' },
  { label: 'Trip.com', url: 'https://trip.com', emoji: '✈️', color: '#1890ff' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">⚡</span>
        <span className="text-sm font-semibold">Flýtileiðir</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all active:scale-95"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-xl">{link.emoji}</span>
            <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
