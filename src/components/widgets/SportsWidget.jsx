import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')

export default function SportsWidget() {
  const daysLeft = useMemo(() => {
    const diff = WC_START - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [])

  const started = daysLeft === 0

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.09), rgba(0,212,170,0.06))',
      border: '1px solid rgba(139,92,246,0.2)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <div className="font-semibold text-sm">Heimsbikarinn 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>BNA · Kanada · Mexíkó</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
            {started ? '🔴' : daysLeft}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {started ? 'Í gangi núna!' : daysLeft === 1 ? 'dagur eftir' : 'dagar eftir'}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="flex gap-2 mb-3">
        {[
          { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England',  sub: 'Fylgjast' },
          { flag: '🇺🇸',         name: 'USMNT',    sub: 'Heimalið' },
          { flag: '🇮🇸',         name: 'Ísland',   sub: 'Hjartað' },
        ].map(({ flag, name, sub }) => (
          <div key={name} className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-xl leading-none">{flag}</span>
            <div>
              <div className="text-xs font-semibold leading-tight">{name}</div>
              <div className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-2">
        <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
           className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium"
           style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <span>🎽</span> The Athletic <ExternalLink size={10} />
        </a>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium"
             style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <span>🎾</span> Sinner
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium"
             style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <span>🐓</span> Spurs
        </div>
      </div>
    </div>
  )
}
