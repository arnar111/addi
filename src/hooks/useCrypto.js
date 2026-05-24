import { useState, useEffect, useCallback } from 'react'

const COIN_META = {
  SOLUSDT: { symbol: 'SOL', name: 'Solana', color: '#9945FF', icon: '◎' },
  BTCUSDT: { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: '₿' },
  ETHUSDT: { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'Ξ' },
}

export const TRACKED = ['SOLUSDT', 'BTCUSDT', 'ETHUSDT']

export function useCrypto() {
  const [prices, setPrices] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrices = useCallback(async () => {
    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(TRACKED))}`
      const res = await fetch(url)
      const data = await res.json()
      const result = {}
      data.forEach(item => {
        const meta = COIN_META[item.symbol]
        if (meta) {
          result[item.symbol] = {
            ...meta,
            id: item.symbol,
            price: parseFloat(item.lastPrice),
            change24h: parseFloat(item.priceChangePercent),
            high24h: parseFloat(item.highPrice),
            low24h: parseFloat(item.lowPrice),
            volume: parseFloat(item.quoteVolume),
          }
        }
      })
      setPrices(result)
      setLastUpdated(new Date())
      setLoading(false)
      setError(null)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, loading, error, lastUpdated, refetch: fetchPrices }
}
