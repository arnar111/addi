import { useState, useEffect } from 'react'

const PAIRS = [
  { code: 'EUR', flag: '🇪🇺', label: 'Euro' },
  { code: 'USD', flag: '🇺🇸', label: 'Dollar' },
  { code: 'DKK', flag: '🇩🇰', label: 'DKK' },
  { code: 'GBP', flag: '🇬🇧', label: 'Pund' },
  { code: 'NOK', flag: '🇳🇴', label: 'NOK' },
]

export { PAIRS as CURRENCY_PAIRS }

export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_fx')
    const cachedAt = sessionStorage.getItem('addi_fx_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 4 * 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setUpdatedAt(Number(cachedAt))
      setLoading(false)
      return
    }
    fetch('https://api.frankfurter.app/latest?from=ISK&to=EUR,USD,DKK,GBP,NOK')
      .then(r => r.json())
      .then(d => {
        sessionStorage.setItem('addi_fx', JSON.stringify(d.rates))
        sessionStorage.setItem('addi_fx_at', String(Date.now()))
        setRates(d.rates)
        setUpdatedAt(Date.now())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const convert = (isk, currency) => {
    if (!rates || !rates[currency]) return null
    return Math.round(isk * rates[currency] * 100) / 100
  }

  return { rates, loading, convert, updatedAt, pairs: PAIRS }
}
