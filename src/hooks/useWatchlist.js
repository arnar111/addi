import { useLocalStorage } from './useLocalStorage'

export const WATCH_STATUSES = [
  { id: 'want', label: 'Vil sjá', color: '#8b5cf6' },
  { id: 'watching', label: 'Er að sjá', color: '#f97316' },
  { id: 'watched', label: 'Séð', color: '#22c55e' },
]

export const WATCH_TYPES = [
  { id: 'movie', label: 'Kvikmynd', icon: '🎬' },
  { id: 'series', label: 'Þáttaröð', icon: '📺' },
  { id: 'documentary', label: 'Heimildarmynd', icon: '🎥' },
]

const SEEDS = [
  { id: 's1', title: 'Sinners', type: 'movie', status: 'want', note: '', rating: null, added: '2026-05-01', genre: 'Horror' },
  { id: 's2', title: 'Adolescence', type: 'series', status: 'want', note: '', rating: null, added: '2026-05-01', genre: 'Drama' },
  { id: 's3', title: 'The White Lotus S3', type: 'series', status: 'watching', note: 'Thailand season', rating: null, added: '2026-04-15', genre: 'Drama' },
]

export function useWatchlist() {
  const [items, setItems] = useLocalStorage('addi_watchlist', SEEDS)

  const add = (title, type = 'movie', note = '', genre = '') => {
    setItems(prev => [{
      id: Date.now().toString(),
      title,
      type,
      status: 'want',
      note,
      rating: null,
      genre,
      added: new Date().toISOString().split('T')[0],
    }, ...prev])
  }

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateStatus = (id, status) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))

  const updateRating = (id, rating) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, rating } : i))

  const updateNote = (id, note) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, note } : i))

  const byStatus = (status) => items.filter(i => i.status === status)

  return { items, add, remove, updateStatus, updateRating, updateNote, byStatus }
}
