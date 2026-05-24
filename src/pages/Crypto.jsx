import { useState } from 'react'
import { useCrypto } from '../hooks/useCrypto'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TrendingUp, TrendingDown, RefreshCw, Edit2, Check, ExternalLink } from 'lucide-react'

const CRYPTO_LINKS = [
  { label: 'Solana Explorer', url: 'https://explorer.solana.com', icon: '◎' },
  { label: 'CoinGecko', url: 'https://www.coingecko.com', icon: '🦎' },
  { label: 'DeFiLlama', url: 'https://defillama.com', icon: '🦙' },
  { label: 'Dune Analytics', url: 'https://dune.com', icon: '📊' },
  { label: 'Jupiter', url: 'https://jup.ag', icon: '🪐' },
]

export default function Crypto() {
  const { data, loading, refresh } = useCrypto()
  const [portfolio, setPortfolio] = useLocalStorage('addi_crypto_portfolio', [
    { coinId: 'solana', amount: 0 },
    { coinId: 'bitcoin', amount: 0 },
    { coinId: 'ethereum', amount: 0 },
  ])
  const [editingId, setEditingId] = useState(null)
  const [editVal, setEditVal] = useState('')

  const getPrice = (id) => data?.find(d => d.id === id)?.price || 0
  const getHolding = (id) => portfolio.find(p => p.coinId === id)?.amount || 0

  const totalUSD = portfolio.reduce((s, p) => s + (p.amount * getPrice(p.coinId)), 0)
  const hasPortfolio = totalUSD > 0

  const startEdit = (coinId, current) => {
    setEditingId(coinId)
    setEditVal(current > 0 ? String(current) : '')
  }

  const saveEdit = (coinId) => {
    const amt = parseFloat(editVal) || 0
    setPortfolio(prev => prev.map(p => p.coinId === coinId ? { ...p, amount: amt } : p))
    setEditingId(null)
    setEditVal('')
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Krypto</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>SOL · BTC · ETH</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost text-xs gap-1.5 py-1.5">
          <RefreshCw size={13} /> Uppfæra
        </button>
      </div>

      {/* Portfolio total */}
      {hasPortfolio && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.1), rgba(0,212,170,0.08))' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarverðmæti</div>
          <div className="text-3xl font-bold">${totalUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Breyttu magni með því að smella á mynt hér að neðan
          </div>
        </div>
      )}

      {/* Coin cards */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft" style={{ height: 88 }} />
          ))
        ) : data?.map(coin => {
          const holding = getHolding(coin.id)
          const value = holding * coin.price
          const up = coin.change >= 0
          const isEditing = editingId === coin.id

          return (
            <div key={coin.id} className="card">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
                     style={{ background: `${coin.color}18`, color: coin.color }}>
                  {coin.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-base">{coin.symbol}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {coin.id.charAt(0).toUpperCase() + coin.id.slice(1)}
                    </span>
                  </div>
                  <div className="text-xl font-bold">
                    ${coin.price >= 1000
                      ? coin.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
                      : coin.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-1 text-xs"
                       style={{ color: up ? 'var(--success)' : 'var(--danger)' }}>
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {up ? '+' : ''}{coin.change.toFixed(2)}% síðustu 24 klst
                  </div>
                </div>

                {/* Portfolio amount */}
                <div className="flex flex-col items-end shrink-0 gap-1">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="input text-xs text-right"
                        style={{ width: 80, padding: '6px 8px' }}
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveEdit(coin.id)}
                        placeholder="0"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(coin.id)} className="btn btn-primary" style={{ padding: '6px 8px' }}>
                        <Check size={13} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {value > 0 && (
                        <div className="text-sm font-semibold">
                          ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </div>
                      )}
                      {holding > 0 && (
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>
                          {holding} {coin.symbol}
                        </div>
                      )}
                      <button
                        onClick={() => startEdit(coin.id, holding)}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: 'var(--accent)' }}>
                        <Edit2 size={11} />
                        {holding > 0 ? 'Breyta' : '+ Bæta við'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Solana dev links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Solana & DeFi hlekkir</h3>
        <div className="flex flex-col gap-1.5">
          {CRYPTO_LINKS.map(link => (
            <a key={link.url}
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-3 p-3 rounded-xl"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-lg shrink-0 font-bold" style={{ color: '#9945ff' }}>{link.icon}</span>
              <span className="text-sm font-medium flex-1">{link.label}</span>
              <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
        Verð frá CoinGecko · Uppfært á 5 mín fresti
      </p>
    </div>
  )
}
