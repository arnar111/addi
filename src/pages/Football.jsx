import { useFootball } from '../hooks/useFootball'
import { RefreshCw, Zap, Calendar, Trophy } from 'lucide-react'
import { useState } from 'react'

const ARSENAL_NAMES = ['Arsenal', 'ARS']
const isArsenal = (name) => ARSENAL_NAMES.some(a => name?.toLowerCase().includes(a.toLowerCase()))

function MatchCard({ match }) {
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const arsenalHome = isArsenal(match.homeTeam)
  const arsenalAway = isArsenal(match.awayTeam)
  const arsenalInvolved = arsenalHome || arsenalAway

  let borderColor = 'var(--border)'
  let headerBg = 'var(--surface2)'
  let resultLabel = null

  if (match.isFinished && arsenalInvolved) {
    const arsenalGoals = arsenalHome ? Number(match.homeScore) : Number(match.awayScore)
    const oppGoals = arsenalHome ? Number(match.awayScore) : Number(match.homeScore)
    if (arsenalGoals > oppGoals) {
      borderColor = 'rgba(34,197,94,0.4)'
      headerBg = 'rgba(34,197,94,0.08)'
      resultLabel = { text: 'W', class: 'result-w' }
    } else if (arsenalGoals < oppGoals) {
      borderColor = 'rgba(239,68,68,0.4)'
      headerBg = 'rgba(239,68,68,0.08)'
      resultLabel = { text: 'L', class: 'result-l' }
    } else {
      borderColor = 'rgba(100,116,139,0.4)'
      headerBg = 'rgba(100,116,139,0.08)'
      resultLabel = { text: 'D', class: 'result-d' }
    }
  } else if (arsenalInvolved && !match.isFinished) {
    borderColor = 'rgba(239,68,68,0.35)'
    headerBg = 'rgba(239,68,68,0.06)'
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderColor }}>
      {/* Match date/time bar */}
      <div className="flex items-center justify-between px-4 py-2"
           style={{ background: headerBg, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          <Calendar size={11} />
          {new Date(match.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center gap-2">
          {arsenalInvolved && (
            <span className="text-xs font-bold" style={{ color: '#ef4444' }}>🔴 Arsenal</span>
          )}
          {resultLabel && (
            <span className={`badge text-xs font-bold ${resultLabel.class}`}>{resultLabel.text}</span>
          )}
          {match.isLive && (
            <span className="badge text-xs animate-pulse-soft" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
              <Zap size={9} className="mr-0.5" />LIVE {match.clock}
            </span>
          )}
          {match.isFinished && !match.isLive && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>FT</span>
          )}
          {!match.isLive && !match.isFinished && (
            <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center px-4 py-4 gap-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          {match.homeLogo && (
            <img src={match.homeLogo} alt="" className="w-10 h-10 object-contain" />
          )}
          <span className="text-sm font-semibold text-center leading-tight"
                style={{ color: arsenalHome ? '#ef4444' : 'var(--text)' }}>
            {match.homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center shrink-0 mx-2">
          {hasScore ? (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{match.homeScore}</span>
              <span className="text-lg" style={{ color: 'var(--muted)' }}>:</span>
              <span className="text-3xl font-bold">{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-sm font-bold" style={{ color: 'var(--muted)' }}>vs</div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          {match.awayLogo && (
            <img src={match.awayLogo} alt="" className="w-10 h-10 object-contain" />
          )}
          <span className="text-sm font-semibold text-center leading-tight"
                style={{ color: arsenalAway ? '#ef4444' : 'var(--text)' }}>
            {match.awayTeam}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Football() {
  const { matches, liveMatches, finishedMatches, upcomingMatches, loading, error, lastUpdated, refetch } = useFootball()
  const [tab, setTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'Allir', count: matches.length },
    { id: 'live', label: '🔴 LIVE', count: liveMatches.length },
    { id: 'finished', label: 'Liðnir', count: finishedMatches.length },
    { id: 'upcoming', label: 'Væntanlegir', count: upcomingMatches.length },
  ]

  const displayed = tab === 'all' ? matches
    : tab === 'live' ? liveMatches
    : tab === 'finished' ? finishedMatches
    : upcomingMatches

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            ⚽ Premier League
          </h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            2025/26 · Arsenal 🔴
          </div>
        </div>
        <button onClick={refetch}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          <RefreshCw size={13} /> Uppfæra
        </button>
      </div>

      {/* Live alert */}
      {liveMatches.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl animate-slide-up"
             style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#ef4444' }} />
          <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>
            {liveMatches.length} leikur(ir) í gangi núna!
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {t.label}
            {t.count > 0 && (
              <span className="badge text-xs" style={{
                background: tab === t.id ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                color: tab === t.id ? 'var(--accent)' : 'var(--muted)'
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card shimmer h-24" />
          ))}
        </div>
      ) : error ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <Trophy size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Gat ekki sótt leiki 😕</p>
          <p className="text-xs mt-1">{error}</p>
          <button onClick={refetch} className="btn btn-ghost mt-3 mx-auto text-sm">Reyna aftur</button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <Trophy size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Engir leikir í þessum flokki</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      {lastUpdated && (
        <div className="text-center text-xs" style={{ color: 'var(--muted)', fontSize: 11 }}>
          Síðast uppfært: {lastUpdated.toLocaleTimeString('is-IS')}
        </div>
      )}
    </div>
  )
}
