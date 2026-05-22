import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_SUBSCRIPTIONS } from '../utils/subscriptions'

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBSCRIPTIONS)

  const addSub = useCallback((sub) => {
    setSubs(prev => [...prev, { ...sub, id: `sub_${Date.now()}` }])
  }, [setSubs])

  const updateSub = useCallback((id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [setSubs])

  const removeSub = useCallback((id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }, [setSubs])

  const toggleActive = useCallback((id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }, [setSubs])

  return { subs, addSub, updateSub, removeSub, toggleActive }
}
