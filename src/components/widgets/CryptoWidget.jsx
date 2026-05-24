import { useCrypto } from '../../hooks/useCrypto'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function CoinRow({ coin }) {
  const isUp = coin.change_24h >= 0
  const fmtUsd = (n) => n != null
    ? '$' + n.toLocaleString('en-US', { minimumFractionDigits: n >= 1000 ? 0 : 2, maximumFractionDigits: n >= 1000 ? 0 : 2 })
    : '—'

  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
             style={{ background: `${coin.color}22`, color: coin.color }}>
          {coin.icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{coin.symbol}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{coin.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold tabular-nums">{fmtUsd(coin.price_usd)}</div>
        <div className="text-xs flex items-center justify-end gap-0.5 tabular-nums"
             style={{ color: isUp ? 'var(--success)' : 'var(--danger)' }}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(coin.change_24h ?? 0).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export default function CryptoWidget() {
  const { data, loading, lastUpdated, refresh } = useCrypto()

  if (loading) return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>KRYPTÓ</span>
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
            <div className="flex-1">
              <div className="h-3 w-16 rounded mb-1.5 animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
              <div className="h-2.5 w-10 rounded animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
            </div>
            <div className="text-right">
              <div className="h-3 w-20 rounded mb-1.5 animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
              <div className="h-2.5 w-12 rounded animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>KRYPTÓ · 24H BREYTING</span>
        <button onClick={refresh} className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                title="Uppfæra verð">
          <RefreshCw size={12} />
        </button>
      </div>

      {data ? (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {data.map(coin => <CoinRow key={coin.id} coin={coin} />)}
        </div>
      ) : (
        <div className="py-4 text-center text-sm" style={{ color: 'var(--muted)' }}>
          Gat ekki sótt verð — athugaðu nettengingu
        </div>
      )}

      {lastUpdated && (
        <div className="mt-2 text-xs text-right" style={{ color: 'var(--muted)' }}>
          Uppfært {new Date(lastUpdated).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
