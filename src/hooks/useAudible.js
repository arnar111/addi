import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = {
  credits: 11,
  nextBillingDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
  plan: 'Audible Premium Plus',
}

export function useAudible() {
  const [data, setData] = useLocalStorage('addi-audible', DEFAULTS)

  const daysUntilBilling = Math.max(0, Math.ceil(
    (new Date(data.nextBillingDate) - new Date()) / 86400000
  ))

  function updateCredits(n) {
    setData(d => ({ ...d, credits: n }))
  }

  function useCredit() {
    setData(d => ({ ...d, credits: Math.max(0, d.credits - 1) }))
  }

  function addCredit() {
    setData(d => ({ ...d, credits: d.credits + 1 }))
  }

  function updateBillingDate(date) {
    setData(d => ({ ...d, nextBillingDate: date }))
  }

  const expiringCount = data.credits > 0 && daysUntilBilling <= 7 ? 1 : 0

  return {
    credits: data.credits,
    nextBillingDate: data.nextBillingDate,
    daysUntilBilling,
    plan: data.plan,
    expiringCount,
    updateCredits,
    useCredit,
    addCredit,
    updateBillingDate,
  }
}
