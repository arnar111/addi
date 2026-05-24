import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_END = new Date('2026-07-19T23:59:59')

export default function WorldCupWidget() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const isActive = now >= WC_START && now <= WC_END
  const isOver = now > WC_END
  const daysLeft = Math.max(0, Math.ceil((WC_START - now) / 86400000))
  const hoursLeft = Math.max(0, Math.floor(((WC_START - now) % 86400000) / 3600000))

  return (
    <div className="card overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.05))',
           border: '1px solid rgba(34,197,94,0.2)',
         }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <div>
            <div className="font-semibold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico</div>
          </div>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs shrink-0"
              style={{ color: 'var(--success)' }}>
          Sjá <ChevronRight size={12} />
        </Link>
      </div>

      {isOver && (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Meistarakeppnin er lokið 🏁</div>
      )}

      {isActive && (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--success)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
            Meistarakeppni heimsins er í GANGI!
          </span>
        </div>
      )}

      {!isActive && !isOver && (
        <div className="flex items-center gap-3 mt-1">
          <div className="flex gap-2">
            <div className="flex flex-col items-center px-3 py-1.5 rounded-xl"
                 style={{ background: 'rgba(34,197,94,0.12)' }}>
              <span className="text-xl font-bold leading-tight" style={{ color: 'var(--success)' }}>
                {daysLeft}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>dagar</span>
            </div>
            {daysLeft < 3 && (
              <div className="flex flex-col items-center px-3 py-1.5 rounded-xl"
                   style={{ background: 'rgba(34,197,94,0.08)' }}>
                <span className="text-xl font-bold leading-tight" style={{ color: 'var(--success)' }}>
                  {hoursLeft}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>klst</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs">Byrjar <span className="font-medium">11. júní 2026</span></div>
            <div className="flex items-center gap-1.5 text-xs">
              <span>🇺🇸</span>
              <span className="font-medium">USMNT</span>
              <span style={{ color: 'var(--muted)' }}>· Hópur A</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
