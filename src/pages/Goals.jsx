import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Check, Target, PiggyBank } from 'lucide-react'

const CATEGORY_OPTIONS = [
  { id: 'work', label: 'Vinna', icon: '💼' },
  { id: 'health', label: 'Heilsa', icon: '💪' },
  { id: 'personal', label: 'Persónulegt', icon: '🌱' },
  { id: 'travel', label: 'Ferðalög', icon: '✈️' },
  { id: 'learning', label: 'Lærdómur', icon: '📚' },
  { id: 'finance', label: 'Fjármál', icon: '💰' },
]

const ICON_OPTIONS = ['💰', '✈️', '🏠', '🚗', '💻', '📱', '🎓', '🏖️', '🛡️', '🎯', '⭐', '🔥']
const GOAL_ICONS = ['⭐', '🤖', '📚', '🏃', '🚀', '💪', '🌍', '🎯', '✍️', '🎸', '🏋️', '🧘']

function SavingsCard({ goal, onRemove, onDeposit }) {
  const [showDeposit, setShowDeposit] = useState(false)
  const [amount, setAmount] = useState('')
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0
  const done = goal.current >= goal.target
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000)
    : null

  const handleDeposit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    onDeposit(goal.id, Number(amount))
    setAmount('')
    setShowDeposit(false)
  }

  return (
    <div className="card flex flex-col gap-3"
         style={{ borderColor: done ? `${goal.color}44` : 'var(--border)' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 24 }}>{goal.icon}</span>
          <div>
            <div className="font-semibold text-sm">{goal.name}</div>
            {goal.deadline && (
              <div className="text-xs mt-0.5" style={{
                color: daysLeft !== null && daysLeft <= 30 ? 'var(--danger)' : 'var(--muted)',
              }}>
                {daysLeft !== null && daysLeft > 0
                  ? `${daysLeft} dagar eftir`
                  : daysLeft === 0 ? 'Dagsetning í dag!'
                  : 'Liðið'}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => onRemove(goal.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={14} />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
          <span>{formatShortISK(goal.current)}</span>
          <span style={{ color: done ? goal.color : 'var(--muted)' }}>
            {done ? '✓ Náð!' : `${formatShortISK(goal.target - goal.current)} eftir`}
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: done ? goal.color : goal.color }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
          <span>{pct}%</span>
          <span>{formatShortISK(goal.target)}</span>
        </div>
      </div>

      {!done && (
        <>
          {showDeposit ? (
            <form onSubmit={handleDeposit} className="flex gap-2">
              <input
                className="input text-sm flex-1"
                type="number"
                placeholder="Upphæð (ISK)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary px-3"><Plus size={14} /></button>
              <button type="button" onClick={() => setShowDeposit(false)} className="btn btn-ghost px-3">
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowDeposit(true)}
              className="btn btn-ghost text-sm w-full justify-center"
              style={{ color: goal.color, borderColor: `${goal.color}33` }}
            >
              <Plus size={14} /> Bæta við sparnaði
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default function Goals() {
  const {
    savings, goals,
    addSavingsGoal, updateProgress, removeSavingsGoal,
    addGoal, toggleGoal, removeGoal,
    totalSaved, totalTarget, goalsCompleted,
  } = useGoals()

  const [tab, setTab] = useState('savings')
  const [showForm, setShowForm] = useState(false)

  // Savings form state
  const [sName, setSName] = useState('')
  const [sIcon, setSIcon] = useState('💰')
  const [sTarget, setSTarget] = useState('')
  const [sColor, setSColor] = useState('#00d4aa')
  const [sDeadline, setSDeadline] = useState('')

  // Goal form state
  const [gText, setGText] = useState('')
  const [gIcon, setGIcon] = useState('⭐')
  const [gCat, setGCat] = useState('personal')

  const handleAddSavings = (e) => {
    e.preventDefault()
    if (!sName.trim() || !sTarget) return
    addSavingsGoal({ name: sName.trim(), icon: sIcon, target: sTarget, color: sColor, deadline: sDeadline || null })
    setSName(''); setSTarget(''); setSDeadline(''); setShowForm(false)
  }

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!gText.trim()) return
    addGoal({ text: gText.trim(), icon: gIcon, category: gCat })
    setGText(''); setShowForm(false)
  }

  const pendingGoals = goals.filter(g => !g.done)
  const doneGoals = goals.filter(g => g.done)
  const totalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Markmið</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {goalsCompleted}/{goals.length} lokið · {totalProgress}% sparnaður
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýtt
        </button>
      </div>

      {/* Summary */}
      {savings.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>HEILDARSPARNAÐUR</span>
            <span className="text-xs" style={{ color: 'var(--accent)' }}>{totalProgress}%</span>
          </div>
          <div className="text-2xl font-bold">{formatShortISK(totalSaved)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>af {formatShortISK(totalTarget)} í markmiðum</div>
          <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${totalProgress}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['savings', '💰 Sparnaður'], ['goals', '🎯 Lífmarkmið']].map(([t, l]) => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false) }}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Add form */}
      {showForm && tab === 'savings' && (
        <form onSubmit={handleAddSavings} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Nýtt sparnaðarmarkmið</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map(ic => (
                <button key={ic} type="button" onClick={() => setSIcon(ic)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all"
                  style={{ background: sIcon === ic ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: sIcon === ic ? '1px solid var(--accent)' : '1px solid transparent' }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <input className="input text-sm" placeholder="Nafn markmiðs (t.d. Sumarfrí)" value={sName} onChange={e => setSName(e.target.value)} autoFocus />
          <input className="input text-sm" type="number" placeholder="Markhæð (ISK)" value={sTarget} onChange={e => setSTarget(e.target.value)} />
          <input className="input text-sm" type="date" value={sDeadline} onChange={e => setSDeadline(e.target.value)} />
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Litur:</label>
            {['#00d4aa', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22c55e'].map(c => (
              <button key={c} type="button" onClick={() => setSColor(c)}
                className="w-6 h-6 rounded-full transition-all"
                style={{ background: c, transform: sColor === c ? 'scale(1.3)' : 'scale(1)', outline: sColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Búa til markmið</button>
        </form>
      )}

      {showForm && tab === 'goals' && (
        <form onSubmit={handleAddGoal} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Nýtt lífmarkmið</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GOAL_ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => setGIcon(ic)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: gIcon === ic ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: gIcon === ic ? '1px solid var(--accent)' : '1px solid transparent' }}>
                {ic}
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Lýsing markmiðs..." value={gText} onChange={e => setGText(e.target.value)} autoFocus />
          <div className="grid grid-cols-3 gap-1.5">
            {CATEGORY_OPTIONS.map(c => (
              <button key={c.id} type="button" onClick={() => setGCat(c.id)}
                className="py-1.5 px-2 rounded-xl text-xs text-center transition-all"
                style={{
                  background: gCat === c.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: gCat === c.id ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${gCat === c.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Savings goals */}
      {tab === 'savings' && (
        <div className="flex flex-col gap-3">
          {savings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <PiggyBank size={32} className="mx-auto mb-2 opacity-30" />
              <p>Engin sparnaðarmarkmið ennþá</p>
            </div>
          ) : savings.map(g => (
            <SavingsCard key={g.id} goal={g} onRemove={removeSavingsGoal} onDeposit={updateProgress} />
          ))}
        </div>
      )}

      {/* Life goals */}
      {tab === 'goals' && (
        <div className="flex flex-col gap-3">
          {pendingGoals.length === 0 && doneGoals.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <Target size={32} className="mx-auto mb-2 opacity-30" />
              <p>Engin lífmarkmið ennþá</p>
            </div>
          ) : (
            <>
              {pendingGoals.map(g => (
                <div key={g.id} className="card flex items-center gap-3 py-3">
                  <button
                    onClick={() => toggleGoal(g.id)}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: 'var(--accent)', background: 'transparent' }}
                  />
                  <span style={{ fontSize: 20 }}>{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{g.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {CATEGORY_OPTIONS.find(c => c.id === g.category)?.label}
                    </p>
                  </div>
                  <button onClick={() => removeGoal(g.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {doneGoals.length > 0 && (
                <>
                  <div className="text-xs font-semibold px-1 mt-1" style={{ color: 'var(--muted)' }}>
                    LOKIÐ ({doneGoals.length})
                  </div>
                  {doneGoals.map(g => (
                    <div key={g.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.6 }}>
                      <button
                        onClick={() => toggleGoal(g.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--success)', border: 'none' }}
                      >
                        <Check size={12} color="#000" />
                      </button>
                      <span style={{ fontSize: 20 }}>{g.icon}</span>
                      <p className="text-sm flex-1" style={{ textDecoration: 'line-through' }}>{g.text}</p>
                      <button onClick={() => removeGoal(g.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
