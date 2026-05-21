import { useLocalStorage } from './useLocalStorage'

const INITIAL = []

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage('addi_tasks', INITIAL)

  const add = (text, priority = 'medium', dueDate = null) => {
    setTasks(prev => [{
      id: Date.now().toString(),
      text,
      priority,
      dueDate,
      done: false,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const toggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null } : t))
  }

  const remove = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const update = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const clearDone = () => {
    setTasks(prev => prev.filter(t => !t.done))
  }

  const today = tasks.filter(t => !t.done).slice(0, 3)
  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  return { tasks, add, toggle, remove, update, clearDone, today, pending, done }
}
