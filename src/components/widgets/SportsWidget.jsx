import { Trophy, ExternalLink } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

function daysUntil(target) {
  const now = new Date()
  const diff = target - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const HEADLINES = [
  {
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    title: 'England 26-manna World Cup lið tilkynnt',
    sub: 'Arsenal & Man City ráða ríkjum · Tuchel',
    hot: true,
  },
  {
    flag: '🇺🇸',
    title: 'Reyna tekinn á USMNT World Cup lista',
    sub: 'Þrátt fyrir fyrri deilur',
    hot: true,
  },
  {
    flag: '🔴',
    title: 'Yan Diomande — Liverpool leiðandi kaupandi',
    sub: 'Aðalmarkmið á miðjusvæðinu',
    hot: false,
  },
  {
    flag: '⛳',
    title: 'GOLF+ PCVR playtesting opið',
    sub: 'Steam VR beta skráning hafin',
    hot: false,
  },
]

const GROUPS = [
  { group: 'B', teams: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', '🇮🇷 Iran', '🇺🇸 USA', '🏴󠁧󠁢󠁷󠁬󠁳 Wales'] },
  { group: 'D', teams: ['🇫🇷 France', '🇩🇰 Danmark', '🇹🇳 Tunisia', '🇦🇺 Australia'] },
]

export default function SportsWidget() {
  const days = daysUntil(WC_START)
  const started = days === 0

  return (
    <div className="card flex flex-col gap-4">
      {/* World Cup countdown */}
      <div
        className="flex items-center gap-3 p-3 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(0,212,170,0.08))' }}
      >
        <div className="text-3xl">🏆</div>
        <div className="flex-1">
          <div className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)' }}>
            FIFA WORLD CUP 2026 · USA/CAN/MEX
          </div>
          {started ? (
            <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>🔴 Í gangi núna!</div>
          ) : (
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-bold tabular-nums">{days}</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>
                {days === 1 ? 'dagur eftir' : 'dagar eftir'}
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
          <div className="font-medium">11. júní</div>
          <div>2026</div>
        </div>
      </div>

      {/* Headlines */}
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>FRÉTTIR</div>
        <div className="flex flex-col gap-2.5">
          {HEADLINES.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">{h.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium leading-snug flex items-center gap-1.5">
                  {h.hot && (
                    <span
                      className="badge shrink-0"
                      style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontSize: 9 }}
                    >
                      HEITT
                    </span>
                  )}
                  {h.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{h.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between text-xs pt-1"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <span>The Athletic · Golf+ · Xbox</span>
        <Trophy size={11} />
      </div>
    </div>
  )
}
