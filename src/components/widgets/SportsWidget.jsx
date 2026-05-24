import { Link } from 'react-router-dom'
import { useSpursFixtures, useWorldCupCountdown } from '../../hooks/useSports'
import { ChevronRight } from 'lucide-react'

export default function SportsWidget() {
  const { last, next, loading } = useSpursFixtures()
  const wc = useWorldCupCountdown()

  const match = next || last
  const isNext = !!next

  return (
    <Link to="/sports" className="card block" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">⚽ Íþróttir</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
          <span>Sjá meira</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* WC countdown pill */}
      {!wc.started && wc.days <= 30 && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl"
             style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.15)' }}>
          <span className="text-base">🏆</span>
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {wc.days}d {wc.hours}h {wc.minutes}m eftir
            </div>
          </div>
        </div>
      )}
      {wc.started && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl"
             style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <span className="text-base">🏆</span>
          <div className="text-xs font-semibold" style={{ color: 'var(--success)' }}>World Cup 2026 — LIVE!</div>
        </div>
      )}

      {/* Spurs match */}
      {loading && (
        <div className="h-10 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
      )}
      {!loading && match && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {match.homeBadge && <img src={match.homeBadge} alt="" className="w-5 h-5 object-contain shrink-0" />}
            <span className="text-xs truncate" style={{ color: 'var(--text)' }}>{match.home}</span>
          </div>
          <div className="mx-2 text-xs font-bold shrink-0" style={{ color: 'var(--muted)' }}>
            {!isNext && match.homeScore != null
              ? `${match.homeScore}–${match.awayScore}`
              : 'vs'}
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="text-xs truncate" style={{ color: 'var(--text)' }}>{match.away}</span>
            {match.awayBadge && <img src={match.awayBadge} alt="" className="w-5 h-5 object-contain shrink-0" />}
          </div>
        </div>
      )}
      {!loading && match && (
        <div className="text-xs mt-1 px-1" style={{ color: 'var(--muted)' }}>
          {isNext ? `Næsti leikur · ${match.date}` : `Síðasti leikur · ${match.date}`}
        </div>
      )}
    </Link>
  )
}
