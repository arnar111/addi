import { useFootball } from '../../hooks/useFootball'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const MUFC_COLOR = '#DA291C'

function parseResult(match) {
  if (!match || match.intHomeScore == null) return null
  const isHome = match.strHomeTeam?.toLowerCase().includes('manchester united')
  const ms = Number(isHome ? match.intHomeScore : match.intAwayScore)
  const os = Number(isHome ? match.intAwayScore : match.intHomeScore)
  const opp = isHome ? match.strAwayTeam : match.strHomeTeam
  return {
    score: isHome ? `${ms}–${os}` : `${os}–${ms}`,
    opp: opp?.replace('Manchester', 'Man').replace('FC', '').trim(),
    venue: isHome ? 'H' : 'A',
    outcome: ms > os ? 'W' : ms < os ? 'L' : 'D',
  }
}

export default function FootballWidget() {
  const { mufcRow, recentMatches, loading } = useFootball()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl shrink-0" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-28 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-20 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  const last = parseResult(recentMatches[0])
  const resultColor = { W: 'var(--success)', L: 'var(--danger)', D: '#f97316' }

  return (
    <div className="card" style={{ borderColor: `${MUFC_COLOR}22` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔴</span>
          <span className="font-semibold text-sm">Man Utd</span>
          {mufcRow && (
            <span className="text-xs px-1.5 py-0.5 rounded-lg font-semibold"
                  style={{ background: `${MUFC_COLOR}22`, color: MUFC_COLOR }}>
              #{mufcRow.intRank}
            </span>
          )}
        </div>
        <Link to="/sport" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          PL töflur <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {mufcRow ? (
          <div className="flex gap-4">
            {[
              [mufcRow.intPoints, 'Stig', MUFC_COLOR],
              [mufcRow.intWin, 'W', 'var(--success)'],
              [mufcRow.intDraw, 'D', '#f97316'],
              [mufcRow.intLoss, 'L', 'var(--danger)'],
            ].map(([val, label, color]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-base font-bold" style={{ color }}>{val}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Engin gögn í boði</span>
        )}

        {last && (
          <div className="ml-auto flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{last.opp} ({last.venue})</div>
              <div className="text-sm font-semibold">{last.score}</div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                 style={{ background: `${resultColor[last.outcome]}22`, color: resultColor[last.outcome] }}>
              {last.outcome}
            </div>
          </div>
        )}
      </div>

      {recentMatches.length > 1 && (
        <div className="flex gap-1.5 mt-3">
          {recentMatches.slice(0, 5).map((m, i) => {
            const r = parseResult(m)
            if (!r) return null
            return (
              <div key={m.idEvent || i}
                   className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ background: `${resultColor[r.outcome]}22`, color: resultColor[r.outcome] }}>
                {r.outcome}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
