import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw } from 'lucide-react'

function ScoreBadge({ home, away, completed, live, statusText }) {
  if (live) return (
    <div className="flex flex-col items-center">
      <span className="font-bold text-lg" style={{ color: 'var(--danger)' }}>
        {home ?? 0}–{away ?? 0}
      </span>
      <span className="text-xs font-semibold animate-pulse-soft" style={{ color: 'var(--danger)' }}>
        {statusText || 'LIVE'}
      </span>
    </div>
  )
  if (completed) return (
    <div className="flex flex-col items-center">
      <span className="font-bold text-lg">{home}–{away}</span>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>FT</span>
    </div>
  )
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{statusText}</span>
    </div>
  )
}

function MatchCard({ match, highlight }) {
  const date = new Date(match.date)
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const isWH_home = match.homeTeam?.toLowerCase().includes('west ham')
  const isWH_away = match.awayTeam?.toLowerCase().includes('west ham')
  const whWon = match.isCompleted && (
    (isWH_home && Number(match.homeScore) > Number(match.awayScore)) ||
    (isWH_away && Number(match.awayScore) > Number(match.homeScore))
  )
  const whLost = match.isCompleted && (
    (isWH_home && Number(match.homeScore) < Number(match.awayScore)) ||
    (isWH_away && Number(match.awayScore) < Number(match.homeScore))
  )

  return (
    <div className="card py-3"
         style={highlight && match.isLive ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}>
      <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
        {match.isCompleted ? dateStr : `${dateStr} · ${timeStr}`}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          {match.homeLogo && (
            <img src={match.homeLogo} alt="" className="w-8 h-8 object-contain"
                 onError={e => { e.target.style.display = 'none' }} />
          )}
          <span className={`text-xs font-semibold text-center leading-tight ${
            (highlight && isWH_home) ? 'text-[var(--accent)]' : ''
          }`} style={{ maxWidth: 80 }}>
            {match.homeTeam}
          </span>
          {match.isCompleted && whWon && isWH_home && (
            <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>WIN</span>
          )}
          {match.isCompleted && whLost && isWH_home && (
            <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>LOSS</span>
          )}
        </div>

        <ScoreBadge
          home={match.homeScore}
          away={match.awayScore}
          completed={match.isCompleted}
          live={match.isLive}
          statusText={match.statusText}
        />

        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          {match.awayLogo && (
            <img src={match.awayLogo} alt="" className="w-8 h-8 object-contain"
                 onError={e => { e.target.style.display = 'none' }} />
          )}
          <span className={`text-xs font-semibold text-center leading-tight ${
            (highlight && isWH_away) ? 'text-[var(--accent)]' : ''
          }`} style={{ maxWidth: 80 }}>
            {match.awayTeam}
          </span>
          {match.isCompleted && whWon && isWH_away && (
            <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>WIN</span>
          )}
          {match.isCompleted && whLost && isWH_away && (
            <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>LOSS</span>
          )}
        </div>
      </div>
    </div>
  )
}

function TennisCard({ match }) {
  const p1Won = match.isCompleted && match.score1 > match.score2
  return (
    <div className="card py-3">
      <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
        {match.tournament || 'ATP'}
        {match.isLive && <span className="ml-2 font-bold" style={{ color: 'var(--danger)' }}>● LIVE</span>}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate ${p1Won ? '' : ''}`}
               style={{ color: match.player1?.toLowerCase().includes('sinner') ? 'var(--accent)' : 'var(--text)' }}>
            {match.player1}
          </div>
          <div className={`text-sm font-semibold truncate mt-0.5`}
               style={{ color: match.player2?.toLowerCase().includes('sinner') ? 'var(--accent)' : 'var(--text)' }}>
            {match.player2}
          </div>
        </div>
        {(match.isCompleted || match.isLive) && (
          <div className="flex flex-col items-end gap-0.5 text-sm font-bold shrink-0">
            <span>{match.score1}</span>
            <span>{match.score2}</span>
          </div>
        )}
        {!match.isCompleted && !match.isLive && (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'westham', label: '⚒️ West Ham' },
  { id: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' },
  { id: 'iceland', label: '🇮🇸 Ísland' },
  { id: 'tennis', label: '🎾 Tennis' },
]

export default function Sports() {
  const { westHam, eplLive, iceland, tennis, loading } = useSports()
  const [tab, setTab] = useState('westham')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            West Ham · EPL · Ísland · Tennis
          </p>
        </div>
        {loading && <RefreshCw size={16} className="animate-spin" style={{ color: 'var(--muted)' }} />}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn text-xs shrink-0"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
              padding: '6px 12px',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'westham' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse-soft h-24" style={{ background: 'var(--surface2)' }} />
            ))
          ) : westHam.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="text-2xl mb-2">⚒️</p>
              <p>Engar leikjaupplýsingar fundust</p>
              <p className="text-xs mt-1">Reyndu aftur síðar</p>
            </div>
          ) : (
            westHam.map(m => <MatchCard key={m.id} match={m} highlight={true} />)
          )}
        </div>
      )}

      {tab === 'epl' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse-soft h-24" style={{ background: 'var(--surface2)' }} />
            ))
          ) : eplLive.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="text-2xl mb-2">🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
              <p>Engar leikjaniðurstöður í dag</p>
            </div>
          ) : (
            eplLive.map(m => <MatchCard key={m.id} match={m} highlight={false} />)
          )}
        </div>
      )}

      {tab === 'iceland' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse-soft h-24" style={{ background: 'var(--surface2)' }} />
            ))
          ) : iceland.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="text-2xl mb-2">🇮🇸</p>
              <p>Engin Úrvalsdeild leikir í dag</p>
            </div>
          ) : (
            iceland.map(m => <MatchCard key={m.id} match={m} highlight={false} />)
          )}
        </div>
      )}

      {tab === 'tennis' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse-soft h-16" style={{ background: 'var(--surface2)' }} />
            ))
          ) : tennis.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="text-2xl mb-2">🎾</p>
              <p>Engar tennisleikir í dag</p>
            </div>
          ) : (
            tennis.map(m => <TennisCard key={m.id} match={m} />)
          )}
        </div>
      )}
    </div>
  )
}
