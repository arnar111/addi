import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { Loader2 } from 'lucide-react'

function MatchCard({ match }) {
  const isLive = match.status === 'STATUS_IN_PROGRESS'
  const isFinal = match.status === 'STATUS_FINAL'

  return (
    <div className="card py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-lg font-medium"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          {match.league}
        </span>
        {isLive ? (
          <span className="text-xs px-2 py-0.5 rounded-lg animate-pulse-soft"
                style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
            🔴 LIVE · {match.displayClock || match.statusShort}
          </span>
        ) : isFinal ? (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>FT · {match.statusShort}</span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {match.date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {match.date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex flex-col items-end gap-1.5">
          {match.home.logo ? (
            <img src={match.home.logo} alt="" className="w-10 h-10 object-contain"
                 onError={e => { e.target.style.display = 'none' }} />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'var(--surface2)', fontSize: 20 }}>⚽</div>
          )}
          <span className="text-sm font-semibold text-right leading-tight">{match.home.name}</span>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-0.5 min-w-[64px]">
          {isFinal || isLive ? (
            <div className="text-2xl font-bold tabular-nums">
              <span style={{ color: match.home.winner ? 'var(--text)' : 'var(--muted)' }}>{match.home.score}</span>
              <span style={{ color: 'var(--muted)', margin: '0 4px' }}>–</span>
              <span style={{ color: match.away.winner ? 'var(--text)' : 'var(--muted)' }}>{match.away.score}</span>
            </div>
          ) : (
            <span className="text-xl font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
          )}
        </div>

        <div className="flex-1 flex flex-col items-start gap-1.5">
          {match.away.logo ? (
            <img src={match.away.logo} alt="" className="w-10 h-10 object-contain"
                 onError={e => { e.target.style.display = 'none' }} />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'var(--surface2)', fontSize: 20 }}>⚽</div>
          )}
          <span className="text-sm font-semibold leading-tight">{match.away.name}</span>
        </div>
      </div>
    </div>
  )
}

function GolfTab({ golf }) {
  if (!golf) return (
    <div className="card text-center py-10">
      <div className="text-4xl mb-2">⛳</div>
      <div className="text-sm font-semibold mb-1">PGA Tour</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar upplýsingar tiltækar</div>
    </div>
  )

  const medalIcon = (i) => {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return `${i + 1}.`
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), transparent)' }}>
        <div className="text-xs mb-1 font-semibold tracking-wide" style={{ color: 'var(--success)' }}>
          PGA TOUR{golf.round ? ` · UMFERÐ ${golf.round}` : ''}
        </div>
        <div className="text-base font-bold mb-4">{golf.name}</div>
        <div className="flex flex-col gap-3">
          {golf.leaders.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm w-7 font-bold shrink-0"
                    style={{ color: i < 3 ? ['#eab308', '#9ca3af', '#cd7c2f'][i] : 'var(--muted)' }}>
                {medalIcon(i)}
              </span>
              <span className="flex-1 text-sm font-medium">{p.name}</span>
              <span className="font-mono text-sm font-bold" style={{
                color: String(p.score).startsWith('-') ? 'var(--success)'
                  : p.score === 'E' ? 'var(--muted)'
                  : 'var(--danger)',
              }}>{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-sm flex items-center gap-3" style={{ background: 'var(--surface2)' }}>
        <span className="text-xl">⛳</span>
        <div>
          <div className="text-sm font-semibold">GOLF+ VR</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Wolf Creek er opinn — ókeypis!</div>
        </div>
      </div>
    </div>
  )
}

function WorldCupTab({ daysToWorldCup }) {
  const started = daysToWorldCup <= 0

  return (
    <div className="flex flex-col gap-4">
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(0,0,200,0.08), rgba(0,150,57,0.08))' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <div>
            <div className="text-lg font-bold">FIFA World Cup 2026</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>11. júní – 19. júlí 2026</div>
          </div>
        </div>

        {!started && (
          <div className="text-center p-4 rounded-2xl mb-4"
               style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {daysToWorldCup}
            </div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>dagar eftir opnunarleikin</div>
          </div>
        )}

        {started && (
          <div className="text-center p-4 rounded-2xl mb-4"
               style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>⚽ Í GANGI!</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { flag: '🇺🇸', name: 'USA', venues: '11 leikvangir' },
            { flag: '🇨🇦', name: 'Canada', venues: '2 leikvangir' },
            { flag: '🇲🇽', name: 'Mexico', venues: '3 leikvangir' },
          ].map(h => (
            <div key={h.name} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl"
                 style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-2xl">{h.flag}</span>
              <span className="text-sm font-bold">{h.name}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{h.venues}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Lykilleikir</h3>
        <div className="flex flex-col gap-2">
          {[
            { date: '11. júní', name: 'Opnunarleikrinn', venue: 'Estadio Azteca, México City', flag: '🇲🇽' },
            { date: '26. júní', name: 'Útsláttarleikir hefjast', venue: 'Víðs vegar um USA', flag: '🇺🇸' },
            { date: '19. júlí', name: 'Úrslitaleikurinn', venue: 'MetLife Stadium, New York', flag: '🇺🇸' },
          ].map(f => (
            <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-xl shrink-0">{f.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{f.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{f.date} · {f.venue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Lið að fylgjast með</h3>
        <div className="flex flex-col gap-2">
          {[
            { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', note: 'Foden out · Pochettino stýrir' },
            { flag: '🇺🇸', name: 'USA', note: 'Gestgjafar · Stórar vonir' },
            { flag: '🇦🇷', name: 'Argentína', note: 'Messi & verðandi meistarar' },
            { flag: '🇫🇷', name: 'Frakkland', note: 'Mbappé leiðir liðið' },
            { flag: '🇧🇷', name: 'Brasilía', note: 'Ewig uppáhaldið' },
          ].map(t => (
            <div key={t.name} className="flex items-center gap-3 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-2xl shrink-0">{t.flag}</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{t.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-sm text-center" style={{ background: 'var(--surface2)' }}>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          48 lið · 104 leikir · Stærsta HM sögunnar
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'football', label: '⚽ Knattspyrna' },
  { id: 'golf', label: '⛳ Golf' },
  { id: 'worldcup', label: '🏆 HM 2026' },
]

export default function Sports() {
  const [tab, setTab] = useState('football')
  const { football, golf, loading, daysToWorldCup } = useSports()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {loading ? 'Hleður gögnum...' : `${football.length} leikir · Golf · HM 2026`}
        </p>
      </div>

      {daysToWorldCup > 0 && daysToWorldCup <= 90 && (
        <button className="card flex items-center justify-between text-left w-full"
          onClick={() => setTab('worldcup')}
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(0,0,150,0.07), rgba(0,150,57,0.07))',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-xs tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>
                FIFA WORLD CUP 2026
              </div>
              <div className="text-sm font-semibold">11. júní · Azteca, Mexico</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {daysToWorldCup}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
          </div>
        </button>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'football' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="card flex items-center justify-center py-10 gap-2"
                 style={{ color: 'var(--muted)' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Hleður leikjum...
            </div>
          ) : football.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-2">⚽</div>
              <div className="text-sm font-semibold mb-1">Engir leikir fundust</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Premier League · Champions League</div>
            </div>
          ) : (
            football.map(m => <MatchCard key={m.id} match={m} />)
          )}
        </div>
      )}

      {tab === 'golf' && <GolfTab golf={golf} />}
      {tab === 'worldcup' && <WorldCupTab daysToWorldCup={daysToWorldCup} />}
    </div>
  )
}
