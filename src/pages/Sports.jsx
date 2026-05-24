import { useState } from 'react'
import { useFootball } from '../hooks/useFootball'
import { RefreshCw } from 'lucide-react'

function MatchCard({ match, highlight = false }) {
  const d = new Date(match.date)
  const dateStr = d.toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`card-sm ${highlight ? 'border-[var(--accent)]' : ''}`}
         style={highlight ? { borderColor: 'rgba(0,212,170,0.4)', background: 'rgba(0,212,170,0.05)' } : {}}>
      {highlight && (
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>⭐ Spurs leikur</div>
      )}
      <div className="flex items-center gap-3">
        {match.homeLogo && (
          <img src={match.homeLogo} alt="" className="w-7 h-7 object-contain" onError={e => e.target.style.display='none'} />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{match.home}</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: match.homeScore ? 'var(--text)' : 'var(--muted)' }}>
              {match.homeScore !== '' ? match.homeScore : '–'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{match.away}</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: match.awayScore ? 'var(--text)' : 'var(--muted)' }}>
              {match.awayScore !== '' ? match.awayScore : '–'}
            </span>
          </div>
        </div>
        {match.awayLogo && (
          <img src={match.awayLogo} alt="" className="w-7 h-7 object-contain" onError={e => e.target.style.display='none'} />
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateStr}</span>
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: match.completed ? 'rgba(34,197,94,0.15)' : match.state === 'in' ? 'rgba(249,115,22,0.15)' : 'var(--surface2)',
                color: match.completed ? 'var(--success)' : match.state === 'in' ? '#f97316' : 'var(--muted)',
              }}>
          {match.status || (match.completed ? 'Lokið' : 'Væntanlegt')}
        </span>
      </div>
    </div>
  )
}

function SpursHero({ last, next }) {
  const spursScore = (m) => m.spursHome ? m.homeScore : m.awayScore
  const oppScore = (m) => m.spursHome ? m.awayScore : m.homeScore
  const opp = (m) => m.spursHome ? m.away : m.home

  const result = last
    ? Number(spursScore(last)) > Number(oppScore(last)) ? { text: 'Sigur', color: 'var(--success)' }
    : Number(spursScore(last)) === Number(oppScore(last)) ? { text: 'Jafntefli', color: '#f97316' }
    : { text: 'Tap', color: 'var(--danger)' }
    : null

  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(0,212,170,0.25)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚽</span>
        <div>
          <div className="font-bold text-lg" style={{ color: 'var(--text)' }}>Tottenham Hotspur</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Premier League</div>
        </div>
      </div>

      {last && result && (
        <div className="mb-3 p-3 rounded-xl" style={{ background: `${result.color}15`, border: `1px solid ${result.color}30` }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>Síðasti leikur</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold" style={{ color: result.color }}>{result.text}</div>
              <div className="text-sm">Spurs {spursScore(last)} – {oppScore(last)} {opp(last)}</div>
            </div>
            <div className="text-3xl font-bold tabular-nums"
                 style={{ color: result.color }}>
              {spursScore(last)}–{oppScore(last)}
            </div>
          </div>
        </div>
      )}

      {next && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>Næsti leikur</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Spurs vs {opp(next)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(next.date).toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      )}

      {!last && !next && (
        <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>
          Engir leikir fundust þessa vikuna
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const { todayMatches, spursLast, spursNext, loading } = useFootball()
  const [tab, setTab] = useState('today')

  const tabs = [
    ['today', 'Í dag'],
    ['spurs', 'Spurs'],
  ]

  const handleRefresh = () => {
    sessionStorage.removeItem('addi_football')
    sessionStorage.removeItem('addi_footballAt')
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Knattspyrna</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-ghost" style={{ padding: '6px 10px' }}>
          <RefreshCw size={14} />
        </button>
      </div>

      <SpursHero last={spursLast} next={spursNext} />

      <div className="flex gap-2">
        {tabs.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {loading && (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          Sæki leikjaáætlun…
        </div>
      )}

      {!loading && tab === 'today' && (
        <div className="flex flex-col gap-3">
          {todayMatches.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engir PL leikir í dag
            </div>
          ) : todayMatches.map(m => (
            <MatchCard key={m.id} match={m} highlight={m.hasSpurs} />
          ))}
        </div>
      )}

      {!loading && tab === 'spurs' && (
        <div className="flex flex-col gap-3">
          {spursLast && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>SÍÐASTI LEIKUR</div>
              <MatchCard match={spursLast} highlight />
            </div>
          )}
          {spursNext && (
            <div>
              <div className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--muted)' }}>NÆSTI LEIKUR</div>
              <MatchCard match={spursNext} highlight />
            </div>
          )}
          {!spursLast && !spursNext && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar Spurs niðurstöður fundust þessa vikuna
            </div>
          )}
        </div>
      )}

      <div className="text-center text-xs pt-2" style={{ color: 'var(--muted)' }}>
        Gögn frá ESPN · uppfærist á 5 mín fresti
      </div>
    </div>
  )
}
