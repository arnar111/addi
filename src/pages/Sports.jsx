import { useSports } from '../hooks/useSports'
import { Calendar, Trophy, RefreshCw, TrendingUp } from 'lucide-react'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  d.setHours(12, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}

function FormBadge({ char }) {
  const color = char === 'W' ? '#22c55e' : char === 'D' ? '#f97316' : '#ef4444'
  const label = char === 'W' ? 'S' : char === 'D' ? 'J' : 'T'
  return (
    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `${color}22`, color }}>
      {label}
    </span>
  )
}

function TableRow({ team, pos, isSpurs }) {
  const form = (team.strForm || '').split('').reverse().slice(0, 5)
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-xl transition-all"
         style={{
           background: isSpurs ? 'rgba(0,212,170,0.1)' : 'transparent',
           border: isSpurs ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
         }}>
      <span className="text-xs w-5 text-center font-medium shrink-0"
            style={{ color: pos <= 4 ? '#22c55e' : pos <= 6 ? '#3b82f6' : pos >= 18 ? '#ef4444' : 'var(--muted)' }}>
        {pos}
      </span>
      <span className="flex-1 text-sm font-medium truncate"
            style={{ color: isSpurs ? 'var(--accent)' : 'var(--text)' }}>
        {team.strTeam?.replace('Tottenham Hotspur', 'Spurs').replace('Manchester City', 'Man City')
          .replace('Manchester United', 'Man Utd').replace('Newcastle United', 'Newcastle')
          .replace('Nottingham Forest', "Nott'm F")}
      </span>
      <div className="hidden sm:flex gap-1 shrink-0">
        {form.map((c, i) => <FormBadge key={i} char={c} />)}
      </div>
      <div className="flex gap-3 text-xs shrink-0 ml-2" style={{ color: 'var(--muted)' }}>
        <span className="w-4 text-center">{team.intPlayed}</span>
        <span className="w-6 text-center font-bold" style={{ color: isSpurs ? 'var(--accent)' : 'var(--text)' }}>
          {team.intPoints}
        </span>
      </div>
    </div>
  )
}

function MatchCard({ match, type }) {
  const isSpursHome = match.strHomeTeam === 'Tottenham Hotspur'
  const opponent = isSpursHome ? match.strAwayTeam : match.strHomeTeam

  if (type === 'next') {
    const days = daysUntil(match.dateEvent)
    const matchDate = new Date(match.dateEvent)
    const dateLabel = matchDate.toLocaleDateString('is-IS', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    const timeLabel = match.strTime
      ? new Date(`2000-01-01T${match.strTime}`).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
      : ''

    return (
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))',
      }}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
            Næsti leikur
          </span>
          {days === 0 && (
            <span className="badge ml-auto animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              🔴 Í dag
            </span>
          )}
          {days === 1 && (
            <span className="badge ml-auto" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
              Á morgun
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <div className="text-base font-bold leading-tight">
              {isSpursHome ? '⚡ Spurs' : match.strHomeTeam}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {isSpursHome ? 'Heima' : 'Gestur'}
            </div>
          </div>
          <div className="text-3xl font-light px-4" style={{ color: 'var(--muted)' }}>vs</div>
          <div className="flex-1 text-center">
            <div className="text-base font-bold leading-tight">
              {!isSpursHome ? '⚡ Spurs' : match.strAwayTeam}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {!isSpursHome ? 'Heima' : 'Gestur'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 py-3 rounded-xl"
             style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateLabel}</span>
          {timeLabel && (
            <span className="text-sm font-semibold">{timeLabel}</span>
          )}
          {days !== null && days > 1 && (
            <span className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{days} dagar</span>
          )}
        </div>

        {match.strLeague && (
          <div className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
            {match.strLeague} · {match.strVenue || ''}
          </div>
        )}
      </div>
    )
  }

  if (type === 'last' && match.intHomeScore !== null) {
    const spursGoals = isSpursHome ? Number(match.intHomeScore) : Number(match.intAwayScore)
    const oppGoals = isSpursHome ? Number(match.intAwayScore) : Number(match.intHomeScore)
    const isWin = spursGoals > oppGoals
    const isDraw = spursGoals === oppGoals
    const resultColor = isWin ? 'var(--success)' : isDraw ? '#f97316' : 'var(--danger)'
    const resultLabel = isWin ? 'Sigur 🎉' : isDraw ? 'Jafntefli' : 'Tap'

    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={14} style={{ color: resultColor }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: resultColor }}>
            {resultLabel} · Síðasti leikur
          </span>
          <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
            {match.dateEvent
              ? new Date(match.dateEvent).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
              : ''}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="text-sm font-bold">{match.strHomeTeam}</div>
          </div>
          <div className="text-3xl font-bold tabular-nums px-4" style={{ color: resultColor }}>
            {match.intHomeScore}–{match.intAwayScore}
          </div>
          <div className="flex-1 text-center">
            <div className="text-sm font-bold">{match.strAwayTeam}</div>
          </div>
        </div>

        {match.strLeague && (
          <div className="text-xs text-center mt-3" style={{ color: 'var(--muted)' }}>
            {match.strLeague}
          </div>
        )}
      </div>
    )
  }

  return null
}

export default function Sports() {
  const { nextMatch, lastMatch, table, loading, error, refresh } = useSports()

  const spursPos = table ? table.findIndex(t => t.strTeam === 'Tottenham Hotspur') : -1

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Tottenham Hotspur
            {spursPos >= 0 && ` · ${spursPos + 1}. sæti í PL`}
          </p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px' }}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="card text-center py-4" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm" style={{ color: 'var(--danger)' }}>Ekki tókst að sækja gögn</p>
          <button onClick={refresh} className="btn btn-ghost text-xs mt-2">Reyna aftur</button>
        </div>
      )}

      {loading && !error && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="card animate-pulse-soft"
                 style={{ height: i === 2 ? 320 : 140, background: 'var(--surface)' }} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {nextMatch && <MatchCard match={nextMatch} type="next" />}
          {lastMatch && <MatchCard match={lastMatch} type="last" />}

          {table && table.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Premier League 2025/26</h3>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                  <span>L</span>
                  <span>Stig</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                {table.slice(0, spursPos >= 10 ? 5 : 20).map((team, i) => (
                  <TableRow
                    key={team.idTeam || i}
                    team={team}
                    pos={i + 1}
                    isSpurs={team.strTeam === 'Tottenham Hotspur'}
                  />
                ))}

                {spursPos >= 10 && (
                  <>
                    <div className="text-center text-xs py-1.5 my-1" style={{ color: 'var(--muted)' }}>···</div>
                    {table.slice(Math.max(5, spursPos - 1), spursPos + 2).map((team, i) => (
                      <TableRow
                        key={`mid-${i}`}
                        team={team}
                        pos={Math.max(5, spursPos - 1) + i + 1}
                        isSpurs={team.strTeam === 'Tottenham Hotspur'}
                      />
                    ))}
                  </>
                )}

                {table.length > 10 && spursPos < 10 && (
                  <>
                    <div className="text-center text-xs py-1.5" style={{ color: 'var(--muted)' }}>···</div>
                    <div className="flex items-center gap-2 px-2 text-xs" style={{ color: 'var(--muted)' }}>
                      <span className="w-5 text-center" style={{ color: '#ef4444' }}>18</span>
                      <span className="flex-1">Neðsta þriðja (niðurskipað)</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 flex gap-3 text-xs flex-wrap" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} /> Champions League</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} /> Europa League</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} /> Niðurskipað</span>
              </div>
            </div>
          )}

          {!nextMatch && !lastMatch && !table && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p>Engar upplýsingar fundust</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
