import { useCrypto } from '../../hooks/useCrypto'
import { usePortfolio } from '../../hooks/usePortfolio'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

function CoinRow({ coin, value }) {
  const isUp = coin.change24h >= 0
  return (
    <div className="flex items-center justify-between py-2.5"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
             style={{ background: `${coin.color}22`, color: coin.color }}>
          {coin.icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{coin.symbol}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{coin.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold tabular-nums">
          ${coin.price >= 1000
            ? coin.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : coin.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-0.5 justify-end"
             style={{ color: isUp ? 'var(--success)' : 'var(--danger)' }}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span className="text-xs font-medium">{Math.abs(coin.change24h).toFixed(2)}%</span>
        </div>
        {value > 0 && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { prices, loading, lastUpdated, refetch } = useCrypto()
  const { holdings, coinValue, totalValue } = usePortfolio()
  const portfolioTotal = totalValue(prices)
  const hasHoldings = holdings.some(h => h.amount > 0)

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="flex flex-col gap-2">
        {[0,1,2].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  if (!prices) return null

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.06), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Crypto</h3>
          {hasHoldings && (
            <span className="badge text-xs font-semibold"
                  style={{ background: 'rgba(153,69,255,0.15)', color: '#9945FF' }}>
              ${portfolioTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <button onClick={refetch} style={{ color: 'var(--muted)' }}>
              <RefreshCw size={12} />
            </button>
          )}
          <Link to="/crypto" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col" style={{ marginTop: 4 }}>
        {Object.values(prices).map(coin => (
          <CoinRow
            key={coin.id}
            coin={coin}
            value={coinValue(coin.id, prices)}
          />
        ))}
      </div>

      {lastUpdated && (
        <div className="text-xs mt-2 text-right" style={{ color: 'var(--muted)' }}>
          Uppfært {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
