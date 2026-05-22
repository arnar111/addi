import { useState } from 'react'
import { useFootball } from '../hooks/useFootball'
import { Trophy, Star, Clock, Calendar, Table2, AlertCircle } from 'lucide-react'

const TABS = [
  { id: 'wc', label: 'Heimsmót 2026', icon: '🏆' },
  { id: 'table', label: 'Deild', icon: '📊' },
  { id: 'recent', label: 'Nýlegar', icon: '⚽' },
]

function Countdown({ days }) {
  const hours = Math.floor((new Date('2026-06-11T20:00:00Z') - new Date()) / 3600000) % 24
  return (
    <div className="card text-center py-6"
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,170,0.25)' }}>
      <div className="text-3xl mb-2">🏆</div>
      <div className="text-sm font-semibold mb-1">FIFA World Cup 2026</div>
      <div className="text-xs mb-4" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico · 11. júní – 19. júlí</div>
      <div className="flex items-end justify-center gap-3">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>{days}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</div>
        </div>
        <div className="text-2xl font-light mb-2" style={{ color: 'var(--muted)' }}>:</div>
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold" style={{ color: 'var(--accent2)' }}>{hours}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Klukkustundir</div>
        </div>
      </div>
      <div className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
        England í hóp B · Tuchel leiðir liðið
      </div>
    </div>
  )
}

function MatchCard({ match }) {
  const date = new Date(match.utcDate)
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const isScheduled = match.status === 'TIMED' || match.status === 'SCHEDULED'

  return (
    <div className="card py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {match.competition?.name}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--danger)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--danger)' }} />
            LIVE
          </span>
        )}
        {isFinished && <span className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</span>}
        {isScheduled && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xl">{match.homeTeam?.crest || '⚽'}</span>
          <span className="text-sm font-medium">{match.homeTeam?.shortName || match.homeTeam?.name}</span>
        </div>
        <div className="px-4 py-1.5 rounded-xl text-sm font-bold min-w-16 text-center"
             style={{ background: 'var(--surface2)', color: isLive ? 'var(--danger)' : 'var(--text)' }}>
          {isScheduled ? 'vs' : `${match.score?.fullTime?.home ?? '-'} – ${match.score?.fullTime?.away ?? '-'}`}
        </div>
        <div className="flex-1 flex items-center gap-2 justify-end">
          <span className="text-sm font-medium text-right">{match.awayTeam?.shortName || match.awayTeam?.name}</span>
          <span className="text-xl">{match.awayTeam?.crest || '⚽'}</span>
        </div>
      </div>
    </div>
  )
}

function TableView({ table }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="text-sm font-semibold">Premier League 2024/25</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 340 }}>
          <thead>
            <tr style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="text-left pl-4 py-2 font-medium">#</th>
              <th className="text-left py-2 font-medium">Lið</th>
              <th className="py-2 font-medium">L</th>
              <th className="py-2 font-medium">S</th>
              <th className="py-2 font-medium">GD</th>
              <th className="py-2 font-medium pr-4" style={{ color: 'var(--accent)' }}>Stig</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const isLiverpool = row.team?.name?.includes('Liverpool')
              return (
                <tr key={row.position || i}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: isLiverpool ? 'rgba(220,38,38,0.06)' : 'transparent',
                    }}>
                  <td className="pl-4 py-2.5 font-semibold" style={{ color: i < 4 ? 'var(--accent)' : 'var(--muted)' }}>
                    {row.position}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span>{row.team?.crest || '⚽'}</span>
                      <span className={isLiverpool ? 'font-semibold' : ''}>{row.team?.name}</span>
                      {isLiverpool && <span className="text-xs" style={{ color: '#ef4444' }}>🏆</span>}
                    </div>
                  </td>
                  <td className="py-2.5 text-center" style={{ color: 'var(--muted)' }}>{row.playedGames}</td>
                  <td className="py-2.5 text-center" style={{ color: 'var(--muted)' }}>{row.won}</td>
                  <td className="py-2.5 text-center" style={{ color: row.goalDifference > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                  </td>
                  <td className="py-2.5 text-center pr-4 font-bold"
                      style={{ color: isLiverpool ? '#ef4444' : 'var(--text)' }}>
                    {row.points}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 flex items-center gap-3 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: 'var(--accent)' }} /> Meistadeildin</span>
      </div>
    </div>
  )
}

function InterSpotlight() {
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(30,64,175,0.15))', border: '1px solid rgba(30,64,175,0.3)' }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">⚫🔵</span>
        <div>
          <div className="font-semibold text-sm">FC Internazionale</div>
          <div className="text-xs" style={{ color: 'var(--accent)' }}>Serie A + Coppa Italia Meistarar 🏆🏆</div>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
        Inter Milano vann tvíbura titilinn í leiktíðinni 2025/26 — bæði Serie A og Coppa Italia. Nerazzurri!
      </p>
    </div>
  )
}

export default function Football() {
  const { matches, table, recent, loading, demoMode, daysToWC } = useFootball()
  const [tab, setTab] = useState('wc')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Knattspyrna ⚽</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Heimsmót 2026 · Premier League · Serie A</p>
      </div>

      {demoMode && (
        <div className="card flex items-start gap-3 py-3"
             style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <AlertCircle size={15} style={{ color: 'var(--accent2)', shrink: 0, marginTop: 1 }} />
          <div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--accent2)' }}>Sýnigögn · Stilltu API-lykil</div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Sóttu ókeypis lykil á <strong>football-data.org</strong> og bættu honum við í Stillingum til að fá rauntímagögn.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn shrink-0 text-xs py-2 px-3"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'wc' && (
        <div className="flex flex-col gap-3">
          <Countdown days={daysToWC} />
          <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>FYRSTU LEIKIR</div>
          {matches.filter(m => m.status === 'TIMED' || m.status === 'SCHEDULED').slice(0, 6).map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
          <InterSpotlight />
        </div>
      )}

      {tab === 'table' && (
        <div className="flex flex-col gap-3">
          <TableView table={table} />
        </div>
      )}

      {tab === 'recent' && (
        <div className="flex flex-col gap-3">
          {recent.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar nýlegar leikir</div>
          ) : recent.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}
