import { useState, useEffect } from 'react'

const COINS = [
  { id: 'solana', symbol: 'SOL', color: '#9945ff' },
  { id: 'bitcoin', symbol: 'BTC', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', color: '#627eea' },
]

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('crypto')
    const cachedAt = sessionStorage.getItem('cryptoAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
    )
      .then(r => r.json())
      .then(d => {
        const result = COINS.map(c => ({
          ...c,
          price: d[c.id]?.usd ?? null,
          change: d[c.id]?.usd_24h_change ?? null,
        }))
        sessionStorage.setItem('crypto', JSON.stringify(result))
        sessionStorage.setItem('cryptoAt', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
