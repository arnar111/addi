import { usePepper, PEPPER_TYPES } from '../../hooks/usePepper'
import { useNavigate } from 'react-router-dom'

export default function PepperWidget() {
  const { plants, daysSinceWater, addLog, plantsNeedingWater } = usePepper()
  const navigate = useNavigate()

  if (plants.length === 0) return (
    <button onClick={() => navigate('/pepper')} className="card w-full text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
             style={{ background: 'rgba(239,68,68,0.1)' }}>🌱</div>
        <div>
          <div className="font-semibold text-sm">Spira pippurar</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Smelltu til að bæta við fyrstu plöntu</div>
        </div>
      </div>
    </button>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🌶️</span>
          <span className="text-sm font-semibold">Spira</span>
          {plantsNeedingWater.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
              {plantsNeedingWater.length} þurfa vökvun
            </span>
          )}
        </div>
        <button onClick={() => navigate('/pepper')}
                className="text-xs" style={{ color: 'var(--accent)' }}>Sjá allt →</button>
      </div>

      {plantsNeedingWater.length > 0 && (
        <div className="flex flex-col gap-2 mb-3 p-3 rounded-xl"
             style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>💧 Þarf vökvun</div>
          {plantsNeedingWater.slice(0, 3).map(p => {
            const pt = PEPPER_TYPES.find(t => t.id === p.type) || PEPPER_TYPES[6]
            const days = daysSinceWater(p.id)
            return (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{pt.icon}</span>
                  <span className="text-xs font-medium">{p.name}</span>
                  {days !== null && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{days}d</span>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); addLog(p.id, 'water') }}
                  className="btn text-xs py-1 px-2.5"
                  style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  💧 Vökva
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="font-bold text-lg">{plants.length}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Plöntur</div>
        </div>
        <div className="p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="font-bold text-lg" style={{ color: plantsNeedingWater.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {plantsNeedingWater.length}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Þurfa vökvun</div>
        </div>
        <div className="p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="font-bold text-lg" style={{ color: 'var(--success)' }}>{plants.length - plantsNeedingWater.length}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Í lagi</div>
        </div>
      </div>
    </div>
  )
}
