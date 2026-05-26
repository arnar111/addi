import { useFootball } from '../../hooks/useFootball'
import { Trophy, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const POS_COLOR = {
  1: '#f59e0b', 2: '#f59e0b', 3: '#f59e0b', 4: '#3b82f6',
  5: '#3b82f6', 17: '#ef4444', 18: '#ef4444', 19: '#ef4444', 20: '#ef4444',
}

export default function FootballWidget() {
  const { table, matches, loading, arsenalRow } = useFootball()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ minHeight: 90 }}>
      <div className="h-4 w-32 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="h-8 w-full rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  const top6 = (table || []).slice(0, 6)
  const arsenalMatch = matches?.find(m => m.isArsenal)

  return (
    <Link to="/sports" className="card block" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(255,255,255,0.02))', textDecoration: 'none', color: 'inherit' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Premier League</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <span>Sjá allt</span>
          <ExternalLink size={11} />
        </div>
      </div>

      {/* Arsenal highlight */}
      {arsenalRow && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-3"
             style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-xl">🔴</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#ef4444' }}>Arsenal</span>
              {arsenalRow.pos <= 4 && <span className="badge text-xs" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>UCL</span>}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {arsenalRow.played} leikir · Sk: {arsenalRow.won} · Jafn: {arsenalRow.drawn} · Tap: {arsenalRow.lost}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Sæti</div>
            <div className="text-xl font-bold" style={{ color: POS_COLOR[arsenalRow.pos] || 'var(--text)' }}>
              {arsenalRow.pos}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Stig</div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{arsenalRow.points}</div>
          </div>
        </div>
      )}

      {/* Arsenal upcoming/recent match */}
      {arsenalMatch && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3"
             style={{ background: 'var(--surface2)' }}>
          <span className="text-xs flex-1 truncate" style={{ color: 'var(--muted)' }}>
            {arsenalMatch.statusState === 'in' ? '🔴 LIVE' : arsenalMatch.statusState === 'post' ? '⚪ Lokið' : '🗓️ Væntanlegur'}
          </span>
          <span className="text-xs font-medium">{arsenalMatch.home}</span>
          {arsenalMatch.statusState !== 'pre' ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>
              {arsenalMatch.homeScore} - {arsenalMatch.awayScore}
            </span>
          ) : (
            <span className="text-xs px-1" style={{ color: 'var(--muted)' }}>vs</span>
          )}
          <span className="text-xs font-medium">{arsenalMatch.away}</span>
        </div>
      )}

      {/* Mini table top 6 */}
      <div className="flex flex-col gap-0.5">
        <div className="grid text-xs px-1 mb-0.5" style={{ gridTemplateColumns: '18px 1fr 26px 26px 26px 28px', color: 'var(--muted)' }}>
          <span>#</span><span>Lið</span><span className="text-center">L</span><span className="text-center">J</span>
          <span className="text-center">GD</span><span className="text-right font-semibold">Stig</span>
        </div>
        {top6.map(row => (
          <div key={row.pos}
               className="grid items-center text-xs px-1 py-1 rounded-lg"
               style={{
                 gridTemplateColumns: '18px 1fr 26px 26px 26px 28px',
                 background: row.isArsenal ? 'rgba(239,68,68,0.08)' : 'transparent',
                 border: row.isArsenal ? '1px solid rgba(239,68,68,0.15)' : '1px solid transparent',
               }}>
            <span className="font-semibold" style={{ color: POS_COLOR[row.pos] || 'var(--muted)', fontSize: 10 }}>{row.pos}</span>
            <span className="truncate font-medium" style={{ color: row.isArsenal ? '#ef4444' : 'var(--text)' }}>{row.name}</span>
            <span className="text-center" style={{ color: 'var(--muted)' }}>{row.played}</span>
            <span className="text-center" style={{ color: 'var(--muted)' }}>{row.won}</span>
            <span className="text-center" style={{ color: row.gd > 0 ? 'var(--success)' : row.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
              {row.gd > 0 ? '+' : ''}{row.gd}
            </span>
            <span className="text-right font-bold">{row.points}</span>
          </div>
        ))}
      </div>
    </Link>
  )
}
