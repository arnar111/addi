import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch_ = () => {
    setLoading(true)
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin&vs_currencies=usd&include_24hr_change=true')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLastUpdated(new Date())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetch_()
    const t = setInterval(fetch_, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  return { data, loading, refresh: fetch_, lastUpdated }
}

function CoinRow({ name, symbol, price, change24h, color }) {
  const up = change24h >= 0
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
           style={{ background: `${color}22`, color }}>
        {symbol === 'SOL' ? '◎' : '₿'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{symbol}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">${price?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
        <div className="flex items-center justify-end gap-0.5 text-xs font-medium"
             style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change24h)?.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { data, loading, refresh, lastUpdated } = useCrypto()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Crypto</h3>
        <button onClick={refresh} style={{ color: 'var(--muted)', padding: 2 }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && !data ? (
        <div className="flex flex-col gap-2">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-2 animate-pulse-soft">
              <div className="w-8 h-8 rounded-xl" style={{ background: 'var(--surface2)' }} />
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-3.5 w-20 rounded" style={{ background: 'var(--surface2)' }} />
                <div className="h-3 w-12 rounded" style={{ background: 'var(--surface2)' }} />
              </div>
              <div className="flex flex-col gap-1 items-end">
                <div className="h-3.5 w-16 rounded" style={{ background: 'var(--surface2)' }} />
                <div className="h-3 w-10 rounded" style={{ background: 'var(--surface2)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : !data ? (
        <p className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Gat ekki sótt verð</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <CoinRow
            name="Solana" symbol="SOL" color="#9945FF"
            price={data.solana?.usd}
            change24h={data.solana?.usd_24h_change}
          />
          <div style={{ height: 1, background: 'var(--border)' }} />
          <CoinRow
            name="Bitcoin" symbol="BTC" color="#f97316"
            price={data.bitcoin?.usd}
            change24h={data.bitcoin?.usd_24h_change}
          />
        </div>
      )}

      {lastUpdated && (
        <div className="text-xs mt-2.5 text-right" style={{ color: 'var(--muted)' }}>
          {lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
