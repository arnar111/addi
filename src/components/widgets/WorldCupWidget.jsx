import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T00:00:00')

export default function WorldCupWidget() {
  const now = new Date()
  const days = Math.max(0, Math.ceil((WC_START - now) / (1000 * 60 * 60 * 24)))
  const started = now >= WC_START

  return (
    <Link to="/sports" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(0,0,180,0.08), rgba(0,150,57,0.08))',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
               style={{ background: 'rgba(255,255,255,0.06)' }}>
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold tracking-wide" style={{ color: 'var(--muted)' }}>
              FIFA WORLD CUP 2026
            </div>
            <div className="text-sm font-semibold mt-0.5">
              🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              11. júní – 19. júlí · 48 lið · 104 leikir
            </div>
          </div>
          {started ? (
            <div className="text-right shrink-0">
              <div className="text-xl">⚽</div>
              <div className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Í gangi!</div>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{days}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
