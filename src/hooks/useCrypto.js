import { useState, useEffect } from 'react'

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627eea' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945ff' },
]

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrices = async (force = false) => {
    const cached = sessionStorage.getItem('addi_crypto')
    const cachedAt = sessionStorage.getItem('addi_cryptoAt')
    if (!force && cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLastUpdated(Number(cachedAt))
      setLoading(false)
      return
    }

    try {
      const ids = COINS.map(c => c.id).join(',')
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,isk&include_24hr_change=true&include_market_cap=false`
      )
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()

      const result = COINS.map(coin => ({
        ...coin,
        price_usd: json[coin.id]?.usd ?? null,
        price_isk: json[coin.id]?.isk ?? null,
        change_24h: json[coin.id]?.usd_24h_change ?? 0,
      }))

      sessionStorage.setItem('addi_crypto', JSON.stringify(result))
      sessionStorage.setItem('addi_cryptoAt', String(Date.now()))
      setData(result)
      setLastUpdated(Date.now())
    } catch {
      const cached = sessionStorage.getItem('addi_crypto')
      if (cached) setData(JSON.parse(cached))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPrices() }, [])

  return { data, loading, lastUpdated, refresh: () => fetchPrices(true) }
}
