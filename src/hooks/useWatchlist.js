import { useLocalStorage } from './useLocalStorage'

export const WATCH_STATUSES = [
  { id: 'want', label: 'Óséð', icon: '📌', color: '#8b5cf6' },
  { id: 'watching', label: 'Í horfun', icon: '▶️', color: '#f97316' },
  { id: 'watched', label: 'Séð', icon: '✅', color: '#22c55e' },
]

export const WATCH_TYPES = [
  { id: 'film', label: 'Kvikmynd', icon: '🎬' },
  { id: 'tv', label: 'Sjónvarpsþáttur', icon: '📺' },
  { id: 'doc', label: 'Heimildarmynd', icon: '🎥' },
]

const SEEDS = [
  { id: 's1', title: 'Vertigo', year: 1958, type: 'film', status: 'want', rating: null, genre: 'Þriller', notes: '', addedAt: new Date().toISOString() },
  { id: 's2', title: 'Tokyo Story', year: 1953, type: 'film', status: 'want', rating: null, genre: 'Drama', notes: '', addedAt: new Date().toISOString() },
  { id: 's3', title: 'Rebecca', year: 1940, type: 'film', status: 'want', rating: null, genre: 'Þriller', notes: 'Popcorn in Bed mælt með', addedAt: new Date().toISOString() },
]

export function useWatchlist() {
  const [items, setItems] = useLocalStorage('addi_watchlist', SEEDS)

  const add = ({ title, year, type = 'film', genre, notes, status = 'want' }) => {
    setItems(prev => [{
      id: Date.now().toString(),
      title,
      year: year ? Number(year) : null,
      type,
      genre,
      notes,
      status,
      rating: null,
      addedAt: new Date().toISOString(),
      watchedAt: null,
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, status, watchedAt: status === 'watched' ? new Date().toISOString() : i.watchedAt }
      : i
    ))
  }

  const setRating = (id, rating) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, rating } : i))
  }

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const byStatus = (s) => items.filter(i => i.status === s)
  const wantCount = items.filter(i => i.status === 'want').length

  return { items, add, updateStatus, setRating, remove, byStatus, wantCount }
}
