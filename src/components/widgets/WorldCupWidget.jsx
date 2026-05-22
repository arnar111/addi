import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z').getTime()

export default function WorldCupWidget() {
  const [diff, setDiff] = useState(WC_START - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(WC_START - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const started = diff <= 0
  const days = Math.max(0, Math.floor(diff / 86400000))
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000))
  const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000))

  return (
    <Link to="/sport"
      className="card flex items-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(0,212,170,0.2)',
        textDecoration: 'none',
        color: 'inherit',
      }}>
      <div className="text-2xl">🏆</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>HEIMSMÓT 2026</div>
        {started ? (
          <div className="text-sm font-bold">Í gangi núna! 🎉</div>
        ) : (
          <div className="text-sm font-bold tabular-nums">
            {days}d {String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')} eftir
          </div>
        )}
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {started ? 'USA · Canada · Mexico' : `Byrjar 11. júní · USA/CAN/MEX`}
        </div>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </Link>
  )
}
