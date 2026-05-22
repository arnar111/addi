import { useSpira } from '../../hooks/useSpira'
import { Link } from 'react-router-dom'
import { ChevronRight, Droplets } from 'lucide-react'

export default function SpiraWidget() {
  const { plants, needsWater, water, STAGES, STAGE_COLORS } = useSpira()

  if (plants.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🌶️</span>
          <h3 className="font-semibold text-sm">Spira</h3>
          {needsWater.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
              {needsWater.length} þurfa vatn
            </span>
          )}
        </div>
        <Link to="/spira" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {plants.map(p => {
          const days = p.lastWatered
            ? Math.floor((Date.now() - new Date(p.lastWatered)) / 86400000)
            : null
          const thirsty = days === null || days >= 2
          const stageColor = STAGE_COLORS[p.stage]

          return (
            <button key={p.id} onClick={() => water(p.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 p-2.5 rounded-xl transition-all active:scale-95"
              style={{
                background: thirsty ? 'rgba(249,115,22,0.1)' : 'var(--surface2)',
                border: `1px solid ${thirsty ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                minWidth: 68,
              }}>
              <span className="text-xl">{thirsty ? '🪣' : '🌱'}</span>
              <span className="text-xs font-medium truncate max-w-[60px] text-center leading-tight">
                {p.name}
              </span>
              <span className="text-xs font-medium" style={{ color: stageColor }}>
                {STAGES[p.stage]}
              </span>
              {thirsty && (
                <span className="text-xs flex items-center gap-0.5" style={{ color: '#f97316' }}>
                  <Droplets size={10} /> {days === null ? 'Aldrei' : `${days}d`}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
