import { useState } from 'react'
import { useFootball, FOOTBALL_LEAGUES } from '../hooks/useFootball'
import { Trophy, RefreshCw, ExternalLink, Radio } from 'lucide-react'

const MY_TEAMS = ['Liverpool', 'LFC', 'Man City', 'Manchester City']
const LEAGUES = [
  { id: 'eng.1', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'PL' },
  { id: 'uefa.champions', flag: '⭐', short: 'UCL' },
]
const QUICK_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { label: 'BBC Sport', url: 'https://bbc.com/sport/football', icon: '⚽' },
  { label: 'Premier League', url: 'https://premierleague.com', icon: '🏆' },
  { label: 'Liverpool FC', url: 'https://liverpoolfc.com', icon: '🔴' },
]

function isMyTeam(name) {
  return MY_TEAMS.some(t => name?.includes(t))
}

function StatusBadge({ status }) {
  if (status.state === 'in') {
    return (
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
          {status.clock ? `${status.clock}'` : 'Í gangi'}
        </span>
      </div>
    )
  }
  if (status.state === 'post') {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
        {status.detail || 'Lokið'}
      </span>
    )
  }
  return (
    <span className="text-xs" style={{ color: 'var(--muted)' }}>
      {new Date(status.clock || 0).toLocaleTimeString?.('is-IS', { hour: '2-digit', minute: '2-digit' }) || 'Fyrirhugt'}
    </span>
  )
}

function MatchCard({ match }) {
  const live = match.status.state === 'in'
  const done = match.status.state === 'post'
  const homeIsMe = isMyTeam(match.home.name)
  const awayIsMe = isMyTeam(match.away.name)
  const myTeam = homeIsMe || awayIsMe

  return (
    <div className="card" style={{
      border: myTeam ? '1px solid rgba(0,212,170,0.25)' : '1px solid var(--border)',
      background: myTeam ? 'linear-gradient(135deg, rgba(0,212,170,0.04), var(--surface))' : 'var(--surface)',
      padding: '14px 16px',
    }}>
      {myTeam && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            ⭐ Lið þitt
          </span>
        </div>
      )}
      <div className="grid items-center gap-3" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        <div className="flex flex-col items-start gap-1">
          {match.home.logo && (
            <img src={match.home.logo} alt="" className="w-8 h-8 object-contain" />
          )}
          <span className="text-sm font-semibold leading-tight"
                style={{ color: homeIsMe ? 'var(--accent)' : 'var(--text)' }}>
            {match.home.name}
          </span>
          {done && match.home.winner && (
            <span className="text-xs" style={{ color: 'var(--success)' }}>Sigurvegari</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
          {done || live ? (
            <div className="text-2xl font-bold font-mono tabular-nums"
                 style={{ color: live ? 'var(--success)' : 'var(--text)' }}>
              {match.home.score} <span style={{ color: 'var(--muted)', fontSize: 16 }}>–</span> {match.away.score}
            </div>
          ) : (
            <div className="text-xl font-semibold" style={{ color: 'var(--muted)' }}>vs</div>
          )}
          <StatusBadge status={match.status} />
          {!live && !done && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          {match.away.logo && (
            <img src={match.away.logo} alt="" className="w-8 h-8 object-contain" />
          )}
          <span className="text-sm font-semibold leading-tight text-right"
                style={{ color: awayIsMe ? 'var(--accent)' : 'var(--text)' }}>
            {match.away.name}
          </span>
          {done && match.away.winner && (
            <span className="text-xs" style={{ color: 'var(--success)' }}>Sigurvegari</span>
          )}
        </div>
      </div>
      {match.venue && (
        <div className="mt-2 text-xs text-right" style={{ color: 'var(--muted)' }}>{match.venue}</div>
      )}
    </div>
  )
}

function LeagueView({ leagueId }) {
  const { data, loading, error, refetch } = useFootball(leagueId)

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card animate-pulse-soft" style={{ height: 96 }} />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="card text-center py-8">
        <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>Gat ekki sótt leiki</p>
        <button onClick={refetch} className="btn btn-ghost text-sm">
          <RefreshCw size={14} /> Reyna aftur
        </button>
      </div>
    )
  }

  const live = data.events.filter(e => e.status.state === 'in')
  const upcoming = data.events.filter(e => e.status.state === 'pre')
  const finished = data.events.filter(e => e.status.state === 'post')

  if (!data.events.length) {
    return (
      <div className="card text-center py-10">
        <Trophy size={28} className="mx-auto mb-2" style={{ color: 'var(--muted)' }} />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Engir leikir á dagskrá</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {live.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Radio size={13} style={{ color: 'var(--success)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Í GANGI</span>
          </div>
          <div className="flex flex-col gap-2">
            {live.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <div className="px-1 mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>FYRIRHUGT</span>
          </div>
          <div className="flex flex-col gap-2">
            {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}

      {finished.length > 0 && (
        <div>
          <div className="px-1 mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>NIÐURSTÖÐUR</span>
          </div>
          <div className="flex flex-col gap-2">
            {finished.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const [leagueId, setLeagueId] = useState('eng.1')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Fótbolti · Leikir í dag</p>
        </div>
        <div className="flex items-center gap-1.5">
          {LEAGUES.map(l => (
            <button key={l.id} onClick={() => setLeagueId(l.id)}
              className="btn text-xs py-1.5 px-3"
              style={{
                background: leagueId === l.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
                color: leagueId === l.id ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${leagueId === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
              }}>
              {l.flag} {l.short}
            </button>
          ))}
        </div>
      </div>

      <LeagueView leagueId={leagueId} />

      {/* Quick links */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>FLÝTILEIÐIR</div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
               className="card flex items-center gap-2 py-3 no-underline"
               style={{ textDecoration: 'none' }}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{link.label}</span>
              <ExternalLink size={11} className="ml-auto shrink-0" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
