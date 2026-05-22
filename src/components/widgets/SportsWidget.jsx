import { useState, useEffect } from 'react'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_END = new Date('2026-07-19T00:00:00')

const MATCHES = [
  { date: '2026-06-11', home: '🇲🇽 Mexíkó', away: '🇨🇦 Kanada', stage: 'Opnunarleikar', time: '22:00' },
  { date: '2026-06-11', home: '🇺🇸 Bandaríkin', away: '🇸🇷 Srb.', stage: 'Hópaleikir', time: '01:00' },
  { date: '2026-06-12', home: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', away: '🏳️ TBD', stage: 'Hópaleikir', time: '21:00' },
]

function getDaysUntil(date) {
  const now = new Date()
  const diff = date - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function SportsWidget() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const isLive = now >= WC_START && now <= WC_END
  const daysUntil = getDaysUntil(WC_START)
  const started = daysUntil <= 0

  return (
    <div className="card overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.06))',
      border: '1px solid rgba(34,197,94,0.2)',
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🏆</span>
          <span className="font-semibold text-sm">Heimsmeistaramót 2026</span>
        </div>
        {isLive && (
          <span className="badge animate-pulse-soft" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
            LIVE
          </span>
        )}
      </div>

      {!started ? (
        <div className="text-center py-2">
          <div className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
            {daysUntil}
          </div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            {daysUntil === 1 ? 'dagur' : 'dagar'} til keppni · 11. júní 2026
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            {['🇺🇸', '🇨🇦', '🇲🇽'].map(f => (
              <span key={f} className="text-2xl">{f}</span>
            ))}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Bandaríkin · Kanada · Mexíkó</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {MATCHES.slice(0, 2).map((m, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl text-sm"
              style={{ background: 'var(--surface2)' }}>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{m.home} — {m.away}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{m.stage} · {m.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 pt-2 flex items-center gap-3 overflow-x-auto" style={{ borderTop: '1px solid var(--border)', scrollbarWidth: 'none' }}>
        {[
          { label: '🏟️ 16 leiktilraunir', sub: 'Bandaríkin' },
          { label: '⚽ 104 leikir', sub: 'samtals' },
          { label: '🌍 48 lið', sub: 'þátttökuþjóðir' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col shrink-0 text-center">
            <span className="text-xs font-semibold">{s.label}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
