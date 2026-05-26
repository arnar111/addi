import { useState } from 'react'
import { useSports } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight, RefreshCw, Trophy } from 'lucide-react'

function ScoreRow({ game }) {
  const isLive = game.status === 'in'
  const isDone = game.status === 'post'

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-[var(--surface2)] transition-colors">
      <div className="flex-1 text-right">
        <div className="flex items-center justify-end gap-2">
          {game.homeLogo && (
            <img src={game.homeLogo} alt="" className="w-5 h-5 object-contain" onError={e => e.target.style.display='none'} />
          )}
          <span className="text-sm font-medium truncate max-w-[80px]">{game.home}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isDone || isLive ? (
          <div className="flex items-center gap-1">
            <span className={`text-base font-bold w-5 text-center ${isLive ? 'text-[var(--danger)]' : ''}`}>
              {game.homeScore}
            </span>
            <span className="text-[var(--muted)] text-xs">-</span>
            <span className={`text-base font-bold w-5 text-center ${isLive ? 'text-[var(--danger)]' : ''}`}>
              {game.awayScore}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[var(--muted)] w-14 text-center">
            {game.date ? new Date(game.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) : '-'}
          </span>
        )}
        {isLive && (
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] animate-pulse shrink-0" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          {game.awayLogo && (
            <img src={game.awayLogo} alt="" className="w-5 h-5 object-contain" onError={e => e.target.style.display='none'} />
          )}
          <span className="text-sm font-medium truncate max-w-[80px]">{game.away}</span>
        </div>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { epl, nba, liveGames, refresh, lastUpdated } = useSports()
  const [tab, setTab] = useState('epl')

  const games = tab === 'epl' ? epl : nba
  const shown = games.games?.slice(0, 5) || []
  const loading = games.loading

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={15} style={{ color: 'var(--accent3)' }} />
          <h3 className="font-semibold text-sm">Sport</h3>
          {liveGames.length > 0 && (
            <span className="badge badge-danger text-[10px] px-1.5 py-0 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[var(--danger)] animate-pulse" />
              {liveGames.length} LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-1 rounded-lg hover:bg-[var(--surface2)] transition-colors"
            title="Uppfæra"
          >
            <RefreshCw size={12} style={{ color: 'var(--muted)' }} />
          </button>
          <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="tab-bar mb-3">
        <button
          className={`tab-item ${tab === 'epl' ? 'active' : ''}`}
          onClick={() => setTab('epl')}
        >
          ⚽ Premier League
        </button>
        <button
          className={`tab-item ${tab === 'nba' ? 'active' : ''}`}
          onClick={() => setTab('nba')}
        >
          🏀 NBA
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-10 rounded-xl" />
          ))}
        </div>
      ) : games.error ? (
        <div className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>
          {games.error}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>
          {tab === 'epl' ? 'Engir PL leikir í dag 😴' : 'Engir NBA leikir í dag 😴'}
        </div>
      ) : (
        <div className="space-y-0.5">
          {shown.map(g => <ScoreRow key={g.id} game={g} />)}
        </div>
      )}

      {lastUpdated && (
        <div className="text-[10px] mt-2 text-right" style={{ color: 'var(--muted)' }}>
          Uppfært {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
