import { useCrypto } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CryptoWidget() {
  const { data, loading } = useCrypto()

  if (loading) {
    return (
      <div className="card animate-pulse-soft" style={{ height: 56 }} />
    )
  }

  if (!data) return null

  return (
    <Link to="/crypto" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none', padding: '12px 16px' }}>
        {data.map((coin, i) => {
          const up = coin.change >= 0
          return (
            <div key={coin.id} className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold leading-none" style={{ color: coin.color }}>{coin.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--muted)' }}>{coin.symbol}</span>
                    <span className="text-sm font-bold">
                      ${coin.price >= 1000
                        ? coin.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
                        : coin.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs" style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                    {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {up ? '+' : ''}{coin.change.toFixed(1)}%
                  </div>
                </div>
              </div>
              {i < data.length - 1 && (
                <div className="w-px h-7 shrink-0" style={{ background: 'var(--border)' }} />
              )}
            </div>
          )
        })}
        <div className="ml-auto pl-2 text-xs shrink-0" style={{ color: 'var(--muted)' }}>→</div>
      </div>
    </Link>
  )
}
