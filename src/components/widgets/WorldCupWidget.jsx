import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T19:00:00Z')

export default function WorldCupWidget() {
  const [left, setLeft] = useState(null)

  useEffect(() => {
    const calc = () => {
      const diff = WC_START - Date.now()
      if (diff <= 0) return setLeft({ done: true })
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      })
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [])

  if (!left || left.done) return null

  return (
    <Link to="/football"
      className="card flex items-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,212,170,0.05))',
        border: '1px solid rgba(139,92,246,0.2)',
        textDecoration: 'none',
        color: 'inherit'
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(139,92,246,0.15)' }}>
        <Trophy size={18} style={{ color: 'var(--accent2)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">FIFA World Cup 2026</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          USA · Kanada · Mexíkó
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex flex-col items-center px-2 py-1 rounded-xl"
             style={{ background: 'rgba(139,92,246,0.12)' }}>
          <span className="text-lg font-bold leading-none" style={{ color: 'var(--accent2)' }}>{left.days}</span>
          <span style={{ color: 'var(--muted)', fontSize: 9 }}>dagar</span>
        </div>
        <div className="flex flex-col items-center px-2 py-1 rounded-xl"
             style={{ background: 'rgba(139,92,246,0.08)' }}>
          <span className="text-lg font-bold leading-none" style={{ color: 'var(--accent2)' }}>{left.hours}</span>
          <span style={{ color: 'var(--muted)', fontSize: 9 }}>klst</span>
        </div>
      </div>
    </Link>
  )
}
