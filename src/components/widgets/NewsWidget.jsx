import { ExternalLink } from 'lucide-react'

const SOURCES = [
  {
    name: 'Heimildin',
    desc: 'Morgunpósturinn',
    icon: '🇮🇸',
    url: 'https://heimildin.is',
    color: '#00d4aa',
  },
  {
    name: 'The Athletic',
    desc: 'Arsenal · PL',
    icon: '⚽',
    url: 'https://theathletic.com',
    color: '#ef4444',
  },
  {
    name: 'Washington Post',
    desc: 'Heimsfréttir',
    icon: '📰',
    url: 'https://washingtonpost.com',
    color: '#8b5cf6',
  },
  {
    name: 'Reddit',
    desc: 'r/Anthropic',
    icon: '🤖',
    url: 'https://reddit.com/r/Anthropic',
    color: '#ff6314',
  },
]

export default function NewsWidget() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Morgunlestur</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Hratt aðgengi</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SOURCES.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
             style={{ background: 'var(--surface2)', textDecoration: 'none', color: 'inherit' }}
             onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
             onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}>
            <span className="text-xl shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{s.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{s.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
