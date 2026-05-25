import { useCrypto } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown } from 'lucide-react'

function CoinRow({ coin }) {
  const up = coin.change >= 0
  return (
    <div className="flex items-center justify-between py-2.5"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
             style={{ background: `${coin.color}22`, color: coin.color }}>
          {coin.icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{coin.symbol}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-sm font-semibold">
          ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium`}
             style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(coin.change).toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { data, loading } = useCrypto()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      {[1, 2, 3].map(i => (
        <div key={i} className="h-10 rounded mb-2" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  if (!data) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">Crypto</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Live · CoinGecko</span>
      </div>
      <div className="flex flex-col">
        <CoinRow coin={data.sol} />
        <CoinRow coin={data.btc} />
        <div className="flex items-center justify-between pt-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 style={{ background: `${data.eth.color}22`, color: data.eth.color }}>
              {data.eth.icon}
            </div>
            <div className="text-sm font-semibold">{data.eth.symbol}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-semibold">
              ${data.eth.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className={`flex items-center gap-0.5 text-xs font-medium`}
                 style={{ color: data.eth.change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {data.eth.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(data.eth.change).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
