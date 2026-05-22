import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

function getCountdown() {
  const now = new Date()
  const diff = WC_START - now
  if (diff <= 0) return { started: true, days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { started: false, days, hours, minutes }
}

export default function WorldCupWidget() {
  const [cd, setCd] = useState(getCountdown)

  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown()), 60000)
    return () => clearInterval(t)
  }, [])

  if (cd.started) return null

  return (
    <Link to="/sport" className="block no-underline">
      <div className="card relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(249,115,22,0.08) 100%)', border: '1px solid rgba(0,212,170,0.25)' }}>
        {/* Background decoration */}
        <div className="absolute right-3 top-2 text-6xl opacity-10 select-none pointer-events-none">⚽</div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={15} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>FIFA World Cup 2026</span>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </div>

        <div className="flex items-end gap-4 mb-2">
          <div className="text-center">
            <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>{cd.days}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--muted)' }}>{cd.hours}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>klst</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--muted)' }}>{cd.minutes}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>mín</div>
          </div>
          <div className="flex-1 text-right pb-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>til upphaf</div>
            <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>11. júní · Mexíkó</div>
          </div>
        </div>

        <div className="flex gap-1 mt-2">
          {['🇺🇸', '🇨🇦', '🇲🇽'].map((f, i) => (
            <span key={i} className="text-lg">{f}</span>
          ))}
          <span className="text-xs self-end ml-1" style={{ color: 'var(--muted)' }}>48 lið · 104 leikir</span>
        </div>
      </div>
    </Link>
  )
}
