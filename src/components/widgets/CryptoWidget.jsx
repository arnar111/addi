import { useCrypto } from '../../hooks/useCrypto'

const COINS = [
  { key: 'sol', symbol: 'SOL', color: '#9945FF', icon: '◎', name: 'Solana' },
  { key: 'btc', symbol: 'BTC', color: '#f97316', icon: '₿', name: 'Bitcoin' },
  { key: 'eth', symbol: 'ETH', color: '#627EEA', icon: 'Ξ', name: 'Ethereum' },
]

function fmtPrice(p) {
  if (!p) return '—'
  if (p >= 10000) return '$' + Math.round(p).toLocaleString('en')
  if (p >= 100) return '$' + p.toLocaleString('en', { maximumFractionDigits: 1 })
  return '$' + p.toFixed(2)
}

export default function CryptoWidget() {
  const { data, loading } = useCrypto()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />
        ))}
      </div>
    </div>
  )

  if (!data) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Crypto</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Live · USD</span>
      </div>
      <div className="flex gap-2">
        {COINS.map(({ key, symbol, color, icon }) => {
          const coin = data[key]
          const up = (coin?.change ?? 0) >= 0
          return (
            <div key={key} className="flex-1 flex flex-col gap-1 p-2.5 rounded-xl"
                 style={{ background: `${color}11`, border: `1px solid ${color}22` }}>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold leading-none" style={{ color }}>{icon}</span>
                <span className="text-xs font-semibold leading-none"
                      style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                  {up ? '+' : ''}{coin?.change?.toFixed(1) ?? '—'}%
                </span>
              </div>
              <div className="text-xs font-bold">{fmtPrice(coin?.price)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{symbol}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
