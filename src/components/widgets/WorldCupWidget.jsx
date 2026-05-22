import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00').getTime()

export default function WorldCupWidget() {
  const [diff, setDiff] = useState(WC_START - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(WC_START - Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  const started = diff <= 0
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.06))',
      border: '1px solid rgba(249,115,22,0.2)',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <div>
            <div className="text-sm font-semibold">FIFA HM 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {started ? 'Meistaramótið er hafið!' : `Hefst ${days === 0 ? 'í dag' : `eftir ${days} daga`}`}
            </div>
          </div>
        </div>
        {!started && (
          <div className="flex flex-col items-center px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(249,115,22,0.15)' }}>
            <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: '#f97316' }}>
              {days}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>dagar</span>
          </div>
        )}
        {started && (
          <Link to="/sports" className="flex items-center gap-1 text-xs btn btn-ghost py-1.5"
            style={{ color: '#f97316' }}>
            Skoða <ArrowRight size={11} />
          </Link>
        )}
      </div>
      {!started && days <= 7 && (
        <div className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          🗓 11. júní – 19. júlí · Bandaríkin · Kanada · Mexíkó
        </div>
      )}
      {!started && days > 7 && (
        <Link to="/sports" className="mt-2 flex items-center gap-1 text-xs"
          style={{ color: '#f97316', textDecoration: 'none' }}>
          Skipuleggja og fylgjast með <ArrowRight size={11} />
        </Link>
      )}
    </div>
  )
}
