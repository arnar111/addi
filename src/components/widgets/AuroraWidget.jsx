import { useAurora } from '../../hooks/useAurora'

export default function AuroraWidget() {
  const { data, loading, getStatus } = useAurora()

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3" style={{ minHeight: 64 }}>
      <div className="w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-2.5 w-16 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (!data) return null

  const status = getStatus(data.latest)
  const kpPct = Math.min(100, (data.latest / 9) * 100)

  return (
    <div className="card flex items-center gap-3"
         style={{ background: status.bg, borderColor: `${status.color}33` }}>
      <div className="text-2xl shrink-0">🌌</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Norðurljós · Reykjavík</span>
          <span className="text-xs font-bold" style={{ color: status.color }}>{status.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all duration-700"
                 style={{ width: `${kpPct}%`, background: status.color }} />
          </div>
          <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: status.color }}>
            KP {data.latest}
          </span>
        </div>
      </div>
    </div>
  )
}
