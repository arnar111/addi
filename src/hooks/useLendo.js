import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MONTHLY_GOAL = 200000

const DEFAULT_ITEMS = [
  { id: 'table_set', name: 'Borð + 10 stólar', price: 7000, icon: '🪑' },
  { id: 'tent', name: 'Stan', price: 15000, icon: '⛺' },
  { id: 'bbq', name: 'Grillbúnaður', price: 5000, icon: '🔥' },
  { id: 'speaker', name: 'Hljóðtæki', price: 8000, icon: '🔊' },
  { id: 'projector', name: 'Skjávarp', price: 10000, icon: '📽️' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [items, setItems] = useLocalStorage('lendo_items', DEFAULT_ITEMS)
  const [goal, setGoal] = useLocalStorage('lendo_goal', MONTHLY_GOAL)

  const addBooking = useCallback((itemId, price, date, note = '') => {
    const item = items.find(i => i.id === itemId)
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      itemName: item?.name || itemId,
      itemIcon: item?.icon || '📦',
      price: Number(price),
      date: date || new Date().toISOString().split('T')[0],
      note,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }, [items, setBookings])

  const removeBooking = useCallback(id => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }, [setBookings])

  const addItem = useCallback((name, price, icon = '📦') => {
    const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
    setItems(prev => [...prev, { id, name, price: Number(price), icon }])
  }, [setItems])

  const monthlyRevenue = useCallback((date = new Date()) => {
    const month = date.getMonth()
    const year = date.getFullYear()
    return bookings
      .filter(b => {
        const d = new Date(b.date)
        return d.getMonth() === month && d.getFullYear() === year
      })
      .reduce((sum, b) => sum + b.price, 0)
  }, [bookings])

  const recentBookings = bookings.slice(0, 10)

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0)

  const thisMonthBookings = bookings.filter(b => {
    const d = new Date(b.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const streak = (() => {
    if (bookings.length === 0) return 0
    const dates = [...new Set(bookings.map(b => b.date))].sort().reverse()
    let count = 0
    let check = new Date()
    for (const d of dates) {
      const bd = new Date(d)
      const diff = Math.floor((check - bd) / 86400000)
      if (diff <= 1) { count++; check = bd }
      else break
    }
    return count
  })()

  return {
    bookings,
    recentBookings,
    items,
    goal,
    setGoal,
    addBooking,
    removeBooking,
    addItem,
    monthlyRevenue,
    thisMonthBookings,
    totalRevenue,
    streak,
  }
}
