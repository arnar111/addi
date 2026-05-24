import { useState } from 'react'
import { useHabits } from '../../hooks/useHabits'
import { Flame, Plus, X, Settings2 } from 'lucide-react'

const ICON_OPTIONS = ['🏋️','🥤','📚','💧','🚶','😴','🧘','🏃','🍎','💊','🚴','🧹','📝','🎯','🎸','🌱']
const COLOR_OPTIONS = ['#00d4aa','#8b5cf6','#3b82f6','#06b6d4','#22c55e','#f97316','#ef4444','#ec4899','#eab308']

export default function HabitsWidget() {
  const { habits, toggle, add, remove, isDoneToday, streakFor, todayDone } = useHabits()
  const [managing, setManaging] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '⭐', color: '#00d4aa' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    add(form.name, form.icon, form.color)
    setForm({ name: '', icon: '⭐', color: '#00d4aa' })
    setShowAdd(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <div className="flex items-center gap-2">
          <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {todayDone}/{habits.length}
          </span>
          <button onClick={() => setManaging(!managing)} style={{ color: managing ? 'var(--accent)' : 'var(--muted)', padding: 2 }}>
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      {managing ? (
        <div className="flex flex-col gap-2 animate-slide-up">
          {habits.map(h => (
            <div key={h.id} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{h.icon}</span>
              <span className="text-sm flex-1">{h.name}</span>
              <button onClick={() => remove(h.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <X size={13} />
              </button>
            </div>
          ))}

          {showAdd ? (
            <form onSubmit={handleAdd} className="flex flex-col gap-2 p-3 rounded-xl animate-slide-up"
                  style={{ background: 'var(--surface2)' }}>
              <div className="flex gap-2">
                <select className="input text-sm" style={{ width: 60 }}
                  value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                  {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <input className="input text-sm flex-1" placeholder="Nafn vana..." value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_OPTIONS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{ background: c, borderColor: form.color === c ? 'white' : 'transparent' }} />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 text-xs justify-center">Bæta við</button>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost px-3"><X size={13} /></button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs py-2.5 rounded-xl justify-center"
              style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px dashed var(--border)' }}>
              <Plus size={12} /> Nýr vani
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {habits.map(h => {
            const done = isDoneToday(h.id)
            const streak = streakFor(h.id)
            return (
              <button key={h.id} onClick={() => toggle(h.id)}
                className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all active:scale-97"
                style={{
                  background: done ? `${h.color}1a` : 'var(--surface2)',
                  border: `1px solid ${done ? h.color + '44' : 'transparent'}`,
                }}>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{h.icon}</span>
                  {streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                      <Flame size={11} />{streak}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight">{h.name}</span>
                {done && <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Lokið</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
