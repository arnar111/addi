import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Trophy, Calendar, Clock, ChevronRight, Star, Globe, Zap } from 'lucide-react'

const PL_TEAMS = [
  'Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea',
  'Crystal Palace','Everton','Fulham','Ipswich Town','Leicester City',
  'Liverpool','Manchester City','Manchester United','Newcastle United',
  'Nottingham Forest','Southampton','Tottenham Hotspur','West Ham United','Wolverhampton'
]

const TEAM_COLORS = {
  Arsenal: '#EF0107',
  Liverpool: '#C8102E',
  'Manchester City': '#6CABDD',
  Chelsea: '#034694',
  'Tottenham Hotspur': '#132257',
  'Manchester United': '#DA291C',
  'Aston Villa': '#95BFE5',
  'Newcastle United': '#241F20',
  'Brighton': '#0057B8',
  'West Ham United': '#7A263A',
}

function Skeleton({ className }) {
  return (
    <div className={`rounded-xl animate-pulse ${className}`}
         style={{ background: 'var(--surface2)' }} />
  )
}

function formatMatchDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T${timeStr || '15:00'}:00`)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export default function Sports() {
  const [tab, setTab] = useState('standings')
  const [standings, setStandings] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [favTeam, setFavTeam] = useLocalStorage('addi_fav_team', 'Arsenal')
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  useEffect(() => {
    setError(false)
    if (tab === 'standings') fetchStandings()
    else if (tab === 'fixtures') fetchFixtures()
    else fetchResults()
  }, [tab])

  const fetchStandings = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2025-2026')
      const data = await res.json()
      setStandings(data.table || [])
    } catch {
      setError(true)
      setStandings([])
    }
    setLoading(false)
  }

  const fetchFixtures = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328')
      const data = await res.json()
      setFixtures(data.events?.slice(0, 10) || [])
    } catch {
      setError(true)
      setFixtures([])
    }
    setLoading(false)
  }

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=4328')
      const data = await res.json()
      setResults(data.events?.slice(0, 10).reverse() || [])
    } catch {
      setError(true)
      setResults([])
    }
    setLoading(false)
  }

  const todayFixtures = fixtures.filter(e => isToday(e.dateEvent))
  const hasLive = todayFixtures.length > 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={20} style={{ color: 'var(--accent3)' }} />
            <h1 className="text-2xl font-semibold">Sports</h1>
            {hasLive && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Premier League 2025-26</div>
        </div>
        <button
          onClick={() => setShowTeamPicker(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF0107', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Star size={14} fill="#EF0107" />
          {favTeam.split(' ')[0]}
        </button>
      </div>

      {/* Team Picker */}
      {showTeamPicker && (
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>Pick your team</div>
          <div className="grid grid-cols-2 gap-1.5">
            {PL_TEAMS.map(team => (
              <button key={team}
                onClick={() => { setFavTeam(team); setShowTeamPicker(false) }}
                className="text-left px-3 py-2 rounded-xl text-sm transition-all"
                style={{
                  background: favTeam === team ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: favTeam === team ? 'var(--accent)' : 'var(--text)',
                  border: favTeam === team ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
                }}>
                {team}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--surface)' }}>
        {[
          { key: 'standings', label: 'Standings', icon: Trophy },
          { key: 'fixtures', label: 'Fixtures', icon: Calendar },
          { key: 'results', label: 'Results', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === key ? 'var(--accent)' : 'transparent',
              color: tab === key ? '#000' : 'var(--muted)',
            }}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">📡</div>
          <div className="font-semibold mb-1">Could not load data</div>
          <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Check your connection and try again</div>
          <button className="btn btn-primary" onClick={() => {
            if (tab === 'standings') fetchStandings()
            else if (tab === 'fixtures') fetchFixtures()
            else fetchResults()
          }}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {tab === 'standings' && <StandingsTab standings={standings} favTeam={favTeam} />}
          {tab === 'fixtures' && <FixturesTab fixtures={fixtures} favTeam={favTeam} />}
          {tab === 'results' && <ResultsTab results={results} favTeam={favTeam} />}
        </>
      )}

      {/* WC 2026 Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))',
        border: '1px solid rgba(249,115,22,0.25)',
      }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={16} style={{ color: 'var(--accent3)' }} />
              <span className="font-semibold text-sm">FIFA World Cup 2026</span>
              <span className="badge text-xs" style={{ background: 'rgba(249,115,22,0.2)', color: 'var(--accent3)' }}>
                IN PROGRESS
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              USA · Canada · Mexico · 48 teams
            </div>
          </div>
          <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
             target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs flex items-center gap-1">
            Follow <ChevronRight size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}

function StandingsTab({ standings, favTeam }) {
  if (!standings.length) return (
    <div className="card text-center py-8">
      <div className="text-3xl mb-2">🏆</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>No standings data available</div>
    </div>
  )

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header row */}
      <div className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold"
           style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <span className="w-6 text-center">#</span>
        <span className="flex-1">Club</span>
        <span className="w-6 text-center hidden sm:block">P</span>
        <span className="w-6 text-center hidden sm:block">W</span>
        <span className="w-6 text-center hidden sm:block">D</span>
        <span className="w-6 text-center hidden sm:block">L</span>
        <span className="w-8 text-center">GD</span>
        <span className="w-7 text-center font-bold">Pts</span>
      </div>

      {standings.map((row, i) => {
        const isFav = row.strTeam?.includes(favTeam) || favTeam?.includes(row.strTeam)
        const pos = parseInt(row.intRank)
        const isChampions = pos <= 4
        const isEuropa = pos === 5
        const isConference = pos === 6
        const isRelegation = pos >= 18

        let posIndicator = null
        if (isChampions) posIndicator = '#1a47d4'
        else if (isEuropa) posIndicator = '#f97316'
        else if (isConference) posIndicator = '#22c55e'
        else if (isRelegation) posIndicator = '#ef4444'

        const gd = parseInt(row.intGoalDifference) || 0

        return (
          <div key={row.strTeam || i}
               className="flex items-center gap-2 px-4 py-2.5 transition-all"
               style={{
                 background: isFav ? 'rgba(239,68,68,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                 borderBottom: i < standings.length - 1 ? '1px solid rgba(31,45,64,0.5)' : 'none',
                 borderLeft: isFav ? '3px solid #EF0107' : posIndicator ? `3px solid ${posIndicator}` : '3px solid transparent',
               }}>
            <span className="w-6 text-center text-sm font-semibold"
                  style={{ color: isChampions ? '#1a47d4' : isRelegation ? 'var(--danger)' : 'var(--muted)' }}>
              {row.intRank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate block" style={{ color: isFav ? '#EF0107' : 'var(--text)' }}>
                {isFav && <Star size={10} className="inline mr-1 mb-0.5" fill="#EF0107" />}
                {row.strTeam}
              </span>
            </div>
            <span className="w-6 text-center text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>{row.intPlayed}</span>
            <span className="w-6 text-center text-xs hidden sm:block" style={{ color: 'var(--success)' }}>{row.intWin}</span>
            <span className="w-6 text-center text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>{row.intDraw}</span>
            <span className="w-6 text-center text-xs hidden sm:block" style={{ color: 'var(--danger)' }}>{row.intLoss}</span>
            <span className="w-8 text-center text-xs" style={{ color: gd > 0 ? 'var(--success)' : gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
              {gd > 0 ? '+' : ''}{gd}
            </span>
            <span className="w-7 text-center text-sm font-bold" style={{ color: isFav ? '#EF0107' : 'var(--text)' }}>
              {row.intPoints}
            </span>
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 py-3 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#1a47d4' }} />Champions League</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#f97316' }} />Europa League</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />Conference</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />Relegation</span>
      </div>
    </div>
  )
}

function FixturesTab({ fixtures, favTeam }) {
  if (!fixtures.length) return (
    <div className="card text-center py-8">
      <div className="text-3xl mb-2">📅</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>No upcoming fixtures</div>
    </div>
  )

  return (
    <div className="flex flex-col gap-2">
      {fixtures.map((e, i) => {
        const involvesFav = e.strHomeTeam?.includes(favTeam) || e.strAwayTeam?.includes(favTeam)
        const today = isToday(e.dateEvent)

        return (
          <div key={e.idEvent || i}
               className="card transition-all"
               style={{
                 border: involvesFav
                   ? '1px solid rgba(239,68,68,0.35)'
                   : today
                   ? '1px solid rgba(0,212,170,0.25)'
                   : '1px solid var(--border)',
                 background: involvesFav
                   ? 'rgba(239,68,68,0.06)'
                   : today
                   ? 'rgba(0,212,170,0.04)'
                   : 'var(--surface)',
               }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatMatchDate(e.dateEvent, e.strTime)}
              </span>
              <div className="flex items-center gap-2">
                {today && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
                    <Zap size={10} />TODAY
                  </span>
                )}
                {involvesFav && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#EF0107' }}>
                    <Star size={9} fill="#EF0107" /> Your team
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex-1 text-right" style={{ color: involvesFav && e.strHomeTeam?.includes(favTeam) ? '#EF0107' : 'var(--text)' }}>
                {e.strHomeTeam}
              </span>
              <div className="flex items-center gap-2 px-4">
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                  VS
                </span>
              </div>
              <span className="font-semibold text-sm flex-1" style={{ color: involvesFav && e.strAwayTeam?.includes(favTeam) ? '#EF0107' : 'var(--text)' }}>
                {e.strAwayTeam}
              </span>
            </div>
            {e.strVenue && (
              <div className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
                {e.strVenue}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ResultsTab({ results, favTeam }) {
  if (!results.length) return (
    <div className="card text-center py-8">
      <div className="text-3xl mb-2">🏆</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>No recent results</div>
    </div>
  )

  return (
    <div className="flex flex-col gap-2">
      {results.map((e, i) => {
        const involvesFav = e.strHomeTeam?.includes(favTeam) || e.strAwayTeam?.includes(favTeam)
        const homeScore = parseInt(e.intHomeScore)
        const awayScore = parseInt(e.intAwayScore)
        const homeWon = homeScore > awayScore
        const awayWon = awayScore > homeScore

        let favResult = null
        if (involvesFav) {
          const favIsHome = e.strHomeTeam?.includes(favTeam)
          if ((favIsHome && homeWon) || (!favIsHome && awayWon)) favResult = 'W'
          else if (homeScore === awayScore) favResult = 'D'
          else favResult = 'L'
        }

        const resultColors = { W: 'var(--success)', D: 'var(--muted)', L: 'var(--danger)' }

        return (
          <div key={e.idEvent || i}
               className="card"
               style={{
                 border: involvesFav ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)',
                 background: involvesFav ? 'rgba(239,68,68,0.05)' : 'var(--surface)',
               }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatMatchDate(e.dateEvent, null)}
              </span>
              {favResult && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: `${resultColors[favResult]}22`, color: resultColors[favResult] }}>
                  {favResult === 'W' ? 'WIN' : favResult === 'D' ? 'DRAW' : 'LOSS'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex-1 text-right" style={{ color: involvesFav && e.strHomeTeam?.includes(favTeam) ? '#EF0107' : homeWon ? 'var(--text)' : 'var(--muted)' }}>
                {e.strHomeTeam}
              </span>
              <div className="flex items-center gap-1.5 px-4">
                <span className="text-xl font-bold" style={{ color: homeWon ? 'var(--text)' : 'var(--muted)' }}>{e.intHomeScore}</span>
                <span style={{ color: 'var(--muted)' }}>–</span>
                <span className="text-xl font-bold" style={{ color: awayWon ? 'var(--text)' : 'var(--muted)' }}>{e.intAwayScore}</span>
              </div>
              <span className="font-semibold text-sm flex-1" style={{ color: involvesFav && e.strAwayTeam?.includes(favTeam) ? '#EF0107' : awayWon ? 'var(--text)' : 'var(--muted)' }}>
                {e.strAwayTeam}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
