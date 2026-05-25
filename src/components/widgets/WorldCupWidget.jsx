import { useState, useEffect } from 'react'
import { useSports } from '../../hooks/useSports'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00-06:00') // Mexico City kickoff

function useCountdown(target) {
  const [diff, setDiff] = useState(target - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  const total = Math.max(0, diff)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const mins = Math.floor((total % 3600000) / 60000)
  const secs = Math.floor((total % 60000) / 1000)
  return { days, hours, mins, secs, started: diff <= 0 }
}

export default function WorldCupWidget() {
  const { worldCup, loading } = useSports()
  const { days, hours, mins, secs, started } = useCountdown(WC_START.getTime())
  const navigate = useNavigate()

  const liveGames = worldCup.filter(g => g.isLive)
  const todayGames = worldCup.filter(g => {
    const d = new Date(g.date)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })

  return (
    <button
      onClick={() => navigate('/sports')}
      className="card w-full text-left"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(249,115,22,0.08))',
        border: '1px solid rgba(0,212,170,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <div>
            <div className="text-sm font-semibold">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico</div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>

      {!started ? (
        <div className="flex gap-2 mt-3">
          {[
            [days, 'dagar'],
            [hours, 'klst'],
            [mins, 'mín'],
            [secs, 'sek'],
          ].map(([val, label]) => (
            <div key={label} className="flex-1 flex flex-col items-center py-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                {String(val).padStart(2, '0')}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      ) : liveGames.length > 0 ? (
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-xs font-semibold" style={{ color: '#ef4444' }}>🔴 Í gangi</div>
          {liveGames.slice(0, 2).map(g => (
            <div key={g.id} className="flex items-center justify-between text-sm">
              <span>{g.teams[0]?.name} vs {g.teams[1]?.name}</span>
              <span className="font-bold">{g.teams[0]?.score}–{g.teams[1]?.score}</span>
            </div>
          ))}
        </div>
      ) : todayGames.length > 0 ? (
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Leikir í dag</div>
          {todayGames.slice(0, 2).map(g => (
            <div key={g.id} className="text-sm">
              {g.teams[0]?.name} vs {g.teams[1]?.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          Opnunarlið: Mexíkó — 11. júní
        </div>
      )}
    </button>
  )
}
