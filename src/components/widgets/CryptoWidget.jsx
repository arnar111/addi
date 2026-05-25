import { useCrypto, COIN_META, formatPrice } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function CoinRow({ id, data }) {
  const meta = COIN_META[id]
  if (!meta || !data) return null
  const up = data.change24h >= 0
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
           style={{ background: `${meta.color}18`, color: meta.color }}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold">{meta.symbol}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-xs font-semibold tabular-nums">{formatPrice(data.price)}</span>
        <div className="flex items-center gap-0.5">
          {up ? <TrendingUp size={9} style={{ color: '#22c55e' }} /> : <TrendingDown size={9} style={{ color: '#ef4444' }} />}
          <span className="text-xs tabular-nums" style={{ color: up ? '#22c55e' : '#ef4444', fontSize: 10 }}>
            {up ? '+' : ''}{data.change24h?.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { prices, loading } = useCrypto(['solana', 'bitcoin'])
  const nav = useNavigate()

  if (loading) {
    return (
      <div className="card-sm animate-pulse-soft flex gap-4">
        <div className="h-8 flex-1 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-8 flex-1 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    )
  }

  return (
    <div className="card-sm flex flex-col gap-2" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Crypto</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Live</span>
      </div>
      <CoinRow id="solana" data={prices.solana} />
      <CoinRow id="bitcoin" data={prices.bitcoin} />
    </div>
  )
}
