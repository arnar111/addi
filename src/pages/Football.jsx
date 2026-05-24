import { useFootball, usePLTable } from '../hooks/useFootball'
import { RefreshCw } from 'lucide-react'

const RESULT_COLOR = { W: 'var(--success)', L: 'var(--danger)', D: '#f59e0b' }
const RESULT_LABEL = { W: 'Sigur', L: 'Tap', D: 'Jafnt' }

function ResultBadge({ r }) {
  if (!r) return null
  return (
    <span className="badge text-xs" style={{ background: `${RESULT_COLOR[r]}22`, color: RESULT_COLOR[r] }}>{r}</span>
  )
}

function MatchCard({ m, isNext }) {
  const dateStr = m.date
    ? new Date(m.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''

  return (
    <div className="card flex items-center gap-3 py-3" style={isNext ? { border: '1px solid rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.04)' } : {}}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'var(--surface2)' }}>
        {m.isHome ? '🏠' : '✈️'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">
            {m.isHome ? `Spurs vs ${m.opponent}` : `${m.opponent} vs Spurs`}
          </span>
          <ResultBadge r={m.result} />
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {dateStr}{m.time ? ` · ${m.time}` : ''}{m.league ? ` · ${m.league?.replace('English ', '')}` : ''}
          {m.round ? ` · Umferð ${m.round}` : ''}
        </div>
      </div>
      {m.score ? (
        <div className="text-right shrink-0">
          <div className="text-lg font-bold">{m.isHome ? m.score : m.score.split('–').reverse().join('–')}</div>
          {m.result && <div className="text-xs" style={{ color: RESULT_COLOR[m.result] }}>{RESULT_LABEL[m.result]}</div>}
        </div>
      ) : isNext ? (
        <div className="text-right shrink-0">
          <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Væntanlegt</div>
        </div>
      ) : null}
    </div>
  )
}

function FormBar({ matches }) {
  if (!matches.length) return null
  const last5 = [...matches].slice(0, 5).reverse()
  const wins = last5.filter(m => m.result === 'W').length
  const draws = last5.filter(m => m.result === 'D').length
  const losses = last5.filter(m => m.result === 'L').length
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Form (5 leikir)</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{wins}S · {draws}J · {losses}T</span>
      </div>
      <div className="flex gap-2">
        {last5.map((m, i) => (
          <div key={m?.id || i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                 style={{ background: m?.result ? `${RESULT_COLOR[m.result]}22` : 'var(--surface2)', color: m?.result ? RESULT_COLOR[m.result] : 'var(--muted)' }}>
              {m?.result || '?'}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{m?.opponent?.split(' ').slice(-1)[0]?.slice(0, 3)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PLTable({ table, loading }) {
  if (loading) return <div className="card animate-pulse-soft h-48" />
  if (!table?.length) return (
    <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>Tafla ekki fáanleg</div>
  )

  const spursIdx = table.findIndex(r => r.strTeam?.includes('Tottenham'))
  const start = Math.max(0, spursIdx - 3)
  const slice = table.slice(start, start + 7)

  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Premier League · 2024/25</h3>
      <div className="flex flex-col gap-0">
        <div className="grid text-xs py-1 px-2 mb-1" style={{ gridTemplateColumns: '24px 1fr 32px 32px 32px 40px', color: 'var(--muted)' }}>
          <span>#</span><span>Lið</span><span className="text-center">L</span><span className="text-center">S</span><span className="text-center">T</span><span className="text-right">Stig</span>
        </div>
        {slice.map((row) => {
          const isSpurs = row.strTeam?.includes('Tottenham')
          return (
            <div key={row.intRank} className="grid items-center text-sm py-2 px-2 rounded-xl"
                 style={{
                   gridTemplateColumns: '24px 1fr 32px 32px 32px 40px',
                   background: isSpurs ? 'rgba(0,212,170,0.08)' : 'transparent',
                 }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{row.intRank}</span>
              <span className="truncate font-medium text-xs" style={{ color: isSpurs ? 'var(--accent)' : 'var(--text)' }}>
                {isSpurs ? '⚽ ' : ''}{row.strTeam?.replace('Tottenham Hotspur', 'Spurs')}
              </span>
              <span className="text-center text-xs" style={{ color: 'var(--muted)' }}>{row.intPlayed}</span>
              <span className="text-center text-xs" style={{ color: 'var(--success)' }}>{row.intWin}</span>
              <span className="text-center text-xs" style={{ color: 'var(--danger)' }}>{row.intLoss}</span>
              <span className="text-right text-xs font-bold">{row.intPoints}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Football() {
  const { lastMatches, nextMatch, loading, error } = useFootball()
  const { table, loading: tableLoading } = usePLTable()

  const wins = lastMatches.filter(m => m.result === 'W').length
  const goals = lastMatches.reduce((s, m) => s + (m.spursGoals || 0), 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">⚽ Tottenham Hotspur</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2024/25</p>
        </div>
        {loading && <RefreshCw size={16} className="animate-spin" style={{ color: 'var(--muted)' }} />}
      </div>

      {error && (
        <div className="card text-sm" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
          Gat ekki sótt leikjayfirlit. Reyndu aftur síðar.
        </div>
      )}

      {!loading && lastMatches.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Leikir', val: lastMatches.length, color: 'var(--accent)' },
            { label: 'Sigrar', val: wins, color: 'var(--success)' },
            { label: 'Mörk', val: goals, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <FormBar matches={lastMatches} />

      {nextMatch && (
        <div>
          <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>Næsti leikur</h2>
          <MatchCard m={nextMatch} isNext />
        </div>
      )}

      {lastMatches.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>Nýlegar úrslit</h2>
          <div className="flex flex-col gap-2">
            {lastMatches.slice(0, 5).map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        </div>
      )}

      <PLTable table={table} loading={tableLoading} />
    </div>
  )
}
