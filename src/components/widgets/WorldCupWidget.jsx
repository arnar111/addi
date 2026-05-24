import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')

const GROUPS = {
  A: [
    { flag: '🇺🇸', name: 'USA', pts: 0 },
    { flag: '🇲🇽', name: 'Mexíkó', pts: 0 },
    { flag: '🇨🇦', name: 'Kanada', pts: 0 },
    { flag: '🇧🇴', name: 'Bólivía', pts: 0 },
  ],
}

const FIXTURES = [
  { date: '2026-06-11', home: '🇲🇽', away: '🇨🇦', homeT: 'Mexíkó', awayT: 'Kanada', venue: 'Mexico City' },
  { date: '2026-06-12', home: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away: '🇦🇷', homeT: 'England', awayT: 'Argentína', venue: 'New York' },
  { date: '2026-06-13', home: '🇧🇷', away: '🇩🇪', homeT: 'Brasilía', awayT: 'Þýskaland', venue: 'Los Angeles' },
  { date: '2026-06-14', home: '🇪🇸', away: '🇫🇷', homeT: 'Spánn', awayT: 'Frakkland', venue: 'Dallas' },
  { date: '2026-06-15', home: '🇮🇸', away: '🇵🇹', homeT: 'Ísland', awayT: 'Portúgal', venue: 'Boston' },
]

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
  const { days, hours, mins, secs, started } = useCountdown(WC_START.getTime())
  const [showAll, setShowAll] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const upcoming = FIXTURES.filter(f => f.date >= today)
  const shown = showAll ? upcoming : upcoming.slice(0, 2)

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,84,166,0.15), rgba(220,20,60,0.08))',
      border: '1px solid rgba(0,84,166,0.25)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <div className="text-sm font-semibold">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Kanada · Mexíkó</div>
          </div>
        </div>
        {!started && (
          <div className="flex gap-1.5">
            {[{ v: days, l: 'd' }, { v: hours, l: 'h' }, { v: mins, l: 'm' }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center px-2 py-1.5 rounded-xl"
                   style={{ background: 'rgba(0,84,166,0.2)', minWidth: 36 }}>
                <span className="text-base font-bold tabular-nums leading-none">{String(v).padStart(2, '0')}</span>
                <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{l}</span>
              </div>
            ))}
          </div>
        )}
        {started && (
          <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            🔴 Í gangi
          </span>
        )}
      </div>

      {shown.length > 0 && (
        <div className="flex flex-col gap-2">
          {shown.map((f, i) => {
            const isToday = f.date === today
            const isPast = f.date < today
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                   style={{ background: isToday ? 'rgba(0,212,170,0.08)' : 'var(--surface2)' }}>
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-base">{f.home}</span>
                  <span className="text-xs font-medium truncate" style={{ maxWidth: 52 }}>{f.homeT}</span>
                </div>
                <div className="flex flex-col items-center shrink-0 px-2">
                  <span className="text-xs font-bold" style={{ color: isPast ? 'var(--muted)' : isToday ? 'var(--accent)' : 'var(--text)' }}>
                    {isToday ? 'Í DAG' : new Date(f.date + 'T12:00:00').toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{f.venue}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  <span className="text-xs font-medium truncate text-right" style={{ maxWidth: 52 }}>{f.awayT}</span>
                  <span className="text-base">{f.away}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {upcoming.length > 2 && (
        <button onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-xs mt-2 w-full justify-center"
          style={{ color: 'var(--accent)' }}>
          {showAll ? 'Fela' : `${upcoming.length - 2} fleiri leikir`}
          <ChevronRight size={12} className={showAll ? 'rotate-90' : ''} style={{ transition: 'transform 0.2s' }} />
        </button>
      )}
    </div>
  )
}
