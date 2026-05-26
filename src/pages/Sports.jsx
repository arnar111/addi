import { useFootball } from '../hooks/useFootball'
import { RefreshCw, ExternalLink } from 'lucide-react'

const ZONE = (rank) => {
  if (rank <= 4) return 'var(--accent)'
  if (rank <= 6) return '#f97316'
  if (rank >= 18) return 'var(--danger)'
  return 'var(--muted)'
}

export default function Sports() {
  const { scores, standings, loading, error, refresh } = useFootball()

  const completed = scores?.filter(s => s.completed) || []
  const live = scores?.filter(s => s.live) || []
  const upcoming = scores?.filter(s => !s.completed && !s.live) || []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025/26</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-1.5">
            <ExternalLink size={12} /> The Athletic
          </a>
          <button onClick={refresh} className="btn btn-ghost py-1.5 px-2" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && !standings ? (
        <div className="card text-center py-10 animate-pulse-soft" style={{ color: 'var(--muted)' }}>
          Hleður gögn frá ESPN...
        </div>
      ) : error && !standings ? (
        <div className="card text-center py-8">
          <div className="text-sm mb-2" style={{ color: 'var(--danger)' }}>Villa við að sækja gögn</div>
          <button onClick={refresh} className="btn btn-ghost text-sm">Reyna aftur</button>
        </div>
      ) : (
        <>
          {/* Live matches */}
          {live.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
              <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--success)', display: 'inline-block' }} />
                LIVE
              </div>
              {live.map(s => <MatchRow key={s.id} s={s} live />)}
            </div>
          )}

          {/* Standings */}
          {standings?.length > 0 && (
            <div className="card">
              <div className="font-semibold text-sm mb-3">Stigatafla</div>
              <div className="flex gap-4 text-xs mb-2" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                  UCL
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#f97316' }} />
                  UEL
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
                  Niðurskipun
                </span>
              </div>
              <div className="flex text-xs mb-1 px-1" style={{ color: 'var(--muted)' }}>
                <span style={{ width: 20 }}>#</span>
                <span style={{ width: 20 }} />
                <span className="flex-1">Lið</span>
                <span style={{ width: 28, textAlign: 'center' }}>L</span>
                <span style={{ width: 28, textAlign: 'center' }}>W</span>
                <span style={{ width: 28, textAlign: 'center' }}>D</span>
                <span style={{ width: 32, textAlign: 'center' }}>GD</span>
                <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>Stig</span>
              </div>
              {standings.map((t, i) => (
                <div key={t.team}
                     className="flex items-center py-1.5 text-xs"
                     style={{ borderBottom: i < standings.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ width: 20, color: ZONE(t.rank), fontWeight: 600, textAlign: 'center', flexShrink: 0 }}>
                    {t.rank}
                  </span>
                  {t.logo
                    ? <img src={t.logo} alt={t.team} style={{ width: 18, height: 18, objectFit: 'contain', marginRight: 4, flexShrink: 0 }} />
                    : <span style={{ width: 22, flexShrink: 0 }} />
                  }
                  <span className="flex-1 truncate">{t.team}</span>
                  <span style={{ width: 28, textAlign: 'center' }}>{t.played}</span>
                  <span style={{ width: 28, textAlign: 'center' }}>{t.won}</span>
                  <span style={{ width: 28, textAlign: 'center' }}>{t.drawn}</span>
                  <span style={{ width: 32, textAlign: 'center', color: t.gd > 0 ? 'var(--success)' : t.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                    {t.gd > 0 ? '+' : ''}{t.gd}
                  </span>
                  <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>{t.points}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent results */}
          {completed.length > 0 && (
            <div className="card">
              <div className="font-semibold text-sm mb-3">Nýlegar leikjanir</div>
              {completed.map(s => <MatchRow key={s.id} s={s} />)}
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="card">
              <div className="font-semibold text-sm mb-3">Næstu leikir</div>
              {upcoming.slice(0, 8).map(s => <MatchRow key={s.id} s={s} upcoming />)}
            </div>
          )}

          {!completed.length && !upcoming.length && !live.length && (
            <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
              Engar leikjanir fundust þessa umferð
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MatchRow({ s, live, upcoming }) {
  return (
    <div className="flex items-center py-2.5"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {s.home.logo
          ? <img src={s.home.logo} alt={s.home.name} style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
          : null
        }
        <span className="text-sm truncate">{s.home.name}</span>
      </div>

      {upcoming ? (
        <div className="mx-2 text-xs shrink-0" style={{ color: 'var(--muted)', minWidth: 90, textAlign: 'center' }}>
          {new Date(s.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          {' '}
          {new Date(s.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      ) : (
        <div className="mx-2 shrink-0">
          <span className="px-3 py-1 rounded-lg text-sm font-bold block"
                style={{
                  background: live ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: live ? 'var(--accent)' : 'var(--text)',
                  minWidth: 60,
                  textAlign: 'center',
                }}>
            {s.home.score ?? '-'} – {s.away.score ?? '-'}
          </span>
          {live && (
            <div className="text-xs text-center mt-0.5" style={{ color: 'var(--accent)' }}>
              {s.statusShort}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
        <span className="text-sm truncate text-right">{s.away.name}</span>
        {s.away.logo
          ? <img src={s.away.logo} alt={s.away.name} style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
          : null
        }
      </div>
    </div>
  )
}
