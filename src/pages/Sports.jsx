import { useInterMilan, useKnicks } from '../hooks/useSports'
import { Calendar, Home, Plane, RefreshCw } from 'lucide-react'

function ResultBadge({ won, drew }) {
  if (drew) return (
    <span className="badge" style={{ background: 'rgba(100,116,139,0.2)', color: 'var(--muted)' }}>J</span>
  )
  if (won) return (
    <span className="badge" style={{ background: 'rgba(34,197,94,0.18)', color: 'var(--success)' }}>W</span>
  )
  return (
    <span className="badge" style={{ background: 'rgba(239,68,68,0.18)', color: 'var(--danger)' }}>L</span>
  )
}

function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

function TeamHeader({ logo, name, subtitle, color }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {logo ? (
        <img src={logo} alt={name} className="w-10 h-10 object-contain" />
      ) : (
        <div className="w-10 h-10 rounded-full" style={{ background: color }} />
      )}
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{subtitle}</div>
      </div>
    </div>
  )
}

function ResultRow({ match, scoreA, scoreB }) {
  return (
    <div key={match.id} className="flex items-center gap-3 py-2"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <ResultBadge won={match.won} drew={match.drew} />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">
          {match.isHome ? 'v/' : '@'} {match.opponent}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatMatchDate(match.date)}
        </div>
      </div>
      <span className="text-sm font-bold tabular-nums">
        {scoreA}–{scoreB}
      </span>
    </div>
  )
}

function NextMatch({ match, scoreA, scoreB }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl"
         style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
      <Calendar size={16} style={{ color: 'var(--accent)', shrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {match.isHome ? 'v/' : '@'} {match.opponent}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatMatchDate(match.date)}
          {match.venue ? ` · ${match.venue}` : ''}
        </div>
      </div>
      {match.isHome
        ? <Home size={14} style={{ color: 'var(--muted)' }} />
        : <Plane size={14} style={{ color: 'var(--muted)' }} />}
    </div>
  )
}

function TeamCard({ teamData, loading, title, subtitle, recentScoreA, recentScoreB }) {
  if (loading) return (
    <div className="card animate-pulse-soft" style={{ height: 200 }} />
  )
  if (!teamData) return (
    <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
      Gat ekki sótt gögn
    </div>
  )

  return (
    <div className="card">
      <TeamHeader
        logo={teamData.team.logo}
        name={teamData.team.name}
        subtitle={subtitle}
        color={teamData.team.color}
      />

      {teamData.recent.length > 0 ? (
        <div className="mb-4">
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>NÝLEGIR LEIKIR</div>
          <div>
            {teamData.recent.slice(0, 3).map(m => (
              <ResultRow
                key={m.id}
                match={m}
                scoreA={m.myScore}
                scoreB={m.opponentScore}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Engir leikir í gagnagrunni</div>
      )}

      {teamData.next.length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>NÆSTI LEIKUR</div>
          <NextMatch match={teamData.next[0]} />
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const inter = useInterMilan()
  const knicks = useKnicks()

  const reload = () => {
    sessionStorage.removeItem('inter_data')
    sessionStorage.removeItem('inter_data_at')
    sessionStorage.removeItem('knicks_data')
    sessionStorage.removeItem('knicks_data_at')
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Inter Milan · NY Knicks</p>
        </div>
        <button onClick={reload} className="btn btn-ghost" style={{ padding: '8px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['⚽', 'Serie A'], ['🏀', 'NBA']].map(([icon, label]) => (
          <span key={label} className="badge shrink-0 text-xs"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 10px' }}>
            {icon} {label}
          </span>
        ))}
      </div>

      <TeamCard
        teamData={inter.data}
        loading={inter.loading}
        subtitle="Serie A · 2025/26"
      />

      <TeamCard
        teamData={knicks.data}
        loading={knicks.loading}
        subtitle="NBA · 2025/26"
      />
    </div>
  )
}
