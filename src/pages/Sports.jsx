import { useState } from 'react'
import { useFootball, daysUntilWC } from '../hooks/useFootball'
import { ExternalLink } from 'lucide-react'

const ENGLAND_GROUP = {
  name: 'Hópur B',
  teams: ['England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Bandaríkin 🇺🇸', 'Panama 🇵🇦', 'Ekvador 🇪🇨'],
}

function MatchCard({ event }) {
  const comp = event.competitions?.[0]
  const home = comp?.competitors?.find(c => c.homeAway === 'home')
  const away = comp?.competitors?.find(c => c.homeAway === 'away')
  const state = comp?.status?.type?.state
  const isLive = state === 'in'
  const isFinal = state === 'post'

  return (
    <div className="card py-3"
         style={{ border: isLive ? '1px solid rgba(239,68,68,0.35)' : '1px solid var(--border)' }}>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {home?.team?.displayName || home?.team?.name}
            </span>
            <span className="text-xl font-bold tabular-nums ml-3">
              {(isFinal || isLive) ? home?.score : '–'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {away?.team?.displayName || away?.team?.name}
            </span>
            <span className="text-xl font-bold tabular-nums ml-3">
              {(isFinal || isLive) ? away?.score : '–'}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0 pl-2" style={{ borderLeft: '1px solid var(--border)' }}>
          {isLive ? (
            <span className="badge animate-pulse-soft"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              LIVE
            </span>
          ) : isFinal ? (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</span>
          ) : (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(event.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {comp?.status?.displayClock && isLive && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>
              {comp.status.displayClock}'
            </div>
          )}
        </div>
      </div>
      {comp?.venue?.fullName && (
        <div className="text-xs mt-2 pt-2 flex items-center gap-1"
             style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          📍 {comp.venue.fullName}
          {comp.venue.address?.city && `, ${comp.venue.address.city}`}
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const [tab, setTab] = useState('leikir')
  const { events, loading, error, daysLeft } = useFootball('FIFA.WORLD')
  const isLive = events.some(e => e.competitions?.[0]?.status?.type?.state === 'in')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Knattspyrna</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          HM 2026 · USA / Kanada / Mexíkó
        </p>
      </div>

      {/* World Cup countdown */}
      {daysLeft > 0 && (
        <div className="card"
             style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.1), rgba(255,140,0,0.07))', border: '1px solid rgba(230,57,70,0.25)' }}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">🏆</div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'rgba(230,57,70,0.9)' }}>
                HM 2026 HEFST EFTIR
              </div>
              <div className="text-4xl font-bold">{daysLeft}</div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                dagar · 11. júní 2026
              </div>
            </div>
          </div>
        </div>
      )}

      {/* England card */}
      <div className="card flex items-center gap-3">
        <span className="text-3xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
        <div className="flex-1">
          <div className="font-semibold text-sm">England</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {ENGLAND_GROUP.name} · {ENGLAND_GROUP.teams.join(' · ')}
          </div>
        </div>
        <span className="badge" style={{ background: 'rgba(230,57,70,0.12)', color: '#e63946' }}>
          ⭐ Uppáhalds
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['leikir', '⚽ Leikir'], ['hópar', '🏆 Hópar']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(230,57,70,0.12)' : 'var(--surface)',
              color: tab === t ? '#e63946' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(230,57,70,0.3)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'leikir' && (
        <div className="flex flex-col gap-2">
          {loading && (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse-soft py-6"
                   style={{ background: 'var(--surface2)' }} />
            ))
          )}
          {!loading && error && (
            <div className="card text-center py-8">
              <div className="text-3xl mb-2">⚽</div>
              <div className="text-sm font-medium">Engir leikir fundir</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                HM leikir hefjast 11. júní 2026
              </div>
            </div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="card text-center py-10">
              <div className="text-4xl mb-3">⚽</div>
              <div className="text-sm font-semibold">Engir leikir í dag</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Keppnin hefst 11. júní 2026 — {daysLeft} dagar eftir!
              </div>
            </div>
          )}
          {events.map(e => <MatchCard key={e.id} event={e} />)}
        </div>
      )}

      {tab === 'hópar' && (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-sm font-semibold">Hópaskipting bráðlega</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Hópaleikir hefjast 12. júní 2026
          </div>
          <div className="mt-4 p-3 rounded-xl text-left" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#e63946' }}>
              🏴󠁧󠁢󠁥󠁮󠁧󠁿 {ENGLAND_GROUP.name}
            </div>
            {ENGLAND_GROUP.teams.map(t => (
              <div key={t} className="text-sm py-1">{t}</div>
            ))}
          </div>
        </div>
      )}

      {/* The Athletic link */}
      <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
         className="card flex items-center gap-3 py-3 active:scale-[0.98] transition-transform"
         style={{ border: '1px solid rgba(230,57,70,0.2)', textDecoration: 'none' }}>
        <span className="text-2xl">📰</span>
        <div className="flex-1">
          <div className="text-sm font-medium">The Athletic</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Dýpri umfjöllun og greinar
          </div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
      </a>
    </div>
  )
}
