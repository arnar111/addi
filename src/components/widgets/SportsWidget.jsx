import { useSports, getMatchResult } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')

function ResultBadge({ result }) {
  const color = result === 'W' ? 'var(--success)' : result === 'L' ? 'var(--danger)' : 'var(--muted)'
  return (
    <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color }}>
      {result}
    </span>
  )
}

function EventRow({ event, teamKeyword }) {
  const { opponent, myScore, oppScore, hasResult, result, dateStr } = getMatchResult(event, teamKeyword)
  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {result ? <ResultBadge result={result} /> : <span className="w-5 shrink-0" />}
      <span className="text-xs flex-1 truncate" style={{ color: hasResult ? 'var(--text)' : 'var(--muted)' }}>
        {opponent}
      </span>
      <span className="text-xs font-mono shrink-0" style={{ color: hasResult ? 'var(--text)' : 'var(--muted)' }}>
        {hasResult ? `${myScore}–${oppScore}` : dateStr}
      </span>
    </div>
  )
}

export default function SportsWidget() {
  const { data, loading } = useSports()

  const now = new Date()
  const daysToWC = Math.ceil((WC_START - now) / (1000 * 60 * 60 * 24))
  const showWC = daysToWC > 0 && daysToWC <= 30

  return (
    <div className="flex flex-col gap-3">
      {/* World Cup 2026 Countdown */}
      {showWC && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(249,115,22,0.25)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
                FIFA World Cup 2026
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold" style={{ color: '#f97316' }}>{daysToWC}</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>dagar eftir 🇮🇸</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Hefst 11. júní · USA/Canada/México
              </div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      )}

      {/* Inter Milan */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚫🔵</span>
            <span className="font-semibold text-sm">Inter Milan</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Serie A</span>
          </div>
          <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Meira <ChevronRight size={11} />
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-3 rounded animate-pulse-soft" style={{ background: 'var(--surface2)', width: `${70 + i * 8}%` }} />
            ))}
          </div>
        ) : data?.inter?.last?.length > 0 ? (
          data.inter.last.slice(0, 4).map((e, i) => (
            <EventRow key={i} event={e} teamKeyword="inter" />
          ))
        ) : (
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Engar niðurstöður fundust</p>
        )}
      </div>

      {/* NBA Cavaliers */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏀</span>
            <span className="font-semibold text-sm">Cleveland Cavaliers</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>NBA</span>
          </div>
          <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Meira <ChevronRight size={11} />
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map(i => (
              <div key={i} className="h-3 rounded animate-pulse-soft" style={{ background: 'var(--surface2)', width: `${75 + i * 5}%` }} />
            ))}
          </div>
        ) : data?.cavs?.last?.length > 0 ? (
          data.cavs.last.slice(0, 3).map((e, i) => (
            <EventRow key={i} event={e} teamKeyword="cavaliers" />
          ))
        ) : (
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Engar niðurstöður fundust</p>
        )}
      </div>
    </div>
  )
}
