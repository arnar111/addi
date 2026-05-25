import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(`crypto_${key}`)
    if (!raw) return null
    const { v, t } = JSON.parse(raw)
    if (Date.now() - t > CACHE_MS) return null
    return v
  } catch { return null }
}

function setCache(key, v) {
  try { sessionStorage.setItem(`crypto_${key}`, JSON.stringify({ v, t: Date.now() })) } catch {}
}

export function useCrypto(coins = ['solana', 'bitcoin', 'ethereum']) {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const key = coins.join(',')
    const cached = getCache(key)
    if (cached) {
      setPrices(cached)
      setLoading(false)
      return
    }

    const ids = coins.join(',')
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=false`
    )
      .then(r => r.json())
      .then(d => {
        const result = {}
        coins.forEach(c => {
          if (d[c]) {
            result[c] = {
              price: d[c].usd,
              change24h: d[c].usd_24h_change,
            }
          }
        })
        setCache(key, result)
        setPrices(result)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { prices, loading, error }
}

export const COIN_META = {
  solana: { symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF' },
  bitcoin: { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  ethereum: { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
}

export function formatPrice(price) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (price >= 1) return `$${price.toFixed(2)}`
  return `$${price.toFixed(4)}`
}
