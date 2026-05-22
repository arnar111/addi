import { useSports } from '../hooks/useSports'
import { Trophy, ExternalLink, RefreshCw } from 'lucide-react'

const WC_START = new Date('2026-06-11T19:00:00Z')

function getCountdown() {
  const diff = WC_START - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    mins: Math.floor((diff % 36e5) / 6e4),
  }
}

function MatchRow({ event }) {
  if (!event) return null
  const comp = event.competitions?.[0]
  if (!comp) return null
  const [home, away] = comp.competitors || []
  const status = comp.status?.type
  const isLive = status?.name === 'STATUS_IN_PROGRESS'
  const isFinal = status?.completed
  const isPre = !isFinal && !isLive

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
      {home?.team?.logo && (
        <img src={home.team.logo} alt="" className="w-5 h-5 object-contain" />
      )}
      <div className="flex-1 text-sm font-medium truncate text-right">
        {home?.team?.shortDisplayName || home?.team?.abbreviation}
      </div>
      <div className="shrink-0 text-center min-w-[52px]">
        {isPre ? (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(event.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : (
          <span className="text-sm font-bold tabular-nums">
            {home?.score} – {away?.score}
          </span>
        )}
        {isLive && (
          <div className="text-xs font-bold" style={{ color: '#22c55e' }}>
            {comp.status?.displayClock || 'LIVE'}
          </div>
        )}
        {isFinal && <div className="text-xs" style={{ color: 'var(--muted)' }}>FT</div>}
      </div>
      <div className="flex-1 text-sm font-medium truncate">
        {away?.team?.shortDisplayName || away?.team?.abbreviation}
      </div>
      {away?.team?.logo && (
        <img src={away.team.logo} alt="" className="w-5 h-5 object-contain" />
      )}
    </div>
  )
}

export default function Sports() {
  const { pl, wc, loading } = useSports()
  const cd = getCountdown()

  const plEvents = pl?.events || []
  const wcEvents = wc?.events || []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>World Cup 2026, Inter Milan & Premier League</p>
      </div>

      {/* World Cup Countdown */}
      <div className="card overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.05))',
        border: '1px solid rgba(59,130,246,0.25)',
      }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-bold tracking-widest mb-1" style={{ color: '#3b82f6' }}>
              FIFA WORLD CUP 2026
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              USA · Canada · Mexico · 11 júní – 19 júlí 2026
            </div>
          </div>
          <span className="badge animate-pulse-soft" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            Bráðlega
          </span>
        </div>

        {cd ? (
          <div className="flex gap-4 mb-4">
            {[['Dagar', cd.days], ['Klst', cd.hours], ['Mín', cd.mins]].map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="text-4xl font-bold tabular-nums" style={{ color: '#3b82f6' }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-2xl font-bold mb-4" style={{ color: '#3b82f6' }}>Í GANGI! ⚽</div>
        )}

        <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)' }}>
          <div className="text-xs font-semibold" style={{ color: '#3b82f6' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England qualified</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Thomas Tuchel leiðir England — Bellingham, Saka, Salah (Egyptaland) á meðal uppáhalda
          </div>
        </div>

        {wcEvents.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Leikir</div>
            {wcEvents.slice(0, 6).map(e => <MatchRow key={e.id} event={e} />)}
          </div>
        )}
      </div>

      {/* Inter Milan */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,0,20,0.8), rgba(0,0,80,0.2))',
        border: '1px solid rgba(100,100,255,0.15)',
      }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚫🔵</span>
          <div>
            <div className="font-semibold">Inter Milan</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>La Beneamata · Serie A 2025/26</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { title: 'Serie A', sub: '2025/26 Meistarar' },
            { title: 'Coppa Italia', sub: '2025/26 Sigurvegari' },
          ].map(t => (
            <div key={t.title} className="flex flex-col items-center gap-2 p-3 rounded-xl"
                 style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <Trophy size={22} style={{ color: '#eab308' }} />
              <div className="text-xs font-bold text-center" style={{ color: '#eab308' }}>{t.title}</div>
              <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>{t.sub}</div>
            </div>
          ))}
        </div>

        <div className="text-center p-3 rounded-xl font-semibold text-sm"
             style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>
          🏆🏆 DOUBLE! Tvöfaldur sigurvegari leiktímabilsins!
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { stat: '29', label: 'Sigrar' },
            { stat: '89', label: 'Stig' },
            { stat: '#1', label: 'Serie A' },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{s.stat}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Premier League */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <h3 className="font-semibold text-sm">Premier League</h3>
          </div>
          <a href="https://theathletic.com/uk/football/premier-league/" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
            The Athletic <ExternalLink size={11} />
          </a>
        </div>
        {loading ? (
          <div className="text-xs text-center py-6 animate-pulse-soft" style={{ color: 'var(--muted)' }}>
            Sæki niðurstöður...
          </div>
        ) : plEvents.length > 0 ? (
          <div className="flex flex-col gap-2">
            {plEvents.slice(0, 8).map(e => <MatchRow key={e.id} event={e} />)}
          </div>
        ) : (
          <div className="text-xs text-center py-6" style={{ color: 'var(--muted)' }}>
            <div className="text-2xl mb-2">🏁</div>
            Leikurinn er á enda · Bíðum eftir nýjum leiktíma
          </div>
        )}
      </div>

      {/* News links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Íþróttafréttir</h3>
        <div className="flex flex-col gap-2">
          {[
            { name: 'The Athletic', url: 'https://theathletic.com', desc: 'Djúpar íþróttafréttir', icon: '🏟️' },
            { name: 'BBC Sport', url: 'https://bbc.com/sport/football', desc: 'Knattspyrna fréttir', icon: '📺' },
            { name: 'ESPN FC', url: 'https://www.espn.com/soccer/', desc: 'Alþjóðleg knattspyrna', icon: '⚽' },
            { name: 'Inter.it', url: 'https://www.inter.it', desc: 'Opinber síða Inter', icon: '⚫🔵' },
          ].map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 p-3 rounded-xl transition-all active:scale-99"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl shrink-0">{l.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{l.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{l.desc}</div>
              </div>
              <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
