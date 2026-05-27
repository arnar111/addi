import { useState, useEffect } from 'react'

const CACHE_KEY = 'addi_crypto'
const CACHE_TTL = 60 * 1000 // 1 min

const COINS = [
  { id: 'bitcoin', key: 'btc', symbol: 'BTC', icon: '₿', color: '#f7931a' },
  { id: 'solana', key: 'sol', symbol: 'SOL', icon: '◎', color: '#9945ff' },
  { id: 'ethereum', key: 'eth', symbol: 'ETH', icon: 'Ξ', color: '#627eea' },
]

export { COINS }

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = () => {
    const ids = COINS.map(c => c.id).join(',')
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    )
      .then(r => r.json())
      .then(raw => {
        const parsed = {}
        COINS.forEach(c => {
          parsed[c.key] = {
            price: raw[c.id]?.usd ?? null,
            change: raw[c.id]?.usd_24h_change ?? null,
            symbol: c.symbol,
            icon: c.icon,
            color: c.color,
          }
        })
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setData(parsed)
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch_()
  }, [])

  return { data, loading }
}

export function formatPrice(price) {
  if (!price) return '—'
  if (price >= 1000) return `$${(price / 1000).toFixed(1)}k`
  return `$${price.toFixed(2)}`
}

export function formatChange(change) {
  if (change == null) return '—'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}
