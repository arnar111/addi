import { useLocalStorage } from './useLocalStorage'
import { SUBSCRIPTIONS } from '../utils/currency'

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', SUBSCRIPTIONS.map(s => ({ ...s, active: true })))

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString(), active: true }])
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const update = (id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const monthlyTotal = () => {
    return subs.filter(s => s.active).reduce((sum, s) => {
      if (s.period === 'yearly') return sum + Math.round(s.amountISK / 12)
      return sum + s.amountISK
    }, 0)
  }

  const yearlyTotal = () => {
    return subs.filter(s => s.active).reduce((sum, s) => {
      if (s.period === 'yearly') return sum + s.amountISK
      return sum + s.amountISK * 12
    }, 0)
  }

  return { subs, toggle, add, remove, update, monthlyTotal, yearlyTotal }
}
