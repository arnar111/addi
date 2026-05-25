import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

function TeamScore({ team, isWinner }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {team.logo && (
          <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" onError={e => e.target.style.display = 'none'} />
        )}
        <span className={`text-sm font-medium ${isWinner ? 'text-white' : ''}`}>{team.name}</span>
      </div>
      <span className="text-base font-bold tabular-nums">{team.score}</span>
    </div>
  )
}

function GameCard({ game, sport }) {
  const home = game.teams.find(t => t.homeAway === 'home') || game.teams[1]
  const away = game.teams.find(t => t.homeAway === 'away') || game.teams[0]

  const statusColor = game.isLive ? '#ef4444' : game.isFinal ? 'var(--muted)' : 'var(--accent)'
  const statusLabel = game.isLive
    ? (sport === 'nba'
      ? `Q${game.period} · ${game.clock}`
      : `${game.clock}'`)
    : game.isFinal ? 'Lokið'
    : new Date(game.date).toLocaleString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {game.note ? (
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{game.note}</span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{game.venue || '—'}</span>
        )}
        <div className="flex items-center gap-1.5">
          {game.isLive && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="text-xs font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>

      {game.isFinal || game.isLive ? (
        <div className="flex flex-col gap-1.5">
          {away && <TeamScore team={away} isWinner={away.winner} />}
          {home && <TeamScore team={home} isWinner={home.winner} />}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{away?.name}</span>
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>vs</span>
          <span className="text-sm font-medium">{home?.name}</span>
        </div>
      )}
    </div>
  )
}

const WC_START = new Date('2026-06-11T00:00:00-06:00')

function WorldCupTab({ games }) {
  const started = Date.now() >= WC_START.getTime()
  const daysLeft = Math.max(0, Math.ceil((WC_START.getTime() - Date.now()) / 86400000))

  const GROUPS_INFO = [
    { group: 'Stigi', detail: '11. júní – 27. júní 2026' },
    { group: 'Úrslitir 32', detail: '29. júní – 4. júlí' },
    { group: 'Úrslitir 16', detail: '5. – 8. júlí' },
    { group: 'Fjórðungsúrslit', detail: '10. – 12. júlí' },
    { group: 'Undanúrslit', detail: '15. – 16. júlí' },
    { group: 'Úrslitaleikur', detail: '19. júlí · MetLife Stadium, NJ' },
  ]

  const NOTABLE = [
    { flag: '🇧🇷', name: 'Brasilía', group: 'C' },
    { flag: '🇦🇷', name: 'Argentína', group: 'A' },
    { flag: '🇫🇷', name: 'Frakkland', group: 'D' },
    { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', group: 'G' },
    { flag: '🇩🇪', name: 'Þýskaland', group: 'E' },
    { flag: '🇮🇹', name: 'Ítalía', group: 'B' },
    { flag: '🇵🇹', name: 'Portúgal', group: 'H' },
    { flag: '🇪🇸', name: 'Spánn', group: 'F' },
    { flag: '🇳🇱', name: 'Holland', group: 'B' },
    { flag: '🇺🇸', name: 'BNA', group: 'A' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="card text-center py-6" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(249,115,22,0.1))',
        border: '1px solid rgba(0,212,170,0.2)',
      }}>
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-lg font-bold mb-1">FIFA World Cup 2026</div>
        <div className="text-sm mb-3" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico · 48 lið</div>
        {!started ? (
          <>
            <div className="text-5xl font-black mb-1" style={{ color: 'var(--accent)' }}>{daysLeft}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>dagar til upphafs</div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              Fyrsti leikur: Mexíkó · 11. júní 2026
            </div>
          </>
        ) : games.length === 0 ? (
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar niðurstöður</div>
        ) : (
          <div className="text-sm" style={{ color: 'var(--accent)' }}>Mótið er í gangi!</div>
        )}
      </div>

      {started && games.length > 0 ? (
        <div className="flex flex-col gap-3">
          {games.map(g => <GameCard key={g.id} game={g} sport="soccer" />)}
        </div>
      ) : (
        <>
          <div className="card">
            <h3 className="font-semibold text-sm mb-3">Áætlun</h3>
            <div className="flex flex-col gap-2">
              {GROUPS_INFO.map(({ group, detail }) => (
                <div key={group} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm font-medium">{group}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-3">Helstu lið</h3>
            <div className="grid grid-cols-2 gap-2">
              {NOTABLE.map(({ flag, name, group }) => (
                <div key={name} className="flex items-center gap-2 py-2 px-3 rounded-xl"
                     style={{ background: 'var(--surface2)' }}>
                  <span className="text-xl">{flag}</span>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>Hópur {group}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Sports() {
  const [tab, setTab] = useState('nba')
  const { nba, interGames, serie, worldCup, loading, error, refresh } = useSports()

  const tabs = [
    { id: 'nba', label: '🏀 NBA' },
    { id: 'inter', label: '⚫🔵 Inter' },
    { id: 'serie', label: '🇮🇹 Serie A' },
    { id: 'wc', label: '🏆 WC 2026' },
  ]

  const gameList = tab === 'nba' ? nba
    : tab === 'inter' ? interGames
    : tab === 'serie' ? serie
    : []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {loading ? 'Hleður...' : error ? 'Villa við hleðslu' : 'Live gögn'}
          </p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: 8 }}>
          <RefreshCw size={16} style={{ color: loading ? 'var(--accent)' : 'var(--muted)' }} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn shrink-0 text-sm py-1.5"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {error && (
        <div className="card flex items-center gap-2" style={{ color: 'var(--danger)' }}>
          <WifiOff size={16} />
          <span className="text-sm">Gat ekki sótt gögn. Athugaðu nettengingu.</span>
        </div>
      )}

      {tab === 'wc' ? (
        <WorldCupTab games={worldCup} />
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft h-24" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      ) : gameList.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">{tab === 'nba' ? '🏀' : '⚽'}</div>
          <div className="text-sm">Engir leikir í dag</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {gameList.map(g => <GameCard key={g.id} game={g} sport={tab === 'nba' ? 'nba' : 'soccer'} />)}
        </div>
      )}
    </div>
  )
}
