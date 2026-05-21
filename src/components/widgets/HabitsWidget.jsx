import { useState } from 'react'
import { useHabits } from '../../hooks/useHabits'
import { Flame, Plus, X, Settings2 } from 'lucide-react'

const PRESET_COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899', '#22c55e', '#ef4444', '#eab308']

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone, add, remove } = useHabits()
  const [editMode, setEditMode] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('⭐')
  const [newColor, setNewColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add(newName.trim(), newIcon, newColor)
    setNewName('')
    setNewIcon('⭐')
    setNewColor('#00d4aa')
    setShowAddForm(false)
  }

  const handleEditToggle = () => {
    setEditMode(v => !v)
    setShowAddForm(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Vanur</h3>
          <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {todayDone}/{habits.length}
          </span>
        </div>
        <button
          onClick={handleEditToggle}
          className="p-1.5 rounded-lg transition-all"
          style={{
            color: editMode ? 'var(--accent)' : 'var(--muted)',
            background: editMode ? 'rgba(0,212,170,0.1)' : 'transparent',
          }}
        >
          <Settings2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <div key={h.id} className="relative">
              <button
                onClick={() => !editMode && toggle(h.id)}
                className="w-full flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all"
                style={{
                  background: done ? `${h.color}1a` : 'var(--surface2)',
                  border: `1px solid ${done ? h.color + '44' : 'transparent'}`,
                  cursor: editMode ? 'default' : 'pointer',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{h.icon}</span>
                  {streak > 0 && !editMode && (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                      <Flame size={11} />{streak}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight">{h.name}</span>
                {done && !editMode && (
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Lokið</span>
                )}
              </button>
              {editMode && (
                <button
                  onClick={() => remove(h.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--danger)', color: '#fff' }}
                >
                  <X size={11} />
                </button>
              )}
            </div>
          )
        })}

        {editMode && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all"
            style={{ background: 'var(--surface2)', border: '1px dashed var(--border)', minHeight: 80 }}
          >
            <Plus size={18} style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Bæta við</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mt-3 flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
          style={{ background: 'var(--surface2)' }}
        >
          <div className="flex gap-2">
            <input
              className="input text-sm text-center"
              style={{ width: 52 }}
              value={newIcon}
              onChange={e => setNewIcon(e.target.value)}
              placeholder="🌟"
              maxLength={2}
            />
            <input
              className="input text-sm flex-1"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nafn vana..."
              autoFocus
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className="w-6 h-6 rounded-full transition-all"
                style={{
                  background: c,
                  border: `2px solid ${newColor === c ? '#fff' : 'transparent'}`,
                  transform: newColor === c ? 'scale(1.25)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 text-xs py-1.5 justify-center">Bæta við</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-ghost text-xs py-1.5">
              <X size={13} />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
