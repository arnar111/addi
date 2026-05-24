import { useAurora } from '../../hooks/useAurora'

export default function AuroraWidget() {
  const { data, loading } = useAurora()

  if (loading) return null
  if (!data) return null

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
         style={{ background: `${data.color}18`, border: `1px solid ${data.color}40` }}>
      <div className="text-xl shrink-0">🌌</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{data.label}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Kp-index: {data.kp} · {data.chance}% líkur á norðurljósum</div>
      </div>
      <div className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
           style={{ background: `${data.color}30`, color: data.color }}>
        Kp{data.kp}
      </div>
    </div>
  )
}
