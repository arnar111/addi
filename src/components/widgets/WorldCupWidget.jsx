import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T20:00:00Z')

function pad(n) { return String(n).padStart(2, '0') }

function calcCountdown() {
  const diff = WC_START - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

export default function WorldCupWidget() {
  const [cd, setCd] = useState(calcCountdown)

  useEffect(() => {
    const t = setInterval(() => setCd(calcCountdown()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!cd) {
    return (
      <Link to="/sport" className="card block" style={{
        background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(21,128,61,0.1))',
        border: '1px solid rgba(74,222,128,0.3)',
        textDecoration: 'none',
      }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-bold" style={{ color: '#4ade80' }}>Heimsbikar 2026 er hafinn!</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Smelltu til að fylgjast með</div>
          </div>
        </div>
      </Link>
    )
  }

  const isUrgent = cd.days < 7
  const accentColor = isUrgent ? '#fb923c' : '#93c5fd'

  return (
    <Link to="/sport" className="card block" style={{
      background: 'linear-gradient(135deg, rgba(15,23,64,0.95), rgba(10,14,40,0.95))',
      border: `1px solid ${isUrgent ? 'rgba(251,146,60,0.35)' : 'rgba(59,130,246,0.25)'}`,
      textDecoration: 'none',
    }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-medium" style={{ color: 'rgba(147,197,253,0.7)', letterSpacing: '0.05em' }}>
            ⚽ HEIMSBIKAR 2026
          </div>
          <div className="font-bold text-base mt-0.5">USA · Canada · México</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Opnunarleiður 11. júní</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl">🌍</span>
          {isUrgent && (
            <span className="badge text-xs animate-pulse-soft"
                  style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}>
              Bráðlega!
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {[
          ['Dagar', cd.days],
          ['Klst', cd.hours],
          ['Mín', cd.mins],
          ['Sek', cd.secs],
        ].map(([label, val]) => (
          <div key={label} className="flex-1 text-center py-2.5 rounded-xl"
               style={{ background: 'rgba(0,0,0,0.35)' }}>
            <div className="text-2xl font-mono font-bold tabular-nums leading-none"
                 style={{ color: accentColor }}>
              {pad(val)}
            </div>
            <div className="mt-1" style={{ color: 'rgba(147,197,253,0.5)', fontSize: 10 }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </Link>
  )
}
