import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, ChevronRight } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const OPENING = new Date('2026-06-12T19:00:00-04:00')

export default function WorldCupWidget() {
  const [now, setNow] = useState(new Date())
  const [myTeam] = useLocalStorage('wc-my-team', 'Argentína 🇦🇷')
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = OPENING - now
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const started = diff < 0

  return (
    <button onClick={() => navigate('/worldcup')}
            className="card w-full text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>HM 2026</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      {started ? (
        <div>
          <div className="text-lg font-bold">⚽ Í gangi!</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Mitt lið: {myTeam}</div>
        </div>
      ) : (
        <div>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold tabular-nums" style={{ color: '#f59e0b' }}>{days}</span>
            <span className="text-sm mb-0.5" style={{ color: 'var(--muted)' }}>dagar</span>
            <span className="text-lg font-bold tabular-nums ml-1" style={{ color: '#f59e0b' }}>{String(hours).padStart(2,'0')}</span>
            <span className="text-sm mb-0.5" style={{ color: 'var(--muted)' }}>klst</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            þar til HM 2026 · {myTeam}
          </div>
        </div>
      )}
    </button>
  )
}
