import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T19:00:00Z')

export default function WC2026Widget() {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = WC_START - new Date()
      if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return }
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const now = new Date()
  if (now > new Date('2026-07-20T00:00:00Z')) return null
  if (cd.d === 0 && cd.h === 0 && cd.m === 0 && cd.s === 0 && WC_START > now) return null

  const started = now >= WC_START

  return (
    <Link to="/sports" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="card flex items-center gap-4"
           style={{
             background: 'linear-gradient(135deg, rgba(0,64,128,0.18) 0%, rgba(150,0,0,0.12) 50%, rgba(0,100,50,0.12) 100%)',
             border: '1px solid rgba(100,150,255,0.22)',
             cursor: 'pointer',
           }}>
        <div className="text-3xl select-none">🏆</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold leading-tight">FIFA World Cup 2026</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {started ? 'Í gangi núna!' : `Byrjar eftir ${cd.d} daga`}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {[
            [cd.d, 'D'],
            [cd.h, 'K'],
            [cd.m, 'M'],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center px-2 py-1.5 rounded-xl"
                 style={{ background: 'rgba(255,255,255,0.06)', minWidth: 36 }}>
              <span className="text-base font-bold tabular-nums leading-none"
                    style={{ color: 'var(--accent)' }}>
                {String(val).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 9, color: 'var(--muted)', lineHeight: '1.4' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
