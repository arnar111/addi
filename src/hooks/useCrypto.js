import { useState, useEffect } from 'react'

const COINS = [
  { symbol: 'BTCUSDT', id: 'bitcoin', label: 'BTC', icon: '₿', color: '#f7931a' },
  { symbol: 'ETHUSDT', id: 'ethereum', label: 'ETH', icon: 'Ξ', color: '#627eea' },
  { symbol: 'SOLUSDT', id: 'solana', label: 'SOL', icon: '◎', color: '#9945ff' },
]

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrices = async () => {
    const cached = sessionStorage.getItem('crypto')
    const cachedAt = sessionStorage.getItem('cryptoAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    try {
      const symbols = encodeURIComponent(JSON.stringify(COINS.map(c => c.symbol)))
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`
      )
      if (!res.ok) throw new Error('Binance API failed')
      const json = await res.json()

      const prices = COINS.map(coin => {
        const ticker = json.find(t => t.symbol === coin.symbol)
        return {
          ...coin,
          price: ticker ? parseFloat(ticker.lastPrice) : null,
          change24h: ticker ? parseFloat(ticker.priceChangePercent) : null,
          high24h: ticker ? parseFloat(ticker.highPrice) : null,
          low24h: ticker ? parseFloat(ticker.lowPrice) : null,
          volume: ticker ? parseFloat(ticker.volume) : null,
        }
      })

      sessionStorage.setItem('crypto', JSON.stringify(prices))
      sessionStorage.setItem('cryptoAt', String(Date.now()))
      setData(prices)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error, lastUpdated, refresh: fetchPrices }
}
