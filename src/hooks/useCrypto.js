import { useState, useEffect } from 'react'

const COINS = [
  { id: 'solana', symbol: 'SOL', icon: '◎', color: '#9945ff' },
  { id: 'bitcoin', symbol: 'BTC', icon: '₿', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', icon: 'Ξ', color: '#627eea' },
]

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_crypto')
    const cachedAt = sessionStorage.getItem('addi_cryptoAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    const ids = COINS.map(c => c.id).join(',')
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=false`)
      .then(r => r.json())
      .then(raw => {
        const result = COINS.map(c => ({
          ...c,
          price: raw[c.id]?.usd || 0,
          change: raw[c.id]?.usd_24h_change || 0,
        }))
        sessionStorage.setItem('addi_crypto', JSON.stringify(result))
        sessionStorage.setItem('addi_cryptoAt', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const refresh = () => {
    sessionStorage.removeItem('addi_crypto')
    sessionStorage.removeItem('addi_cryptoAt')
    setLoading(true)
    setData(null)
  }

  return { data, loading, refresh }
}
