import { useLocalStorage } from './useLocalStorage'

const USD_ISK = 140
const EUR_ISK = 155
const GBP_ISK = 178

const INITIAL_SUBS = [
  { id: 'netflix', name: 'Netflix', icon: '🎬', amount: 17.99, currency: 'USD', period: 'monthly', status: 'failing', color: '#E50914', category: 'Afþreying', renewDay: 1 },
  { id: 'claude', name: 'Claude Pro', icon: '🤖', amount: 100, currency: 'USD', period: 'monthly', status: 'failing', color: '#CC785C', category: 'AI', renewDay: 3 },
  { id: 'chatgpt', name: 'ChatGPT Plus', icon: '💬', amount: 20, currency: 'USD', period: 'monthly', status: 'failing', color: '#74aa9c', category: 'AI', renewDay: 7 },
  { id: 'mimo', name: 'Mimo', icon: '💻', amount: 19.99, currency: 'EUR', period: 'monthly', status: 'failing', color: '#6C5CE7', category: 'Nám', renewDay: 2 },
  { id: 'chegg', name: 'Chegg', icon: '📚', amount: 19.99, currency: 'USD', period: 'monthly', status: 'failing', color: '#F7941E', category: 'Nám', renewDay: 15 },
  { id: 'driver-booster', name: 'Driver Booster PRO', icon: '🖥️', amount: 31.78, currency: 'USD', period: 'yearly', status: 'failing', color: '#0078d4', category: 'Hugbúnaður', renewDay: 15 },
  { id: 'netlify', name: 'Netlify Pro', icon: '🚀', amount: 20, currency: 'USD', period: 'monthly', status: 'active', color: '#00C7B7', category: 'Þróun', renewDay: 12 },
  { id: 'gcloud', name: 'Google Cloud', icon: '☁️', amount: 9.92, currency: 'USD', period: 'monthly', status: 'active', color: '#4285F4', category: 'Þróun', renewDay: 1 },
  { id: 'xbox', name: 'Xbox Game Pass', icon: '🎮', amount: 15.99, currency: 'USD', period: 'monthly', status: 'active', color: '#107C10', category: 'Leikir', renewDay: 10 },
  { id: 'golfplus', name: 'Golf+ VR', icon: '⛳', amount: 9.99, currency: 'USD', period: 'monthly', status: 'active', color: '#22c55e', category: 'Leikir', renewDay: 20 },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', INITIAL_SUBS)

  const toMonthlyISK = (s) => {
    const rate = s.currency === 'EUR' ? EUR_ISK : s.currency === 'GBP' ? GBP_ISK : USD_ISK
    const monthly = s.period === 'yearly' ? s.amount / 12 : s.amount
    return Math.round(monthly * rate)
  }

  const monthlyISK = subs
    .filter(s => s.status !== 'cancelled')
    .reduce((acc, s) => acc + toMonthlyISK(s), 0)

  const failingISK = subs
    .filter(s => s.status === 'failing')
    .reduce((acc, s) => acc + toMonthlyISK(s), 0)

  const failing = subs.filter(s => s.status === 'failing')
  const active = subs.filter(s => s.status === 'active')
  const cancelled = subs.filter(s => s.status === 'cancelled')

  const setStatus = (id, status) =>
    setSubs(prev => prev.map(s => (s.id === id ? { ...s, status } : s)))

  const add = (sub) =>
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])

  const remove = (id) =>
    setSubs(prev => prev.filter(s => s.id !== id))

  const update = (id, fields) =>
    setSubs(prev => prev.map(s => (s.id === id ? { ...s, ...fields } : s)))

  return { subs, failing, active, cancelled, monthlyISK, failingISK, toMonthlyISK, setStatus, add, remove, update }
}
