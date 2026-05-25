import { useSports, getMatchResult } from '../hooks/useSports'
import { RefreshCw, ExternalLink } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')
const WC_GROUPS = [
  { group: 'B', teams: ['🇺🇸 USA', '🏴󠁧󠁢󠥷󠁬󠁳󠁿 Wales', '🇪🇳 England', '🇦🇱 Albania'] },
]

function ResultBadge({ result }) {
  const color = result === 'W' ? 'var(--success)' : result === 'L' ? 'var(--danger)' : 'var(--muted)'
  const bg = result === 'W' ? 'rgba(34,197,94,0.1)' : result === 'L' ? 'rgba(239,68,68,0.1)' : 'var(--surface2)'
  return (
    <span
      className="text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0"
      style={{ color, background: bg, minWidth: 22, textAlign: 'center' }}
    >
      {result}
    </span>
  )
}

function EventCard({ event, teamKeyword }) {
  const { opponent, myScore, oppScore, hasResult, result, dateStr, isHome } = getMatchResult(event, teamKeyword)
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{isHome ? 'Heima' : 'Útileikur'}</span>
        </div>
        <div className="text-sm font-medium truncate mt-0.5">{opponent}</div>
        {event.strLeague && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{event.strLeague}</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {hasResult ? (
          <>
            <ResultBadge result={result} />
            <span className="text-sm font-mono font-semibold">{myScore}–{oppScore}</span>
          </>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateStr}</span>
        )}
      </div>
    </div>
  )
}

function TeamSection({ teamData, teamKeyword, emoji, league, color }) {
  if (!teamData) return null
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-semibold">{teamData.name}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{league}</div>
        </div>
      </div>

      {teamData.last?.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Síðustu leikir
          </div>
          {teamData.last.map((e, i) => (
            <EventCard key={i} event={e} teamKeyword={teamKeyword} />
          ))}
        </>
      )}

      {teamData.next?.length > 0 && (
        <>
          <div className="text-xs font-semibold mt-4 mb-2" style={{ color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Næstu leikir
          </div>
          {teamData.next.map((e, i) => (
            <EventCard key={i} event={e} teamKeyword={teamKeyword} />
          ))}
        </>
      )}
    </div>
  )
}

export default function Sports() {
  const { data, loading, error } = useSports()

  const now = new Date()
  const daysToWC = Math.ceil((WC_START - now) / (1000 * 60 * 60 * 24))
  const hoursToWC = Math.ceil((WC_START - now) / (1000 * 60 * 60))
  const showWC = daysToWC <= 60

  const refreshSports = () => {
    sessionStorage.removeItem('addi_sports_v2')
    sessionStorage.removeItem('addi_sports_v2_at')
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Inter · Cavaliers · World Cup</p>
        </div>
        <button onClick={refreshSports} className="btn btn-ghost" style={{ padding: '8px' }}>
          <RefreshCw size={16} style={{ color: 'var(--muted)' }} />
        </button>
      </div>

      {/* World Cup Countdown */}
      {showWC && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.1))',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold mb-1">FIFA World Cup 2026</div>
              <div className="flex items-baseline gap-2 mb-2">
                {daysToWC > 0 ? (
                  <>
                    <span className="text-5xl font-bold" style={{ color: '#f97316' }}>{daysToWC}</span>
                    <span style={{ color: 'var(--muted)' }}>dagar eftir</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold" style={{ color: '#22c55e' }}>Í gangi! 🔥</span>
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>11. júní 2026 · USA / Canada / México</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Ísland liðið → Leikjum
              </div>
            </div>
            <div className="text-6xl">🏆</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['🇮🇸 Ísland', '⚫🔵 Inter leikmenn', '🇺🇸 USMNT', '🇮🇹 Ítalía'].map(t => (
              <span key={t} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}>
                {t}
              </span>
            ))}
          </div>

          <a
            href="https://theathletic.com/tag/world-cup-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 mt-3 text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            <ExternalLink size={12} />
            WC2026 fréttir á The Athletic
          </a>
        </div>
      )}

      {error && (
        <div className="card text-sm" style={{ color: 'var(--muted)' }}>
          Gat ekki sótt leikjaupplýsingar. Prófaðu að endurhlaða.
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="card animate-pulse-soft">
              <div className="h-5 w-32 rounded mb-4" style={{ background: 'var(--surface2)' }} />
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="h-3 rounded" style={{ background: 'var(--surface2)', width: '50%' }} />
                  <div className="h-3 rounded w-12" style={{ background: 'var(--surface2)' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {data && (
        <>
          <TeamSection
            teamData={data.inter}
            teamKeyword="inter"
            emoji="⚫🔵"
            league="Serie A · Champions League"
            color="var(--accent)"
          />
          <TeamSection
            teamData={data.cavs}
            teamKeyword="cavaliers"
            emoji="🏀"
            league="NBA · Eastern Conference"
            color="#f97316"
          />
        </>
      )}

      {/* Quick links to Athletic */}
      <div className="card flex flex-col gap-2">
        <div className="text-sm font-semibold mb-1">Fréttir</div>
        {[
          { label: 'Inter Milan · The Athletic', url: 'https://theathletic.com/tag/inter-milan/', emoji: '⚫🔵' },
          { label: 'NBA · The Athletic', url: 'https://theathletic.com/nba/', emoji: '🏀' },
          { label: 'World Cup 2026', url: 'https://theathletic.com/tag/world-cup-2026/', emoji: '🏆' },
          { label: 'Serie A', url: 'https://theathletic.com/serie-a/', emoji: '🇮🇹' },
        ].map(l => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
            style={{ background: 'var(--surface2)' }}
          >
            <span className="text-base shrink-0">{l.emoji}</span>
            <span className="text-sm flex-1">{l.label}</span>
            <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
          </a>
        ))}
      </div>
    </div>
  )
}
