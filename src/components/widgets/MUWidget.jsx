import { useManUnited } from '../../hooks/useManUnited'

function formatMatchDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const raw = timeStr ? `${dateStr}T${timeStr}` : dateStr
  const d = new Date(raw)
  const datePart = d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  const timePart = timeStr ? ` · ${timeStr.slice(0, 5)}` : ''
  return datePart + timePart
}

export default function MUWidget() {
  const { data, loading } = useManUnited()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ border: '1px solid rgba(218,41,28,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full" style={{ background: 'var(--surface2)' }} />
        <div className="h-4 w-40 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 rounded-xl" style={{ background: 'var(--surface2)' }} />
        <div className="h-20 rounded-xl" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (!data?.next && !data?.last) return null

  const { next, last } = data
  const isHomeNext = next?.strHomeTeam === 'Manchester United'
  const isHomeLast = last?.strHomeTeam === 'Manchester United'
  const muScore = isHomeLast ? last?.intHomeScore : last?.intAwayScore
  const oppScore = isHomeLast ? last?.intAwayScore : last?.intHomeScore
  const oppLast = isHomeLast ? last?.strAwayTeam : last?.strHomeTeam
  const oppNext = next ? (isHomeNext ? next.strAwayTeam : next.strHomeTeam) : null
  const won = Number(muScore) > Number(oppScore)
  const drew = Number(muScore) === Number(oppScore)

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(218,41,28,0.07), rgba(10,14,26,0))',
      border: '1px solid rgba(218,41,28,0.2)',
    }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔴</span>
        <span className="font-semibold text-sm">Manchester United</span>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded font-semibold"
              style={{ background: 'rgba(218,41,28,0.12)', color: '#e8362a' }}>
          MUFC
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {last && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tabular-nums"
                    style={{ color: won ? 'var(--success)' : drew ? '#f97316' : 'var(--danger)' }}>
                {muScore}–{oppScore}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{
                      background: won ? 'rgba(34,197,94,0.15)' : drew ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)',
                      color: won ? 'var(--success)' : drew ? '#f97316' : 'var(--danger)',
                    }}>
                {won ? 'W' : drew ? 'D' : 'L'}
              </span>
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
              {isHomeLast ? 'vs' : 'hjá'} {oppLast}
            </div>
          </div>
        )}

        {next && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="text-sm font-semibold truncate leading-tight">
              {isHomeNext ? 'vs' : '@'} {oppNext}
            </div>
            <div className="text-xs leading-tight" style={{ color: 'var(--accent)' }}>
              {formatMatchDate(next.dateEvent, next.strTime)}
            </div>
          </div>
        )}
      </div>

      {next?.strLeague && (
        <div className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          {next.strLeague}
        </div>
      )}
    </div>
  )
}
