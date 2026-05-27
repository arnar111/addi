import { useFootball } from '../../hooks/useFootball'
import { Shield, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function ResultBadge({ result }) {
  const colors = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
  const labels = { W: 'W', D: 'D', L: 'L' }
  if (!result) return null
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold"
      style={{ background: colors[result] + '33', color: colors[result] }}
    >
      {labels[result]}
    </span>
  )
}

function FormStrip({ matches }) {
  if (!matches?.length) return null
  return (
    <div className="flex gap-1">
      {matches.slice(-5).map((m, i) => (
        <ResultBadge key={m?.id || i} result={m?.result} />
      ))}
    </div>
  )
}

function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function FootballWidget() {
  const { data, loading } = useFootball()

  if (loading) {
    return (
      <div className="card animate-pulse-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-28 rounded" style={{ background: 'var(--surface2)' }} />
          <div className="h-3 w-20 rounded" style={{ background: 'var(--surface2)' }} />
        </div>
      </div>
    )
  }

  const { lastMatch, nextMatch, standing, lastMatches } = data || {}

  return (
    <Link to="/sports" style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(255,255,255,0.03))',
          border: '1px solid rgba(239,68,68,0.2)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Arsenal badge */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}
            >
              🔴
            </div>
            <div>
              <div className="font-semibold text-sm">Arsenal</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {standing ? `${standing.position}. sæti · ${standing.points} stig` : 'Premier League'}
              </div>
            </div>
          </div>
          <FormStrip matches={lastMatches} />
        </div>

        {/* Last result */}
        {lastMatch && lastMatch.completed && (
          <div
            className="flex items-center justify-between p-2.5 rounded-xl mb-2"
            style={{ background: 'var(--surface2)' }}
          >
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>{lastMatch.isArsenalHome ? 'ARS' : lastMatch.opponent?.shortName}</span>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{
                  background: lastMatch.result === 'W' ? 'rgba(34,197,94,0.15)' : lastMatch.result === 'L' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                  color: lastMatch.result === 'W' ? '#22c55e' : lastMatch.result === 'L' ? '#ef4444' : '#f97316',
                }}
              >
                {lastMatch.arsenalScore} – {lastMatch.oppScore}
              </span>
              <span>{lastMatch.isArsenalHome ? lastMatch.opponent?.shortName : 'ARS'}</span>
            </div>
          </div>
        )}

        {/* Next match */}
        {nextMatch && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <Shield size={11} />
            <span>Næsti leikur: <span style={{ color: 'var(--text)' }}>Arsenal vs {nextMatch.opponent?.name}</span> · {formatMatchDate(nextMatch.date)}</span>
          </div>
        )}

        {!nextMatch && !lastMatch && (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Engir leikir í beinni — off-season 😴
          </div>
        )}
      </div>
    </Link>
  )
}
