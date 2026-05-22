import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { wcCountdown } from '../../hooks/useSport'
import { useFootball, useGolf } from '../../hooks/useSport'

export default function SportsWidget() {
  const [cd, setCd] = useState(wcCountdown())
  const { matches } = useFootball()
  const { recentRounds } = useGolf()
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setCd(wcCountdown()), 60000)
    return () => clearInterval(t)
  }, [])

  const lastMatch = matches[0]
  const lastRound = recentRounds[0]

  return (
    <button onClick={() => navigate('/sport')} className="card w-full text-left"
            style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.07), rgba(249,115,22,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏆</span>
          <span className="font-semibold text-sm">World Cup 2026</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Sport →</span>
      </div>

      {cd.started ? (
        <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          Keppnin er hafin! 🎉
        </div>
      ) : (
        <div className="flex items-end gap-4 mb-2">
          <div className="text-center">
            <div className="text-3xl font-bold tabular-nums" style={{ color: '#c8102e' }}>{cd.days}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold tabular-nums">{cd.hours}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>klst</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold tabular-nums">{cd.minutes}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>mín</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Opnunarleikur</div>
            <div className="text-xs font-medium">11. júní 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · CAN · MEX</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {lastMatch ? (
          <div className="flex-1 text-xs" style={{ color: 'var(--muted)' }}>
            ⚽ {lastMatch.team1} {lastMatch.score1}–{lastMatch.score2} {lastMatch.team2}
          </div>
        ) : (
          <div className="flex-1 text-xs" style={{ color: 'var(--muted)' }}>
            ⚽ Engar niðurstöður skráðar
          </div>
        )}
        {lastRound && (
          <div className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
            🏌️ {lastRound.diff >= 0 ? '+' : ''}{lastRound.diff}
          </div>
        )}
      </div>
    </button>
  )
}
