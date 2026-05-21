import { ExternalLink } from 'lucide-react'

const LINKS = [
  { label: 'Heimildin', url: 'https://www.heimildin.is', icon: '🇮🇸', desc: 'Íslenskar fréttir' },
  { label: 'The Athletic', url: 'https://theathletic.com/football', icon: '⚽', desc: 'Fótbolti' },
  { label: 'BBC Sport', url: 'https://www.bbc.com/sport/football', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', desc: 'World Cup 2026' },
  { label: 'Vísir', url: 'https://www.visir.is', icon: '📰', desc: 'Fréttir' },
]

export default function NewsWidget() {
  return (
    <div className="card">
      <div className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>Morgunlestur</div>
      <div className="grid grid-cols-2 gap-2">
        {LINKS.map(l => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
             className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
             style={{ background: 'var(--surface2)' }}>
            <span className="text-lg shrink-0">{l.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{l.label}</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)', fontSize: 10 }}>{l.desc}</div>
            </div>
            <ExternalLink size={10} style={{ color: 'var(--muted)', marginLeft: 'auto', shrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  )
}
