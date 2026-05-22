import { useState, useEffect } from 'react'

const WC_START = new Date('2026-06-11T00:00:00-05:00') // Mexico City opening
const WC_END   = new Date('2026-07-19T00:00:00-05:00')

function pad(n) { return String(n).padStart(2, '0') }

export default function WorldCupWidget() {
  const [countdown, setCountdown] = useState(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    function tick() {
      const now = Date.now()
      const target = WC_START.getTime()
      const diff = target - now
      if (diff <= 0) {
        setStarted(true)
        setCountdown(null)
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (started) {
    return (
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(0,212,170,0.08))', border: '1px solid rgba(249,115,22,0.25)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: '#f97316' }}>🏆 FIFA WORLD CUP 2026</div>
            <div className="font-semibold text-sm">Í gangi!</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico</div>
          </div>
          <div className="text-4xl">⚽</div>
        </div>
      </div>
    )
  }

  if (!countdown) return null

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.10), rgba(0,0,0,0))', border: '1px solid rgba(249,115,22,0.25)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold" style={{ color: '#f97316' }}>🏆 FIFA WORLD CUP 2026</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>11. júní · USA · Canada · Mexico</div>
        </div>
        <span className="text-3xl">⚽</span>
      </div>
      <div className="flex gap-2">
        {[['d', 'Dagar'], ['h', 'Klst'], ['m', 'Mín'], ['s', 'Sek']].map(([k, label]) => (
          <div key={k} className="flex-1 flex flex-col items-center py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <span className="text-xl font-bold tabular-nums" style={{ color: '#f97316' }}>{pad(countdown[k])}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="text-center text-xs mt-2" style={{ color: 'var(--muted)' }}>48 lið · 16 leikvangar</div>
    </div>
  )
}
