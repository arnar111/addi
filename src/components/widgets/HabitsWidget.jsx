import { useState } from 'react'
import { useHabits } from '../../hooks/useHabits'
import { Flame, Plus, X, Check } from 'lucide-react'

const COLORS = ['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ef4444', '#22c55e', '#ec4899', '#eab308']
const ICONS = ['🏋️', '📚', '💧', '🎤', '🧘', '🏃', '🥗', '😴', '💊', '🧑‍💻', '📝', '🎯', '🚴', '🏊', '⚽', '🎸']

export default function HabitsWidget() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [managing, setManaging] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00d4aa')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add(newName.trim(), newIcon, newColor)
    setNewName('')
    setNewIcon('⭐')
    setNewColor('#00d4aa')
    setShowAddForm(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <div className="flex items-center gap-2">
          <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {todayDone}/{habits.length}
          </span>
          <button onClick={() => { setManaging(m => !m); setShowAddForm(false) }}
            className="text-xs px-2 py-1 rounded-lg transition-all"
            style={{
              background: managing ? 'rgba(239,68,68,0.12)' : 'var(--surface2)',
              color: managing ? 'var(--danger)' : 'var(--muted)',
            }}>
            {managing ? 'Loka' : 'Stjórna'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <div key={h.id} className="relative">
              <button onClick={() => !managing && toggle(h.id)}
                className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all w-full"
                style={{
                  background: done ? `${h.color}1a` : 'var(--surface2)',
                  border: `1px solid ${done ? h.color + '44' : 'transparent'}`,
                  cursor: managing ? 'default' : 'pointer',
                }}>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{h.icon}</span>
                  {streak > 0 && !managing && (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                      <Flame size={11} />{streak}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight">{h.name}</span>
                {done && !managing && <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Lokið</span>}
              </button>
              {managing && (
                <button onClick={() => remove(h.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)' }}>
                  <X size={11} />
                </button>
              )}
            </div>
          )
        })}

        {managing && (
          <button onClick={() => setShowAddForm(s => !s)}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all"
            style={{
              background: showAddForm ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
              border: `1px dashed ${showAddForm ? 'rgba(0,212,170,0.4)' : 'var(--border)'}`,
              minHeight: 80,
            }}>
            <Plus size={18} style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--accent)' }}>Nýr vani</span>
          </button>
        )}
      </div>

      {managing && showAddForm && (
        <form onSubmit={handleAdd} className="mt-3 flex flex-col gap-2 animate-slide-up">
          <input className="input text-sm" placeholder="Nafn vana..." value={newName}
            onChange={e => setNewName(e.target.value)} autoFocus />
          <div className="flex flex-wrap gap-1">
            {ICONS.map(ic => (
              <button key={ic} type="button"
                onClick={() => setNewIcon(ic)}
                className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
                style={{
                  background: newIcon === ic ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                  border: `1px solid ${newIcon === ic ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                }}>
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {COLORS.map(c => (
              <button key={c} type="button"
                onClick={() => setNewColor(c)}
                className="w-6 h-6 rounded-full transition-all flex items-center justify-center"
                style={{ background: c, outline: newColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}>
                {newColor === c && <Check size={11} color="#fff" />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center text-xs py-2">
              <Plus size={12} /> Bæta við
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost text-xs py-2">
              <X size={12} />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
