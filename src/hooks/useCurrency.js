import { useState, useEffect } from 'react'

export const CURRENCY_TARGETS = [
  { code: 'EUR', label: 'Evra', flag: '🇪🇺' },
  { code: 'USD', label: 'Bandaríkjadalur', flag: '🇺🇸' },
  { code: 'GBP', label: 'Pund', flag: '🇬🇧' },
  { code: 'DKK', label: 'Danska króna', flag: '🇩🇰' },
  { code: 'NOK', label: 'Norsk króna', flag: '🇳🇴' },
  { code: 'SEK', label: 'Sænsk króna', flag: '🇸🇪' },
]

export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = localStorage.getItem('addi_rates')
    const cachedAt = localStorage.getItem('addi_rates_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    const targets = CURRENCY_TARGETS.map(c => c.code).join(',')
    fetch(`https://api.frankfurter.app/latest?from=ISK&to=${targets}`)
      .then(r => r.json())
      .then(d => {
        setRates(d.rates)
        localStorage.setItem('addi_rates', JSON.stringify(d.rates))
        localStorage.setItem('addi_rates_at', String(Date.now()))
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const convert = (amountISK, toCurrency) => {
    if (!rates || !rates[toCurrency]) return null
    return amountISK * rates[toCurrency]
  }

  return { rates, loading, error, convert }
}
