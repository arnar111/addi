import { useAurora } from '../../hooks/useAurora'

function MiniBar({ value, max = 9 }) {
  const h = Math.max(4, Math.round((value / max) * 32))
  const isHigh = value >= 5
  return (
    <div className="flex flex-col items-center justify-end" style={{ height: 32 }}>
      <div className="w-2 rounded-sm transition-all"
           style={{ height: h, background: isHigh ? 'var(--accent)' : 'var(--surface2)' }} />
    </div>
  )
}

export default function AuroraWidget() {
  const { data, loading } = useAurora()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ height: 72 }}>
      <div className="h-4 w-32 rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  if (!data) return null

  const alert = data.kp >= 5

  return (
    <div className="card flex items-center gap-3"
         style={{ border: `1px solid ${alert ? data.color + '44' : 'var(--border)'}`, background: alert ? `${data.color}08` : 'var(--surface)' }}>
      <div className="text-3xl shrink-0">🌌</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Norðurljós</span>
          {alert && (
            <span className="badge text-xs" style={{ background: `${data.color}22`, color: data.color }}>
              Virkt
            </span>
          )}
        </div>
        <div className="text-xs mt-0.5" style={{ color: data.color }}>
          {data.visibility} · KP {data.kp}
        </div>
      </div>

      <div className="flex items-end gap-0.5 shrink-0">
        {(data.history || []).slice(-8).map((v, i) => (
          <MiniBar key={i} value={v} />
        ))}
      </div>

      <div className="text-right shrink-0">
        <div className="text-lg font-bold" style={{ color: data.color }}>{data.chance}%</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>líkur</div>
      </div>
    </div>
  )
}
