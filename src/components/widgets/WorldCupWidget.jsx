import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const KICKOFF = new Date('2026-06-11T19:00:00').getTime()

function pad(n) { return String(Math.max(0, n)).padStart(2, '0') }

export default function WorldCupWidget() {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = KICKOFF - now
  const over = diff <= 0
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,56,168,0.1), rgba(196,0,40,0.08), rgba(252,209,22,0.06))',
      borderColor: 'rgba(0,56,168,0.25)',
    }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <div className="font-semibold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>🇺🇸 🇨🇦 🇲🇽 · 48 lið · 16 leikvangar</div>
          </div>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs shrink-0" style={{ color: 'var(--accent)' }}>
          Meira <ChevronRight size={12} />
        </Link>
      </div>

      {over ? (
        <div className="text-center py-3 font-bold text-lg" style={{ color: 'var(--accent)' }}>
          Í gangi! ⚽🔥
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5">
          {[['Dagar', days], ['Klst', hrs], ['Mín', mins], ['Sek', secs]].map(([l, v]) => (
            <div key={l} className="flex flex-col items-center py-2.5 rounded-xl"
                 style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-2xl font-bold tabular-nums font-mono leading-none">{pad(v)}</span>
              <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3 }}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
