import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  {
    id: '1',
    name: 'Netlify',
    icon: '🌐',
    amount: 2500,
    status: 'error',
    note: 'Greiðsla vantar! 25 dagar til að loka.',
    nextDate: '2026-06-16',
  },
  {
    id: '2',
    name: 'Prime Video / Paramount+',
    icon: '📺',
    amount: 2490,
    status: 'error',
    note: 'Áskrift í hlé — uppfærðu greiðslumáta',
    nextDate: '2026-05-25',
  },
  {
    id: '3',
    name: 'The Athletic',
    icon: '⚽',
    amount: 1490,
    status: 'ok',
    note: '',
    nextDate: '2026-06-01',
  },
  {
    id: '4',
    name: 'Golf+',
    icon: '⛳',
    amount: 990,
    status: 'ok',
    note: '',
    nextDate: '2026-06-01',
  },
  {
    id: '5',
    name: 'LinkedIn Premium',
    icon: '💼',
    amount: 8500,
    status: 'ok',
    note: '',
    nextDate: '2026-06-15',
  },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (name, icon, amount, status = 'ok', note = '', nextDate = '') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name,
      icon: icon || '📱',
      amount: Number(amount),
      status,
      note,
      nextDate,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const updateStatus = (id, status, note = '') => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status, note } : s))
  }

  const monthlyTotal = () => subs.reduce((sum, s) => sum + s.amount, 0)
  const alerts = subs.filter(s => s.status !== 'ok')

  return { subs, add, remove, updateStatus, monthlyTotal, alerts }
}
