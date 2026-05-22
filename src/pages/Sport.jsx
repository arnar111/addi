import { useFootball } from '../hooks/useFootball'
import { RefreshCw, ExternalLink, Clock, Trophy, Zap } from 'lucide-react'

function MatchCard({ match, highlight }) {
  const isLive = match.status === 'STATUS_IN_PROGRESS'
  const isFinal = match.status === 'STATUS_FINAL'
  const isScheduled = match.status === 'STATUS_SCHEDULED'
  const time = isScheduled
    ? new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="p-3 rounded-xl transition-all"
         style={{
           background: highlight ? 'rgba(0,212,170,0.07)' : 'var(--surface2)',
           border: `1px solid ${highlight ? 'rgba(0,212,170,0.2)' : 'transparent'}`,
         }}>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="text-sm font-medium text-right leading-tight"
                style={{ color: match.home.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {match.home.name}
          </span>
        </div>

        <div className="flex flex-col items-center shrink-0" style={{ minWidth: 68 }}>
          {isScheduled ? (
            <span className="text-sm font-mono font-medium" style={{ color: 'var(--muted)' }}>{time}</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tabular-nums"
                    style={{ color: match.home.winner ? 'var(--accent)' : 'var(--text)' }}>
                {match.home.score}
              </span>
              <span style={{ color: 'var(--muted)' }}>–</span>
              <span className="text-xl font-bold tabular-nums"
                    style={{ color: match.away.winner ? 'var(--accent)' : 'var(--text)' }}>
                {match.away.score}
              </span>
            </div>
          )}
          {isLive && (
            <span className="text-xs font-bold mt-0.5 animate-pulse-soft" style={{ color: '#ef4444' }}>
              LIVE{match.displayClock ? ` ${match.displayClock}'` : ''}
            </span>
          )}
          {isFinal && (
            <span className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Lokið</span>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium leading-tight"
                style={{ color: match.away.winner ? 'var(--text)' : isFinal ? 'var(--muted)' : 'var(--text)' }}>
            {match.away.name}
          </span>
        </div>
      </div>
    </div>
  )
}

function isLiverpoolMatch(m) {
  return m.home.name.toLowerCase().includes('liverpool') ||
         m.away.name.toLowerCase().includes('liverpool')
}

export default function Sport() {
  const { todayMatches, liveMatches, finishedMatches, scheduledMatches, loading, error, updatedAt, refresh } = useFootball()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Sport ⚽</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost p-2">
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className="card animate-pulse-soft flex items-center justify-center py-10" style={{ color: 'var(--muted)' }}>
          Hleð leikjum...
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center gap-3 py-8">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Gat ekki sótt leikjakynningar</p>
          <button onClick={refresh} className="btn btn-ghost text-xs">Reyna aftur</button>
        </div>
      ) : (
        <>
          {liveMatches.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#ef4444' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#ef4444' }}>LIVE leikir</h3>
              </div>
              <div className="flex flex-col gap-2">
                {liveMatches.map(m => (
                  <MatchCard key={m.id} match={m} highlight={isLiverpoolMatch(m)} />
                ))}
              </div>
            </div>
          )}

          {scheduledMatches.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm">Í dag</h3>
              </div>
              <div className="flex flex-col gap-2">
                {scheduledMatches.map(m => (
                  <MatchCard key={m.id} match={m} highlight={isLiverpoolMatch(m)} />
                ))}
              </div>
            </div>
          )}

          {finishedMatches.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm">Niðurstöður</h3>
              </div>
              <div className="flex flex-col gap-2">
                {finishedMatches.map(m => (
                  <MatchCard key={m.id} match={m} highlight={isLiverpoolMatch(m)} />
                ))}
              </div>
            </div>
          )}

          {todayMatches.length === 0 && (
            <div className="card flex flex-col items-center gap-3 py-10" style={{ color: 'var(--muted)' }}>
              <span className="text-4xl">⚽</span>
              <p className="text-sm">Engir leikir á dagskrá í dag</p>
              <p className="text-xs text-center" style={{ color: 'var(--muted)', maxWidth: 220 }}>
                Premier League leikir eru sýndir hér þegar þeir eru á dagskrá
              </p>
            </div>
          )}
        </>
      )}

      <div className="card flex items-center gap-3"
           style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.05))' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'rgba(139,92,246,0.15)' }}>⚽</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Draumakaup</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Manchester United millifærslur</div>
        </div>
        <a href="https://draumakaup.netlify.app" target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs py-1.5 px-3 shrink-0">
          <ExternalLink size={12} /> Opna
        </a>
      </div>

      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
             style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>TA</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">The Athletic</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Fréttir og dýpri greinar</div>
        </div>
        <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs py-1.5 px-3 shrink-0">
          <ExternalLink size={12} /> Opna
        </a>
      </div>

      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: 'rgba(239,68,68,0.1)' }}>🏆</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Takkarena MVP</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Fótboltaleikur</div>
        </div>
        <a href="https://takkmvp.netlify.app" target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs py-1.5 px-3 shrink-0">
          <ExternalLink size={12} /> Opna
        </a>
      </div>

      {updatedAt && (
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          Uppfært {updatedAt.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
