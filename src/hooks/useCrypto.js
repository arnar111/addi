import { useState, useEffect } from 'react'

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('crypto')
    const cachedAt = sessionStorage.getItem('cryptoAt')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch(
      'https://api.coingecko.com/api/v3/simple/price' +
      '?ids=solana,bitcoin,ethereum' +
      '&vs_currencies=usd' +
      '&include_24hr_change=true'
    )
      .then(r => r.json())
      .then(d => {
        const result = {
          sol: {
            price: d.solana?.usd ?? 0,
            change: d.solana?.usd_24h_change ?? 0,
            symbol: 'SOL',
            icon: '◎',
            color: '#9945FF',
          },
          btc: {
            price: d.bitcoin?.usd ?? 0,
            change: d.bitcoin?.usd_24h_change ?? 0,
            symbol: 'BTC',
            icon: '₿',
            color: '#F7931A',
          },
          eth: {
            price: d.ethereum?.usd ?? 0,
            change: d.ethereum?.usd_24h_change ?? 0,
            symbol: 'ETH',
            icon: 'Ξ',
            color: '#627EEA',
          },
        }
        sessionStorage.setItem('crypto', JSON.stringify(result))
        sessionStorage.setItem('cryptoAt', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
