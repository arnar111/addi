import { useState, useEffect } from 'react'

const CACHE_KEY = 'crypto_cache'
const CACHE_DURATION = 5 * 60 * 1000

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_DURATION) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(
      'https://api.coingecko.com/api/v3/simple/price' +
      '?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
    )
      .then(r => r.json())
      .then(d => {
        const result = {
          sol: { price: d.solana?.usd, change: d.solana?.usd_24h_change },
          btc: { price: d.bitcoin?.usd, change: d.bitcoin?.usd_24h_change },
          eth: { price: d.ethereum?.usd, change: d.ethereum?.usd_24h_change },
        }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
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
