import { useFootball } from '../hooks/useFootball'

const POS_COLOR = (pos) => {
  if (pos <= 4) return '#3b82f6'
  if (pos === 5) return '#f97316'
  if (pos >= 18) return '#ef4444'
  return 'var(--muted)'
}

const POS_LABEL = (pos) => {
  if (pos <= 4) return 'UCL'
  if (pos === 5) return 'UEL'
  if (pos === 6) return 'UEL'
  if (pos >= 18) return 'FP'
  return ''
}

function MatchCard({ match }) {
  const state = match.statusState
  const isLive = state === 'in'
  const isDone = state === 'post'

  return (
    <div className="card-sm flex items-center gap-3"
         style={{ border: `1px solid ${match.isArsenal ? 'rgba(239,68,68,0.2)' : 'var(--border)'}` }}>
      <div className="flex-1 text-right text-sm font-medium truncate">{match.home}</div>
      <div className="shrink-0 text-center">
        {isDone || isLive ? (
          <div className="flex items-center gap-1">
            {isLive && <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#ef4444' }} />}
            <span className="text-sm font-bold">{match.homeScore}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>-</span>
            <span className="text-sm font-bold">{match.awayScore}</span>
          </div>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            {match.status}
          </span>
        )}
      </div>
      <div className="flex-1 text-left text-sm font-medium truncate">{match.away}</div>
    </div>
  )
}

export default function Sports() {
  const { table, matches, loading, arsenalRow } = useFootball()

  if (loading) return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card animate-pulse-soft h-10" />
      ))}
    </div>
  )

  const arsenalMatches = matches?.filter(m => m.isArsenal) || []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025/26</p>
        </div>
        <span className="text-2xl">⚽</span>
      </div>

      {/* Arsenal card */}
      {arsenalRow && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🔴</span>
            <div className="flex-1">
              <div className="font-bold text-lg" style={{ color: '#ef4444' }}>Arsenal FC</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {arsenalRow.pos <= 4 ? '🔵 UCL-sæti' : arsenalRow.pos === 5 ? '🟠 UEL-sæti' : `${arsenalRow.pos}. sæti`}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: 'Sæti', value: arsenalRow.pos },
              { label: 'Stig', value: arsenalRow.points },
              { label: 'Skil.', value: arsenalRow.won },
              { label: 'Jafnt', value: arsenalRow.drawn },
              { label: 'GD', value: (arsenalRow.gd > 0 ? '+' : '') + arsenalRow.gd },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <span className="text-lg font-bold" style={{ color: label === 'Stig' ? 'var(--accent)' : 'var(--text)' }}>{value}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arsenal matches */}
      {arsenalMatches.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>Arsenal leikir</h2>
          {arsenalMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      {/* Full table */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-3">Stigatafla</h2>

        <div className="grid text-xs px-1 mb-2"
             style={{ gridTemplateColumns: '22px 1fr 28px 22px 22px 22px 28px 32px', color: 'var(--muted)' }}>
          <span>#</span><span>Lið</span>
          <span className="text-center">Lk</span>
          <span className="text-center">Sk</span>
          <span className="text-center">Jafn</span>
          <span className="text-center">Tap</span>
          <span className="text-center">GD</span>
          <span className="text-right font-semibold">Stig</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {(table || []).map(row => (
            <div key={row.pos}
                 className="grid items-center text-xs px-1 py-1.5 rounded-lg"
                 style={{
                   gridTemplateColumns: '22px 1fr 28px 22px 22px 22px 28px 32px',
                   background: row.isArsenal ? 'rgba(239,68,68,0.07)' : 'transparent',
                   border: row.isArsenal ? '1px solid rgba(239,68,68,0.15)' : '1px solid transparent',
                 }}>
              <div className="flex items-center gap-0.5">
                <span className="font-semibold" style={{ color: POS_COLOR(row.pos), fontSize: 10 }}>{row.pos}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate font-medium" style={{ color: row.isArsenal ? '#ef4444' : 'var(--text)' }}>
                  {row.name}
                </span>
                {POS_LABEL(row.pos) && (
                  <span className="shrink-0 text-xs px-1 rounded" style={{ fontSize: 9, background: `${POS_COLOR(row.pos)}22`, color: POS_COLOR(row.pos) }}>
                    {POS_LABEL(row.pos)}
                  </span>
                )}
              </div>
              <span className="text-center" style={{ color: 'var(--muted)' }}>{row.played}</span>
              <span className="text-center">{row.won}</span>
              <span className="text-center" style={{ color: 'var(--muted)' }}>{row.drawn}</span>
              <span className="text-center" style={{ color: 'var(--muted)' }}>{row.lost}</span>
              <span className="text-center" style={{ color: row.gd > 0 ? 'var(--success)' : row.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                {row.gd > 0 ? '+' : ''}{row.gd}
              </span>
              <span className="text-right font-bold">{row.points}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
          <span className="flex items-center gap-1"><span style={{ color: '#3b82f6' }}>■</span> UCL</span>
          <span className="flex items-center gap-1"><span style={{ color: '#f97316' }}>■</span> UEL</span>
          <span className="flex items-center gap-1"><span style={{ color: '#ef4444' }}>■</span> Fallið</span>
        </div>
      </div>
    </div>
  )
}
