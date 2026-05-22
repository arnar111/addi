import { useState, useEffect } from 'react'

export function useCurrency() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_currency')
    const cachedAt = sessionStorage.getItem('addi_currencyAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 60 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => {
        const r = d.rates
        const iskPerUSD = r.ISK || 138
        const result = {
          USD: Math.round(iskPerUSD),
          EUR: Math.round(iskPerUSD / (r.EUR || 0.92)),
          GBP: Math.round(iskPerUSD / (r.GBP || 0.79)),
          DKK: Math.round(iskPerUSD / (r.DKK || 6.9)),
          updatedAt: new Date().toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }),
        }
        sessionStorage.setItem('addi_currency', JSON.stringify(result))
        sessionStorage.setItem('addi_currencyAt', String(Date.now()))
        setRates(result)
        setLoading(false)
      })
      .catch(() => {
        setRates({ USD: 138, EUR: 150, GBP: 174, DKK: 20, updatedAt: 'offline' })
        setLoading(false)
      })
  }, [])

  return { rates, loading }
}
