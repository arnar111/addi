import { useCrypto, formatPrice, formatChange, COINS } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'

function CoinRow({ coin, info }) {
  if (!info?.price) return null
  const up = (info.change ?? 0) >= 0
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-base w-6 text-center" style={{ color: coin.color }}>{coin.icon}</span>
        <span className="text-sm font-medium">{coin.symbol}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{formatPrice(info.price)}</span>
        <div
          className="flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full"
          style={{
            background: up ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: up ? '#22c55e' : '#ef4444',
          }}
        >
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatChange(info.change)}
        </div>
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { data, loading } = useCrypto()

  if (loading) {
    return (
      <div className="card animate-pulse-soft">
        <div className="h-3 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
        {[0, 1, 2].map(i => (
          <div key={i} className="h-8 rounded mb-1" style={{ background: 'var(--surface2)' }} />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="card" style={{ border: '1px solid rgba(249,115,22,0.15)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>CRYPTO</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>live</span>
      </div>
      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
        {COINS.map(coin => (
          <CoinRow key={coin.key} coin={coin} info={data?.[coin.key]} />
        ))}
      </div>
    </div>
  )
}
