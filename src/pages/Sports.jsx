import { useFootball } from '../hooks/useFootball'
import { ExternalLink, RefreshCw } from 'lucide-react'

const FORM_COLORS = { W: 'var(--success)', L: 'var(--danger)', D: '#f97316' }
const FORM_BG = { W: 'rgba(34,197,94,0.12)', L: 'rgba(239,68,68,0.12)', D: 'rgba(249,115,22,0.12)' }

const SPORTS_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', desc: 'In-depth football coverage' },
  { label: 'West Ham FC', url: 'https://www.whufc.com', icon: '⚒️', desc: 'Official WHUFC site' },
  { label: 'BBC Sport', url: 'https://www.bbc.co.uk/sport/football', icon: '📡', desc: 'Football news & scores' },
  { label: 'ATP Tour', url: 'https://www.atptour.com', icon: '🎾', desc: 'Tennis – Sinner & rankings' },
  { label: 'ESPN FC', url: 'https://www.espn.com/soccer', icon: '🏆', desc: 'Global football coverage' },
  { label: 'USMNT', url: 'https://www.ussoccer.com', icon: '🇺🇸', desc: 'US Soccer national team' },
  { label: 'Flashscore', url: 'https://www.flashscore.com', icon: '⚡', desc: 'Live scores' },
  { label: 'FBref', url: 'https://fbref.com/en/squads/7c21e445/West-Ham-United-Stats', icon: '📊', desc: 'WHU stats & data' },
]

function MatchCard({ match, label }) {
  if (!match) {
    return (
      <div className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>{label}</div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar upplýsingar</div>
      </div>
    )
  }

  const d = new Date(match.date)
  const dateStr = d.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = d.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-3 rounded-xl flex flex-col gap-1.5" style={{ background: 'var(--surface2)' }}>
      <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold flex-1 truncate">{match.home.name}</span>
        {match.completed ? (
          <span className="text-base font-bold tabular-nums px-2" style={{ color: 'var(--accent)' }}>
            {match.home.score} – {match.away.score}
          </span>
        ) : (
          <span className="text-sm font-bold px-2" style={{ color: 'var(--muted)' }}>vs</span>
        )}
        <span className="text-sm font-semibold flex-1 text-right truncate">{match.away.name}</span>
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>
        {dateStr}{!match.completed && ` · ${timeStr}`}
        {match.venue && ` · ${match.venue}`}
      </div>
    </div>
  )
}

export default function Sports() {
  const { data, loading } = useFootball()

  const refresh = () => {
    sessionStorage.removeItem('addi_football')
    sessionStorage.removeItem('addi_footballAt')
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>West Ham · Tennis · Fótbolti</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost text-xs gap-1.5 py-1.5">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* West Ham Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(100,116,139,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚒️</span>
            <div>
              <div className="font-semibold">West Ham United</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>EFL Championship</div>
            </div>
          </div>
          {/* Form badges */}
          {data?.recentForm?.length > 0 && (
            <div className="flex items-center gap-1">
              {data.recentForm.map((r, i) => (
                <div key={i}
                     className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                     style={{ background: FORM_BG[r] || 'var(--surface2)', color: FORM_COLORS[r] || 'var(--muted)' }}>
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-2 animate-pulse-soft">
            {[1,2].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            <MatchCard match={data?.last} label="Síðasti leikur" />
            <MatchCard match={data?.next} label="Næsti leikur" />
          </div>
        )}
      </div>

      {/* Sports Links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Fréttir & Hlekkir</h3>
        <div className="flex flex-col gap-1.5">
          {SPORTS_LINKS.map(link => (
            <a key={link.url}
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-3 p-3 rounded-xl transition-all active:scale-98"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl shrink-0">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{link.desc}</div>
              </div>
              <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
