import { useState, useEffect } from 'react'
import { useSport, useStandings } from '../hooks/useSport'
import { Trophy, RefreshCw, Tv, Star, StarOff, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_FINAL = new Date('2026-07-19T00:00:00')

function getCountdown() {
  const now = new Date()
  const diff = WC_START - now
  if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0, secs: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  return { started: false, days, hours, minutes, secs }
}

function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl"
         style={{ background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.15)' }}>
      <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

function MatchCard({ event }) {
  const isLive = event.status === 'STATUS_IN_PROGRESS'
  const isDone = event.status === 'STATUS_FINAL'
  const isUpcoming = !isLive && !isDone

  const dateStr = isUpcoming
    ? new Date(event.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="flex items-center gap-2 py-3 px-1"
         style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Home */}
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <span className="text-sm font-medium text-right truncate">{event.home.name}</span>
        {event.home.logo && (
          <img src={event.home.logo} alt="" className="w-5 h-5 object-contain" />
        )}
      </div>

      {/* Score / Time */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 min-w-[64px]">
        {(isLive || isDone) ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tabular-nums">{event.home.score ?? '-'}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>–</span>
            <span className="text-base font-bold tabular-nums">{event.away.score ?? '-'}</span>
          </div>
        ) : (
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            {new Date(event.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        {isLive && (
          <span className="badge text-xs animate-pulse-soft"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '1px 6px' }}>
            LIVE {event.clock && `${event.clock}'`}
          </span>
        )}
        {isDone && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</span>
        )}
        {isUpcoming && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(event.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 flex-1 justify-start">
        {event.away.logo && (
          <img src={event.away.logo} alt="" className="w-5 h-5 object-contain" />
        )}
        <span className="text-sm font-medium truncate">{event.away.name}</span>
      </div>
    </div>
  )
}

function StandingsTable({ league }) {
  const { standings, loading } = useStandings(league)
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? standings : standings.slice(0, 6)

  if (loading) return (
    <div className="text-center py-6 animate-pulse-soft text-sm" style={{ color: 'var(--muted)' }}>
      Hleður töflu...
    </div>
  )
  if (!standings.length) return (
    <div className="text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>Engar upplýsingar</div>
  )

  return (
    <div className="flex flex-col">
      <div className="grid text-xs font-medium py-2 px-1"
           style={{ color: 'var(--muted)', gridTemplateColumns: '24px 1fr 24px 24px 24px 24px 32px' }}>
        <span>#</span>
        <span>Lið</span>
        <span className="text-center">L</span>
        <span className="text-center">J</span>
        <span className="text-center">T</span>
        <span className="text-center">GD</span>
        <span className="text-center font-bold">Stig</span>
      </div>
      {shown.map((row, i) => (
        <div key={i} className="grid items-center py-2 px-1 rounded-xl"
             style={{
               gridTemplateColumns: '24px 1fr 24px 24px 24px 24px 32px',
               background: i === 0 ? 'rgba(0,212,170,0.05)' : 'transparent',
             }}>
          <span className="text-xs font-medium" style={{ color: i < 4 ? 'var(--accent)' : i < 6 ? '#f97316' : 'var(--muted)' }}>
            {row.rank || i + 1}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            {row.logo && <img src={row.logo} alt="" className="w-4 h-4 object-contain shrink-0" />}
            <span className="text-sm truncate">{row.team}</span>
          </div>
          <span className="text-xs text-center tabular-nums">{row.w ?? '-'}</span>
          <span className="text-xs text-center tabular-nums">{row.d ?? '-'}</span>
          <span className="text-xs text-center tabular-nums">{row.l ?? '-'}</span>
          <span className="text-xs text-center tabular-nums" style={{ color: (row.gd || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {(row.gd || 0) > 0 ? '+' : ''}{row.gd ?? '-'}
          </span>
          <span className="text-sm text-center font-bold">{row.pts ?? '-'}</span>
        </div>
      ))}
      {standings.length > 6 && (
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 py-2 text-xs mt-1"
          style={{ color: 'var(--accent)' }}>
          {expanded ? <><ChevronUp size={12} /> Sýna minna</> : <><ChevronDown size={12} /> Sýna allt ({standings.length} lið)</>}
        </button>
      )}
    </div>
  )
}

const TABS = ['Heimsmeistaramót', 'Premier League', 'Champions League']
const LEAGUES = ['FIFA.WORLD', 'eng.1', 'uefa.champions']
const LEAGUE_LABELS = ['FIFA World Cup 2026', 'Premier League', 'Champions League']

export default function Sport() {
  const [tab, setTab] = useState(0)
  const [cd, setCd] = useState(getCountdown)
  const [favTeams, setFavTeams] = useLocalStorage('addi_fav_teams', ['England', 'Liverpool'])
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [newTeam, setNewTeam] = useState('')

  const { events, loading, refetch, lastFetch } = useSport(LEAGUES[tab])

  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown()), 1000)
    return () => clearInterval(t)
  }, [])

  const toggleFav = (name) => {
    setFavTeams(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  const addTeam = (e) => {
    e.preventDefault()
    if (!newTeam.trim()) return
    setFavTeams(prev => [...prev, newTeam.trim()])
    setNewTeam('')
    setShowAddTeam(false)
  }

  const liveEvents = events.filter(e => e.status === 'STATUS_IN_PROGRESS')
  const upcomingEvents = events.filter(e => e.status === 'STATUS_SCHEDULED' || e.status === 'STATUS_PRE_GAME')
  const doneEvents = events.filter(e => e.status === 'STATUS_FINAL')

  const relevantEvents = events.filter(e =>
    favTeams.some(t =>
      e.home.name?.toLowerCase().includes(t.toLowerCase()) ||
      e.away.name?.toLowerCase().includes(t.toLowerCase())
    )
  )

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {liveEvents.length > 0 ? `${liveEvents.length} leikur í gangi 🔴` : 'Fótbolti & fleira'}
          </p>
        </div>
        <button onClick={refetch} className="btn btn-ghost" style={{ padding: '8px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* World Cup countdown - always visible */}
      {!cd.started && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1), rgba(249,115,22,0.06))', border: '1px solid rgba(0,212,170,0.3)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} style={{ color: '#f97316' }} />
            <span className="font-semibold text-sm">FIFA World Cup 2026</span>
            <div className="flex gap-0.5 ml-auto">
              <span className="text-lg">🇺🇸</span>
              <span className="text-lg">🇨🇦</span>
              <span className="text-lg">🇲🇽</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <CountdownBlock value={cd.days} label="dagar" />
            <CountdownBlock value={cd.hours} label="klst" />
            <CountdownBlock value={cd.minutes} label="mín" />
            <CountdownBlock value={cd.secs} label="sek" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Upphaf', '11. júní 2026 · Mexíkó'],
              ['Úrslitaleikur', '19. júlí · New Jersey'],
              ['Lið', '48 lið'],
              ['Leikir', '104 leikir'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Teams */}
      {favTeams.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              <Star size={13} style={{ color: '#f97316' }} /> Mín lið
            </h3>
            <button onClick={() => setShowAddTeam(!showAddTeam)}
                    className="text-xs" style={{ color: 'var(--accent)' }}>
              + Bæta við
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {favTeams.map(t => (
              <div key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm"
                   style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <span>{t}</span>
                <button onClick={() => toggleFav(t)} style={{ color: 'var(--muted)', lineHeight: 0 }}>
                  <StarOff size={11} />
                </button>
              </div>
            ))}
          </div>
          {showAddTeam && (
            <form onSubmit={addTeam} className="flex gap-2">
              <input className="input text-sm flex-1" placeholder="Lið nafn..." autoFocus
                     value={newTeam} onChange={e => setNewTeam(e.target.value)} />
              <button type="submit" className="btn btn-primary text-sm px-3">+</button>
            </form>
          )}
          {relevantEvents.length > 0 && (
            <div className="mt-2 flex flex-col">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Leikir míns liðs</div>
              {relevantEvents.slice(0, 3).map(e => <MatchCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      )}

      {/* League tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === i ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === i ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === i ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{t}</button>
        ))}
      </div>

      {/* Live matches */}
      {liveEvents.length > 0 && tab !== 0 && (
        <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--danger)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>LIVE</span>
          </div>
          {liveEvents.map(e => <MatchCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Matches */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">{LEAGUE_LABELS[tab]}</h3>
          {lastFetch && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {lastFetch.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 animate-pulse-soft text-sm" style={{ color: 'var(--muted)' }}>
            Hleður leikjum...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">⚽</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              {tab === 0 ? 'Leikir byrja 11. júní 2026' : 'Engir leikir í dag'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {upcomingEvents.length > 0 && (
              <>
                <div className="text-xs font-medium mb-1 mt-1" style={{ color: 'var(--muted)' }}>Væntanlegir leikir</div>
                {upcomingEvents.slice(0, 6).map(e => <MatchCard key={e.id} event={e} />)}
              </>
            )}
            {doneEvents.length > 0 && (
              <>
                <div className="text-xs font-medium mb-1 mt-3" style={{ color: 'var(--muted)' }}>Nýlegar niðurstöður</div>
                {doneEvents.slice(0, 6).map(e => <MatchCard key={e.id} event={e} />)}
              </>
            )}
          </div>
        )}
      </div>

      {/* Standings - only for league tabs */}
      {tab !== 0 && (
        <div className="card">
          <h3 className="font-semibold text-sm mb-3">Stigatafla</h3>
          <StandingsTable league={LEAGUES[tab]} />
        </div>
      )}
    </div>
  )
}
