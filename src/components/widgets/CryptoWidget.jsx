import { useCrypto } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

function fmt(price) {
  if (!price) return '–'
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (price >= 1) return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return price.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

export default function CryptoWidget() {
  const { data, loading, error, refresh } = useCrypto()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">Crypto</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => (
          <div key={i} className="flex-1 h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />
        ))}
      </div>
    </div>
  )

  if (error || !data) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Crypto</h3>
        <button onClick={refresh} style={{ color: 'var(--muted)' }} title="Refresh">
          <RefreshCw size={13} />
        </button>
      </div>
      <div className="flex gap-2">
        {data.map(coin => {
          const up = coin.change24h >= 0
          return (
            <div key={coin.id} className="flex-1 flex flex-col gap-1 p-3 rounded-xl"
                 style={{ background: 'var(--surface2)', border: `1px solid ${coin.color}22` }}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs" style={{ color: coin.color }}>{coin.label}</span>
                <span className="text-xs" style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                  {up ? '+' : ''}{coin.change24h?.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm font-semibold">${fmt(coin.price)}</div>
              <div style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
