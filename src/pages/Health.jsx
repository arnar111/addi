import { useState } from 'react'
import { useHealth } from '../hooks/useHealth'
import { Droplets, Zap, Dumbbell, Plus, Trash2, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

const HUEL_TYPES = [
  { id: 'rtd', label: 'RTD', desc: 'Ready-to-Drink', protein: 20, kcal: 400, icon: '🥤', color: '#00d4aa' },
  { id: 'black', label: 'Black', desc: 'Black Edition', protein: 40, kcal: 400, icon: '⚫', color: '#8b5cf6' },
  { id: 'standard', label: 'Standard', desc: 'Huel Powder', protein: 35, kcal: 400, icon: '🟤', color: '#f97316' },
  { id: 'powder', label: 'H&S', desc: 'Hot & Savoury', protein: 30, kcal: 400, icon: '🍲', color: '#eab308' },
]

const WORKOUTS = ['Rest Day 😴', 'Walk 🚶', 'Run 🏃', 'Gym 💪', 'Cycling 🚴', 'Swim 🏊', 'Football ⚽', 'Other 🏋️']

function WaterGlass({ filled, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 transition-all active:scale-90"
    >
      <div
        className="w-8 h-10 rounded-b-lg rounded-t-sm border-2 flex items-end overflow-hidden transition-all"
        style={{
          borderColor: filled ? 'var(--accent)' : 'var(--border)',
          background: 'var(--surface2)',
        }}
      >
        {filled && (
          <div className="w-full rounded-b-sm transition-all"
               style={{ height: '75%', background: 'rgba(0,212,170,0.4)' }} />
        )}
      </div>
      <span style={{ fontSize: 9, color: filled ? 'var(--accent)' : 'var(--muted)' }}>
        250ml
      </span>
    </button>
  )
}

function ProteinBar({ current, goal }) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  const color = pct >= 100 ? 'var(--success)' : pct >= 70 ? 'var(--accent)' : pct >= 40 ? '#f97316' : 'var(--danger)'
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Protein</span>
        <span style={{ color }}>{current}g <span style={{ color: 'var(--muted)', fontSize: 12 }}>/ {goal}g goal</span></span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>
        {pct >= 100 ? '✅ Protein goal hit!' : `${goal - current}g to go`}
      </div>
    </div>
  )
}

export default function Health() {
  const { todayData, totalProtein, proteinGoal, waterGoal, weightLog, weeklyProteinAvg,
          addHuel, removeHuel, setWater, setWorkout, addWeight, last7Weight } = useHealth()
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [showWeightLog, setShowWeightLog] = useState(false)

  const totalKcal = todayData.huel.reduce((a, h) => {
    const t = HUEL_TYPES.find(x => x.id === h.type)
    return a + (t?.kcal || 400)
  }, 0)

  const handleAddWeight = () => {
    const kg = parseFloat(weightInput)
    if (!isNaN(kg) && kg > 0) {
      addWeight(kg)
      setWeightInput('')
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Heilsa 💪</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Today summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-sm flex flex-col items-center gap-1 text-center">
          <span style={{ color: '#8b5cf6', fontSize: 20 }}>⚡</span>
          <div className="text-lg font-bold">{totalProtein}g</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Prótein</div>
        </div>
        <div className="card-sm flex flex-col items-center gap-1 text-center">
          <span style={{ fontSize: 20 }}>🔥</span>
          <div className="text-lg font-bold">{totalKcal}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>kcal</div>
        </div>
        <div className="card-sm flex flex-col items-center gap-1 text-center">
          <span style={{ color: 'var(--accent)', fontSize: 20 }}>💧</span>
          <div className="text-lg font-bold">{todayData.water}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Glös</div>
        </div>
      </div>

      {/* Protein progress */}
      <div className="card">
        <ProteinBar current={totalProtein} goal={proteinGoal} />
      </div>

      {/* Huel tracker */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">🥤 Huel í dag</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{todayData.huel.length} máltíð{todayData.huel.length !== 1 ? 'ir' : ''}</p>
          </div>
          {todayData.huel.length > 0 && (
            <div className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>
              {totalKcal} kcal
            </div>
          )}
        </div>

        {/* Add buttons */}
        <div className="grid grid-cols-2 gap-2">
          {HUEL_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => addHuel(t.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-97"
              style={{ background: `${t.color}18`, border: `1px solid ${t.color}30`, color: t.color }}
            >
              <span>{t.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-xs">{t.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{t.protein}g protein</div>
              </div>
              <Plus size={14} className="ml-auto" style={{ color: t.color }} />
            </button>
          ))}
        </div>

        {/* Log */}
        {todayData.huel.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Dagbók</div>
            {todayData.huel.map((h, i) => {
              const type = HUEL_TYPES.find(t => t.id === h.type)
              return (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                     style={{ background: 'var(--surface2)' }}>
                  <span>{type?.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: type?.color }}>{type?.label}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>{h.time} · {h.protein}g</span>
                  </div>
                  <button onClick={() => removeHuel(i)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Water tracker */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">💧 Vatn</h3>
          <span className="text-sm font-medium" style={{ color: todayData.water >= waterGoal ? 'var(--success)' : 'var(--accent)' }}>
            {todayData.water} / {waterGoal} glös
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: waterGoal }, (_, i) => (
            <WaterGlass
              key={i}
              filled={i < todayData.water}
              onClick={() => setWater(i < todayData.water ? i : i + 1)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost text-xs flex-1 justify-center" onClick={() => setWater(Math.max(0, todayData.water - 1))}>−</button>
          <button className="btn btn-primary text-xs flex-1 justify-center" onClick={() => setWater(Math.min(waterGoal + 4, todayData.water + 1))}>+ Glas</button>
        </div>
      </div>

      {/* Workout */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">🏋️ Hreyfing í dag</h3>
          {todayData.workout && (
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent2)' }}>
              {todayData.workout}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowWorkoutPicker(!showWorkoutPicker)}
          className="btn btn-ghost text-sm justify-between"
        >
          <span>{todayData.workout || 'Skrá hreyfingu...'}</span>
          {showWorkoutPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showWorkoutPicker && (
          <div className="grid grid-cols-2 gap-1.5">
            {WORKOUTS.map(w => (
              <button
                key={w}
                onClick={() => { setWorkout(w); setShowWorkoutPicker(false) }}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                style={{
                  background: todayData.workout === w ? 'rgba(139,92,246,0.15)' : 'var(--surface2)',
                  border: `1px solid ${todayData.workout === w ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                  color: todayData.workout === w ? 'var(--accent2)' : 'var(--text)',
                }}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Weight log */}
      <div className="card flex flex-col gap-3">
        <button
          onClick={() => setShowWeightLog(!showWeightLog)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-semibold text-sm">⚖️ Þyngd</h3>
          <div className="flex items-center gap-2">
            {last7Weight.length > 0 && (
              <span className="text-sm font-semibold">{last7Weight[last7Weight.length - 1]?.kg} kg</span>
            )}
            {showWeightLog ? <ChevronUp size={14} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--muted)' }} />}
          </div>
        </button>

        {showWeightLog && (
          <div className="flex flex-col gap-3 animate-slide-up">
            <div className="flex gap-2">
              <input
                className="input text-sm"
                type="number"
                step="0.1"
                placeholder="kg (t.d. 80.5)"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddWeight()}
              />
              <button className="btn btn-primary shrink-0" onClick={handleAddWeight}>
                <Plus size={14} />
              </button>
            </div>
            {last7Weight.length > 0 && (
              <div className="flex flex-col gap-1">
                {last7Weight.slice().reverse().slice(0, 5).map((w, i) => (
                  <div key={i} className="flex items-center justify-between text-sm px-2">
                    <span style={{ color: 'var(--muted)' }}>
                      {new Date(w.date).toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-medium">{w.kg} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Weekly stats */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.06))' }}>
        <h3 className="font-semibold text-sm mb-3">📊 Vikulegar tölur</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Meðalprótein/dag</span>
            <span className="text-xl font-bold" style={{ color: 'var(--accent2)' }}>{weeklyProteinAvg}g</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Huel máltíðir/viku</span>
            <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
              {Object.values({}).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
