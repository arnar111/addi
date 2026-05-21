import { useState, useEffect } from 'react'

const PAIRS = [
  { code: 'USD', label: 'Bandaríkjadalur', flag: '🇺🇸' },
  { code: 'EUR', label: 'Evra', flag: '🇪🇺' },
  { code: 'GBP', label: 'Sterlingspund', flag: '🇬🇧' },
  { code: 'DKK', label: 'Danskar krónur', flag: '🇩🇰' },
  { code: 'NOK', label: 'Norskar krónur', flag: '🇳🇴' },
  { code: 'SEK', label: 'Sænskar krónur', flag: '🇸🇪' },
]

export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('currency')
    const cachedAt = sessionStorage.getItem('currencyAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setUpdatedAt(Number(cachedAt))
      setLoading(false)
      return
    }

    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/isk.json')
      .then(r => r.json())
      .then(d => {
        const iskRates = d.isk
        const result = {}
        PAIRS.forEach(p => {
          const rate = iskRates[p.code.toLowerCase()]
          if (rate) result[p.code] = Math.round(1 / rate)
        })
        sessionStorage.setItem('currency', JSON.stringify(result))
        sessionStorage.setItem('currencyAt', String(Date.now()))
        setRates(result)
        setUpdatedAt(Date.now())
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { rates, loading, pairs: PAIRS, updatedAt }
}
