import { useFX } from '../../hooks/useFX'

const PAIRS = [
  { key: 'usdToIsk', label: 'USD', flag: '🇺🇸', color: '#3b82f6' },
  { key: 'eurToIsk', label: 'EUR', flag: '🇪🇺', color: '#f59e0b' },
  { key: 'gbpToIsk', label: 'GBP', flag: '🇬🇧', color: '#8b5cf6' },
]

export default function FXWidget() {
  const { data, loading } = useFX()

  if (loading || !data) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Gengi → ISK</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>í dag</span>
      </div>
      <div className="flex gap-2">
        {PAIRS.map(p => (
          <div key={p.key} className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-base">{p.flag}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>1 {p.label}</span>
            <span className="text-sm font-bold">{data[p.key]?.toLocaleString('is-IS')}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>kr</span>
          </div>
        ))}
      </div>
    </div>
  )
}
