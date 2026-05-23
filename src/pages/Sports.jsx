import { useState, useEffect } from 'react'
import { useFootball } from '../hooks/useFootball'
import { RefreshCw, Calendar } from 'lucide-react'

function useCountdown(target) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date()
      if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return }
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return cd
}

function MatchRow({ m, showScore }) {
  const dateStr = new Date(m.dateEvent).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
  return (
    <div className="flex items-center py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="flex-1 text-right pr-2 min-w-0">
        <span className="text-sm font-medium truncate block">{m.strHomeTeam}</span>
      </div>
      <div className="w-28 text-center shrink-0">
        {showScore ? (
          <span className="text-base font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
            {m.intHomeScore ?? '?'} – {m.intAwayScore ?? '?'}
          </span>
        ) : (
          <>
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{dateStr}</div>
            {m.strTime && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.strTime.slice(0, 5)}</div>
            )}
          </>
        )}
      </div>
      <div className="flex-1 pl-2 min-w-0">
        <span className="text-sm font-medium truncate block">{m.strAwayTeam}</span>
      </div>
    </div>
  )
}

function TableRow({ team, rank }) {
  const gd = Number(team.intGoalDifference)
  const pos = Number(rank)
  const posColor = pos <= 4 ? 'var(--accent)' : pos === 5 ? '#8b5cf6' : pos === 6 ? '#f97316' : pos >= 18 ? 'var(--danger)' : 'var(--muted)'

  return (
    <div className="flex items-center py-2.5 text-sm" style={{ borderTop: '1px solid var(--border)' }}>
      <span className="w-6 text-xs font-bold text-center" style={{ color: posColor }}>{pos}</span>
      <div className="flex-1 flex items-center gap-2 min-w-0 px-2">
        {team.strBadge && (
          <img src={team.strBadge} alt="" className="w-5 h-5 object-contain shrink-0"
               onError={e => { e.target.style.display = 'none' }} />
        )}
        <span className="truncate">{team.strTeam}</span>
      </div>
      <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intPlayed}</span>
      <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intWin}</span>
      <span className="w-7 text-center text-xs" style={{ color: 'var(--muted)' }}>{team.intLoss}</span>
      <span className="w-8 text-center text-xs"
            style={{ color: gd > 0 ? 'var(--success)' : gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
        {gd > 0 ? `+${gd}` : gd}
      </span>
      <span className="w-8 text-right font-bold">{team.intPoints}</span>
    </div>
  )
}

export default function Sports() {
  const { standings, recent, upcoming, loading, error, refresh } = useFootball()
  const [tab, setTab] = useState('matches')
  const cd = useCountdown('2026-06-11T19:00:00Z')
  const wcStarted = new Date() >= new Date('2026-06-11T19:00:00Z')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League · HM 2026</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--muted)' }} />
        </button>
      </div>

      {/* WC 2026 Countdown */}
      <div className="card overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(0,64,128,0.2), rgba(150,0,0,0.15), rgba(0,100,50,0.15))',
             border: '1px solid rgba(100,150,255,0.22)',
           }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-bold">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {wcStarted ? 'Í gangi núna! 🔥' : 'BNA · Mexíkó · Kanada · 11. júní 2026'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[['Dagar', cd.d], ['Klst', cd.h], ['Mín', cd.m], ['Sek', cd.s]].map(([label, val]) => (
            <div key={label} className="flex flex-col items-center py-3 rounded-xl"
                 style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl font-bold tabular-nums leading-none"
                    style={{ color: 'var(--accent)' }}>
                {String(val).padStart(2, '0')}
              </span>
              <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['matches', '⚽ Leikir'], ['table', '📊 Tafla']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {loading && (
        <div className="card text-center py-10 animate-pulse-soft" style={{ color: 'var(--muted)' }}>
          Sæki leikjaupplýsingar...
        </div>
      )}
      {error && !loading && (
        <div className="card text-center py-6 flex flex-col items-center gap-2">
          <p className="text-sm" style={{ color: 'var(--danger)' }}>Gat ekki sótt gögn</p>
          <button onClick={refresh} className="btn btn-ghost text-xs">Reyna aftur</button>
        </div>
      )}

      {!loading && tab === 'matches' && (
        <>
          {recent.length > 0 && (
            <div className="card">
              <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
                Nýlegar niðurstöður
              </div>
              {recent.slice(0, 6).map(m => <MatchRow key={m.idEvent} m={m} showScore />)}
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="card">
              <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Calendar size={14} style={{ color: 'var(--accent)' }} />
                Næstu leikir
              </div>
              {upcoming.slice(0, 6).map(m => <MatchRow key={m.idEvent} m={m} showScore={false} />)}
            </div>
          )}
          {!recent.length && !upcoming.length && !error && (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <p className="text-3xl mb-2">⚽</p>
              <p className="text-sm">Engir leikir fundust</p>
            </div>
          )}
        </>
      )}

      {!loading && tab === 'table' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <span className="font-semibold text-sm">Premier League 2025/26</span>
          </div>
          {/* Header */}
          <div className="flex items-center pb-1 text-xs" style={{ color: 'var(--muted)', borderBottom: '2px solid var(--border)' }}>
            <span className="w-6 text-center">#</span>
            <span className="flex-1 px-2">Lið</span>
            <span className="w-7 text-center">L</span>
            <span className="w-7 text-center">S</span>
            <span className="w-7 text-center">T</span>
            <span className="w-8 text-center">MS</span>
            <span className="w-8 text-right font-bold">Stig</span>
          </div>
          {standings.length === 0 && (
            <p className="text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>Engin gögn</p>
          )}
          {standings.slice(0, 20).map((team, i) => (
            <TableRow key={team.idStanding || i} team={team} rank={i + 1} />
          ))}
          {standings.length > 0 && (
            <div className="flex gap-3 mt-3 pt-2 flex-wrap text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
              <span><b style={{ color: 'var(--accent)' }}>■</b> UCL</span>
              <span><b style={{ color: '#8b5cf6' }}>■</b> UEL</span>
              <span><b style={{ color: '#f97316' }}>■</b> UECL</span>
              <span><b style={{ color: 'var(--danger)' }}>■</b> Niðurfelling</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
