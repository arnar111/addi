import { useState } from 'react'
import { useCrypto } from '../hooks/useCrypto'
import { usePortfolio } from '../hooks/usePortfolio'
import { TrendingUp, TrendingDown, RefreshCw, Edit2, Check, X } from 'lucide-react'

function formatPrice(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (price >= 100) return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return price.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

function CoinCard({ coin, holding, onUpdateAmount, value }) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(String(holding?.amount || 0))
  const isUp = coin.change24h >= 0

  const save = () => {
    onUpdateAmount(coin.id, input)
    setEditing(false)
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
               style={{ background: `${coin.color}22`, color: coin.color }}>
            {coin.icon}
          </div>
          <div>
            <div className="font-semibold">{coin.name}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>{coin.symbol}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold tabular-nums">${formatPrice(coin.price)}</div>
          <div className={`flex items-center gap-0.5 justify-end text-sm`}
               style={{ color: isUp ? 'var(--success)' : 'var(--danger)' }}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(coin.change24h).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Eign mín</div>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="input text-sm py-1 w-28"
                type="number"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && save()}
              />
              <button onClick={save} style={{ color: 'var(--success)' }}><Check size={16} /></button>
              <button onClick={() => setEditing(false)} style={{ color: 'var(--muted)' }}><X size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{holding?.amount || 0} {coin.symbol}</span>
              <button onClick={() => { setInput(String(holding?.amount || 0)); setEditing(true) }}
                      style={{ color: 'var(--muted)' }}>
                <Edit2 size={13} />
              </button>
            </div>
          )}
        </div>
        {value > 0 && (
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Virði</div>
            <div className="font-semibold" style={{ color: coin.color }}>
              ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="p-2 rounded-xl text-xs" style={{ background: 'var(--surface2)' }}>
          <div style={{ color: 'var(--muted)' }}>24h há</div>
          <div className="font-semibold mt-0.5">${formatPrice(coin.high24h)}</div>
        </div>
        <div className="p-2 rounded-xl text-xs" style={{ background: 'var(--surface2)' }}>
          <div style={{ color: 'var(--muted)' }}>24h lá</div>
          <div className="font-semibold mt-0.5">${formatPrice(coin.low24h)}</div>
        </div>
      </div>
    </div>
  )
}

export default function Crypto() {
  const { prices, loading, error, lastUpdated, refetch } = useCrypto()
  const { holdings, updateAmount, totalValue, coinValue } = usePortfolio()
  const total = totalValue(prices)
  const hasHoldings = holdings.some(h => h.amount > 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Crypto</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {lastUpdated
              ? `Uppfært ${lastUpdated.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}`
              : 'Hleður...'}
          </p>
        </div>
        <button onClick={refetch} className="btn btn-ghost" title="Uppfæra">
          <RefreshCw size={16} />
        </button>
      </div>

      {hasHoldings && prices && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.1), rgba(0,212,170,0.08))' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarvirði eigna</div>
          <div className="text-3xl font-semibold" style={{ color: '#9945FF' }}>
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            ≈ {(total * 138).toLocaleString('is-IS', { maximumFractionDigits: 0 })} kr
          </div>
        </div>
      )}

      {error && (
        <div className="card text-sm" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
          Villa við að sækja verð. Athugaðu tengingu.
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0,1,2].map(i => (
            <div key={i} className="card animate-pulse-soft">
              <div className="h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />
            </div>
          ))}
        </div>
      ) : prices ? (
        <div className="flex flex-col gap-3">
          {Object.values(prices).map(coin => {
            const holding = holdings.find(h => h.symbol === coin.id)
            return (
              <CoinCard
                key={coin.id}
                coin={coin}
                holding={holding}
                onUpdateAmount={updateAmount}
                value={coinValue(coin.id, prices)}
              />
            )
          })}
        </div>
      ) : null}

      <div className="card text-center" style={{ border: '1px solid rgba(153,69,255,0.2)' }}>
        <div className="text-sm font-medium mb-1" style={{ color: '#9945FF' }}>◎ Solana</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Verð frá Binance · Uppfærist á 60 sekúndna fresti
        </p>
      </div>
    </div>
  )
}
