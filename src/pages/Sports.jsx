import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { Trophy, RefreshCw, Calendar, Clock } from 'lucide-react'

function TeamBadge({ team }) {
  return (
    <span className="font-bold text-xs px-2 py-0.5 rounded-lg"
          style={{ background: team.color + '22', color: team.color, border: `1px solid ${team.color}44` }}>
      {team.short}
    </span>
  )
}

function FixtureCard({ event, team }) {
  const date = new Date(event.dateEvent)
  const isHome = event.strHomeTeam === team.name
  const opp = isHome ? event.strAwayTeam : event.strHomeTeam
  const hasScore = event.intHomeScore !== null && event.intHomeScore !== '' && event.intHomeScore !== undefined

  const dayStr = date.toLocaleDateString('is-IS', { weekday: 'long', month: 'short', day: 'numeric' })
  const timeStr = event.strTime ? event.strTime.slice(0, 5) : ''

  let resultColor = 'var(--muted)'
  let resultLabel = ''
  if (hasScore) {
    const myScore = isHome ? Number(event.intHomeScore) : Number(event.intAwayScore)
    const oppScore = isHome ? Number(event.intAwayScore) : Number(event.intHomeScore)
    if (myScore > oppScore) { resultColor = 'var(--success)'; resultLabel = 'W' }
    else if (myScore < oppScore) { resultColor = 'var(--danger)'; resultLabel = 'L' }
    else { resultColor = '#f97316'; resultLabel = 'D' }
  }

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <TeamBadge team={team} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{event.strLeague}</span>
        {resultLabel && (
          <span className="font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: resultColor + '22', color: resultColor }}>{resultLabel}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-sm font-semibold text-right truncate">
          {event.strHomeTeam}
        </div>
        <div className="text-center shrink-0">
          {hasScore ? (
            <span className="font-bold text-lg tabular-nums">
              {event.intHomeScore}–{event.intAwayScore}
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>vs</span>
          )}
        </div>
        <div className="flex-1 text-sm font-semibold text-left truncate">
          {event.strAwayTeam}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <Calendar size={11} />
          {dayStr}
        </div>
        {timeStr && (
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
            <Clock size={11} />
            {timeStr}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sports() {
  const { fixtures, results, teams, loading, error } = useSports()
  const [tab, setTab] = useState('fixtures')
  const [teamFilter, setTeamFilter] = useState('all')

  const teamKeys = Object.keys(teams)
  const filteredTeams = teamFilter === 'all' ? teamKeys : [teamFilter]

  const allFixtures = filteredTeams.flatMap(key =>
    (fixtures[key] || []).map(ev => ({ ev, team: teams[key], key }))
  ).sort((a, b) => new Date(a.ev.dateEvent) - new Date(b.ev.dateEvent))

  const allResults = filteredTeams.flatMap(key =>
    (results[key] || []).map(ev => ({ ev, team: teams[key], key }))
  ).sort((a, b) => new Date(b.ev.dateEvent) - new Date(a.ev.dateEvent))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="flex items-center gap-2 mb-0.5">
          <Trophy size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-xl font-semibold">Íþróttir</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Leikir og niðurstöður</p>
      </div>

      {/* Team filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', '🌍 Allt'], ...Object.entries(teams).map(([k, t]) => [k, t.name])].map(([k, label]) => (
          <button key={k} onClick={() => setTeamFilter(k)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: teamFilter === k ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: teamFilter === k ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${teamFilter === k ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{label}</button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['fixtures', 'Næstu leikir'], ['results', 'Niðurstöður']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {loading && (
        <div className="card flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      )}

      {error && (
        <div className="card text-center py-6" style={{ color: 'var(--danger)' }}>
          Tókst ekki að sækja leiki. Reyndu aftur síðar.
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {tab === 'fixtures' && (
            allFixtures.length === 0
              ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engir leikir fundust</div>
              : allFixtures.map(({ ev, team }) => (
                  <FixtureCard key={ev.idEvent + team.short} event={ev} team={team} />
                ))
          )}
          {tab === 'results' && (
            allResults.length === 0
              ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar niðurstöður</div>
              : allResults.map(({ ev, team }) => (
                  <FixtureCard key={ev.idEvent + team.short} event={ev} team={team} />
                ))
          )}
        </div>
      )}
    </div>
  )
}
