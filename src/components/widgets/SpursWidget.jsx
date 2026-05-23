import { useSpurs } from '../../hooks/useSpurs'

const ORDINAL_IS = (n) => {
  if (!n) return n
  return `${n}.`
}

const RESULT_STYLE = {
  W: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Sigur' },
  D: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: 'Jafnt' },
  L: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Tap' },
}

function StatBox({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-base font-bold">{value ?? '–'}</span>
      <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
    </div>
  )
}

export default function SpursWidget() {
  const { data, loading } = useSpurs()

  if (loading) {
    return (
      <div className="card animate-pulse-soft flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'var(--surface2)' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-32 rounded" style={{ background: 'var(--surface2)' }} />
          <div className="h-3 w-20 rounded" style={{ background: 'var(--surface2)' }} />
        </div>
      </div>
    )
  }

  if (!data || data.error) {
    return (
      <div className="card flex items-center gap-3">
        <img
          src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/367.png&w=40&h=40&scale=crop&cquality=40`}
          alt="Spurs"
          className="w-10 h-10 rounded-xl object-contain shrink-0"
          style={{ background: '#132257' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Tottenham Hotspur</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>⚽ Come on you Spurs</div>
        </div>
      </div>
    )
  }

  const { position, points, wins, draws, losses, lastResult, nextMatch } = data

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/367.png&w=40&h=40&scale=crop&cquality=40`}
          alt="Spurs"
          className="w-10 h-10 rounded-xl object-contain shrink-0"
          style={{ background: '#132257', padding: 2 }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Tottenham Hotspur</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Premier League 2025–26</div>
        </div>
        {position != null && (
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xl font-bold" style={{ color: position <= 4 ? 'var(--accent)' : position <= 6 ? '#f97316' : 'var(--text)' }}>
              {ORDINAL_IS(position)}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>sæti</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      {(wins !== undefined || points != null) && (
        <div className="flex justify-around py-2 mb-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <StatBox value={wins} label="Sigrar" />
          <StatBox value={draws} label="Jafnt" />
          <StatBox value={losses} label="Tap" />
          {points != null && <StatBox value={points} label="Stig" />}
        </div>
      )}

      {/* Last result */}
      {lastResult && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-1.5 py-0.5 rounded-md font-semibold shrink-0"
            style={{ background: RESULT_STYLE[lastResult.result].bg, color: RESULT_STYLE[lastResult.result].color }}>
            {RESULT_STYLE[lastResult.result].label}
          </span>
          <span className="text-sm flex-1 min-w-0 truncate">
            {lastResult.homeAway === 'H' ? '(H) ' : '(A) '}{lastResult.opponent}
          </span>
          <span className="text-sm font-mono font-semibold shrink-0">
            {lastResult.spursScore}–{lastResult.oppScore}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
            {new Date(lastResult.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      )}

      {/* Next match or off-season */}
      {nextMatch ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded-xl" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)' }}>
          <span className="text-xs" style={{ color: 'var(--accent)' }}>Næst</span>
          <span className="text-sm flex-1 truncate">{nextMatch.home} – {nextMatch.away}</span>
          <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
            {new Date(nextMatch.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      ) : (
        <div className="text-xs py-2 text-center" style={{ color: 'var(--muted)' }}>
          ⚽ Sumarbíðið — Næsta tímabil hefst í ágúst
        </div>
      )}
    </div>
  )
}
