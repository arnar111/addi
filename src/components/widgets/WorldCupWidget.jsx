import { Link } from 'react-router-dom'
import { useSports, WORLD_CUP_START } from '../../hooks/useSports'
import { ChevronRight } from 'lucide-react'

export default function WorldCupWidget() {
  const { daysUntilWC, wcIsLive } = useSports()
  const days = daysUntilWC()
  const isLive = wcIsLive()

  if (isLive) {
    return (
      <Link to="/sports" className="card flex items-center gap-3 no-underline" style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(239,68,68,0.08))',
        border: '1px solid rgba(234,179,8,0.3)',
      }}>
        <span className="text-3xl shrink-0">🏆</span>
        <div className="flex-1">
          <div className="font-bold" style={{ color: '#eab308' }}>FIFA World Cup 2026</div>
          <div className="text-xs font-semibold" style={{ color: '#22c55e' }}>● LIVE NÚ · BNA / Kanada / Mexíkó</div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </Link>
    )
  }

  if (days > 60) return null

  return (
    <Link to="/sports" className="card flex items-center gap-3 no-underline" style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(234,179,8,0.07))',
      border: '1px solid rgba(234,179,8,0.2)',
    }}>
      <span className="text-3xl shrink-0">🏆</span>
      <div className="flex-1">
        <div className="font-semibold text-sm">World Cup 2026</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {WORLD_CUP_START.toLocaleDateString('is-IS', { month: 'long', day: 'numeric' })} · BNA/Kanada/Mexíkó
        </div>
      </div>
      <div className="flex flex-col items-center shrink-0">
        <div className="text-2xl font-bold" style={{ color: '#eab308' }}>{days}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
    </Link>
  )
}
