import { useNews } from '../../hooks/useNews'
import { ExternalLink, RefreshCw } from 'lucide-react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}m`
  if (h < 24) return `${h}klst`
  return `${Math.floor(h / 24)}d`
}

export default function NewsWidget() {
  const { items, loading } = useNews()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-full rounded" style={{ background: 'var(--surface2)' }} />
            <div className="h-3 w-3/4 rounded" style={{ background: 'var(--surface2)' }} />
          </div>
        </div>
      ))}
    </div>
  )

  if (items.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Fréttir</div>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            Heimildin
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
            Vísir
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        {items.slice(0, 6).map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
             className="flex items-start gap-3 py-2.5 border-b last:border-0 group"
             style={{ borderColor: 'var(--border)', textDecoration: 'none' }}>
            <div className="flex-1 min-w-0">
              <div className="text-sm leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2"
                   style={{ color: 'var(--text)' }}>
                {item.title}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-medium" style={{ color: item.source === 'Heimildin' ? 'var(--accent)' : '#a78bfa' }}>
                  {item.source}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>· {timeAgo(item.pubDate)}</span>
              </div>
            </div>
            <ExternalLink size={12} style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 3 }} />
          </a>
        ))}
      </div>
    </div>
  )
}
