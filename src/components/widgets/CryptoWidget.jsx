import { useCrypto } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown } from 'lucide-react'

function fmt(price) {
  if (!price) return '—'
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export default function CryptoWidget() {
  const { data, loading } = useCrypto()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="flex-1 h-14 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  if (!data) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>CRYPTO</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Live · USD</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {data.map(coin => {
          const up = coin.change > 0
          return (
            <div key={coin.id} className="flex flex-col gap-1 p-2.5 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold" style={{ color: coin.color }}>{coin.symbol}</span>
              </div>
              <div className="text-sm font-semibold">{fmt(coin.price)}</div>
              {coin.change !== null && (
                <div className="flex items-center gap-0.5 text-xs"
                     style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {up ? '+' : ''}{coin.change.toFixed(1)}%
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
