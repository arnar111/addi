import { useState } from 'react'
import { useSpira } from '../hooks/useSpira'
import { Plus, Droplets, ChevronUp, ChevronDown, Trash2, X, AlertTriangle, Flame } from 'lucide-react'

function daysStr(n) {
  if (n === null || n === undefined) return 'Aldrei vatnat'
  if (n === 0) return 'Vatnat í dag'
  if (n === 1) return 'Vatnat í gær'
  return `Vatnat fyrir ${n} dögum`
}

function PlantCard({ plant, STAGES, STAGE_COLORS, PEPPER_TYPES, onWater, onAdvance, onRegress, onRemove }) {
  const [confirm, setConfirm] = useState(false)
  const pepper = PEPPER_TYPES.find(t => t.id === plant.type) || PEPPER_TYPES[5]
  const stageColor = STAGE_COLORS[plant.stage]
  const stageName = STAGES[plant.stage]
  const days = plant.lastWatered
    ? Math.floor((Date.now() - new Date(plant.lastWatered)) / 86400000)
    : null
  const thirsty = days === null || days >= 2

  return (
    <div className="card transition-all"
         style={{ borderColor: thirsty ? 'rgba(249,115,22,0.25)' : 'var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{pepper.icon}</span>
          <div>
            <div className="text-sm font-semibold">{plant.name}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{pepper.label} · {pepper.shu}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge text-xs" style={{ background: `${stageColor}22`, color: stageColor }}>
            {stageName}
          </span>
          {confirm ? (
            <div className="flex gap-1">
              <button onClick={() => { onRemove(plant.id); setConfirm(false) }}
                className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
                Já
              </button>
              <button onClick={() => setConfirm(false)}
                className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                Nei
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} style={{ color: 'var(--muted)', padding: 2 }}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Stage progress */}
      <div className="flex gap-1 mb-3">
        {STAGES.map((s, i) => (
          <div key={s} className="flex-1 h-1.5 rounded-full transition-all"
               style={{ background: i <= plant.stage ? stageColor : 'var(--surface2)' }} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs"
             style={{ color: thirsty ? '#f97316' : 'var(--muted)' }}>
          {thirsty ? <AlertTriangle size={12} /> : <Droplets size={12} />}
          {daysStr(days)}
        </div>
        <div className="flex gap-2">
          {plant.stage > 0 && (
            <button onClick={() => onRegress(plant.id)}
              className="btn text-xs py-1 px-2"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              <ChevronDown size={11} />
            </button>
          )}
          {plant.stage < STAGES.length - 1 && (
            <button onClick={() => onAdvance(plant.id)}
              className="btn text-xs py-1.5 px-2.5"
              style={{ background: `${stageColor}22`, color: stageColor, border: `1px solid ${stageColor}44` }}>
              <ChevronUp size={11} /> Stig upp
            </button>
          )}
          <button onClick={() => onWater(plant.id)}
            className="btn text-xs py-1.5 px-2.5"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
            <Droplets size={11} /> Vatn
          </button>
        </div>
      </div>

      {plant.potSize && (
        <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Pottur: {plant.potSize}</div>
      )}
    </div>
  )
}

export default function Spira() {
  const { plants, addPlant, water, waterAll, advanceStage, regressStage, removePlant, needsWater, STAGES, STAGE_COLORS, PEPPER_TYPES } = useSpira()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('reaper')
  const [pot, setPot] = useState('1L')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    addPlant(name.trim(), type, pot)
    setName('')
    setType('reaper')
    setPot('1L')
    setShowForm(false)
  }

  const stageCount = STAGES.map((s, i) => ({ stage: s, count: plants.filter(p => p.stage === i).length, color: STAGE_COLORS[i] }))
    .filter(s => s.count > 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🌶️ Spira</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {plants.length} plöntur · {needsWater.length > 0 ? `${needsWater.length} þurfa vatn` : 'Allt í lagi'}
          </p>
        </div>
        <div className="flex gap-2">
          {plants.length > 0 && (
            <button onClick={waterAll}
              className="btn text-sm"
              style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Droplets size={14} /> Allt
            </button>
          )}
          <button onClick={() => setShowForm(s => !s)} className="btn btn-primary">
            <Plus size={14} /> Planta
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný planta</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn (t.d. Reaper #2)" value={name}
                 onChange={e => setName(e.target.value)} autoFocus />
          <div className="grid grid-cols-3 gap-1.5">
            {PEPPER_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setType(t.id)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: type === t.id ? 'rgba(239,68,68,0.12)' : 'var(--surface2)',
                  border: `1px solid ${type === t.id ? 'rgba(239,68,68,0.35)' : 'transparent'}`,
                }}>
                <span className="text-xl">{t.icon}</span>
                <span style={{ color: type === t.id ? '#ef4444' : 'var(--muted)', fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>
                  {t.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Pottstærð</label>
            <div className="flex gap-2 flex-wrap">
              {['0.5L', '1L', '2L', '5L', '10L', '20L'].map(s => (
                <button key={s} type="button" onClick={() => setPot(s)}
                  className="px-3 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: pot === s ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    color: pot === s ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${pot === s ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>{s}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {needsWater.length > 0 && (
        <div className="card" style={{ border: '1px solid rgba(249,115,22,0.2)', background: 'rgba(249,115,22,0.04)' }}>
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle size={14} style={{ color: '#f97316' }} />
            <span className="text-sm font-medium">{needsWater.length} plöntur þurfa vatn</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {needsWater.map(p => {
              const t = PEPPER_TYPES.find(t => t.id === p.type) || PEPPER_TYPES[5]
              return (
                <button key={p.id} onClick={() => water(p.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <Droplets size={11} /> {p.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {stageCount.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {stageCount.map(({ stage, count, color }) => (
            <div key={stage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0 text-xs"
                 style={{ background: `${color}22`, color }}>
              <span className="font-bold">{count}</span> {stage}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {plants.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-10" style={{ color: 'var(--muted)' }}>
            <span className="text-5xl">🌱</span>
            <p className="text-sm">Engar plöntur enn</p>
            <p className="text-xs text-center" style={{ maxWidth: 220 }}>
              Bættu við fyrstu plöntu til að hefja ræktunina!
            </p>
          </div>
        ) : (
          plants.map(p => (
            <PlantCard key={p.id} plant={p}
              STAGES={STAGES} STAGE_COLORS={STAGE_COLORS} PEPPER_TYPES={PEPPER_TYPES}
              onWater={water} onAdvance={advanceStage} onRegress={regressStage} onRemove={removePlant} />
          ))
        )}
      </div>

      <div className="card" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: '#ef4444' }}>🌡️ Ábendingar</div>
        <ul className="text-xs leading-relaxed flex flex-col gap-1" style={{ color: 'var(--muted)' }}>
          <li>• Super hots þurfa 26–30°C hitastig</li>
          <li>• Vatna þegar jarðvegur er þurr efst (ca. 2–3 dagar)</li>
          <li>• Góð loftræsting er nauðsynleg – opið gluggi eða vifta</li>
          <li>• Sterkt ljós 14–16 klst/dag (LED eða sólarljós)</li>
        </ul>
      </div>
    </div>
  )
}
