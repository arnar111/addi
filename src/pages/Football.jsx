import { useState, useEffect } from 'react'
import { useFootball } from '../hooks/useFootball'
import { Trophy, Calendar, RefreshCw, ExternalLink, Star } from 'lucide-react'

const WC_START = new Date('2026-06-11T19:00:00Z') // Opening match UTC

function useCountdown(target) {
  const [left, setLeft] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) return setLeft({ done: true })
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      })
    }
    calc()
    const t = setInterval(calc, 30000)
    return () => clearInterval(t)
  }, [target])
  return left
}

function MatchCard({ match }) {
  const comps = match.competitions?.[0]
  const home = comps?.competitors?.find(c => c.homeAway === 'home')
  const away = comps?.competitors?.find(c => c.homeAway === 'away')
  const status = match.status?.type

  const isLive = status?.state === 'in'
  const isFinal = status?.state === 'post'
  const isPre = status?.state === 'pre'
  const matchDate = new Date(match.date)
  const matchTime = matchDate.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })

  const isArsenal = home?.team?.id === '359' || away?.team?.id === '359'

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl"
         style={{ background: isArsenal ? 'rgba(220,38,38,0.06)' : 'var(--surface2)',
                  border: isArsenal ? '1px solid rgba(220,38,38,0.15)' : '1px solid transparent' }}>
      {/* Home */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {home?.team?.logo
          ? <img src={home.team.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          : <div className="w-5 h-5 rounded-full shrink-0" style={{ background: 'var(--border)' }} />
        }
        <span className="text-sm truncate" style={{ fontWeight: isArsenal && home?.team?.id === '359' ? 600 : 400 }}>
          {home?.team?.shortDisplayName || home?.team?.displayName || '?'}
        </span>
      </div>

      {/* Score / Time */}
      <div className="flex flex-col items-center px-3 shrink-0 min-w-[60px]">
        {isLive ? (
          <>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--danger)' }} />
              <span className="text-sm font-bold">{home?.score ?? 0} - {away?.score ?? 0}</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--danger)', fontSize: 10 }}>
              {status?.detail || 'LIVE'}
            </span>
          </>
        ) : isFinal ? (
          <>
            <span className="text-sm font-bold">{home?.score ?? 0} - {away?.score ?? 0}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>Lokið</span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{matchTime}</span>
          </>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className="text-sm truncate" style={{ fontWeight: isArsenal && away?.team?.id === '359' ? 600 : 400 }}>
          {away?.team?.shortDisplayName || away?.team?.displayName || '?'}
        </span>
        {away?.team?.logo
          ? <img src={away.team.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          : <div className="w-5 h-5 rounded-full shrink-0" style={{ background: 'var(--border)' }} />
        }
      </div>
    </div>
  )
}

function ArsenalRecentResults({ arsenalData }) {
  const events = arsenalData?.events || []
  const recent = events
    .filter(e => e.status?.type?.state === 'post')
    .slice(-5)
    .reverse()

  if (recent.length === 0) return null

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔴</span>
        <span className="font-semibold text-sm">Arsenal · Nýlegir leikir</span>
        <span className="badge ml-auto" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>A* tímabilið</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {recent.map(match => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  )
}

export default function Football() {
  const { plData, wcData, arsenalData, loading } = useFootball()
  const countdown = useCountdown(WC_START)

  const plEvents = plData?.events || []
  const wcEvents = wcData?.events || []

  const todayPl = plEvents.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">⚽ Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League · World Cup 2026</p>
        </div>
      </div>

      {/* World Cup countdown */}
      {!countdown.done && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(0,212,170,0.06))',
          border: '1px solid rgba(139,92,246,0.25)'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} style={{ color: 'var(--accent2)' }} />
            <span className="font-semibold">FIFA World Cup 2026</span>
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent3)' }}>Bráðlega!</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[['Dagar', countdown.days], ['Klukkustundir', countdown.hours], ['Mínútur', countdown.minutes]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center py-3 rounded-2xl"
                   style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <span className="text-3xl font-bold" style={{ color: 'var(--accent2)' }}>{val ?? '--'}</span>
                <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            🌍 11. júní – 19. júlí 2026 · USA, Kanada, Mexíkó
          </div>
          <div className="flex gap-2 mt-3">
            {['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', '🇮🇸 Ísland?', '🇪🇸 Spánn', '🇫🇷 Frakkland', '🇧🇷 Brasilía'].map(team => (
              <span key={team} className="text-xs px-2 py-1 rounded-full shrink-0"
                    style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{team}</span>
            ))}
          </div>
        </div>
      )}

      {/* World Cup matches (when started) */}
      {countdown.done && wcEvents.length > 0 && (
        <div className="card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Trophy size={15} style={{ color: 'var(--accent2)' }} />
            <span className="font-semibold text-sm">World Cup 2026 · Í dag</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {wcEvents.slice(0, 10).map(e => <MatchCard key={e.id} match={e} />)}
          </div>
        </div>
      )}

      {/* Premier League */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <span className="font-semibold text-sm">Premier League 2025/26</span>
          </div>
          {loading && <RefreshCw size={13} className="animate-spin" style={{ color: 'var(--muted)' }} />}
        </div>

        {loading ? (
          <div className="flex flex-col gap-1.5">
            {[1,2,3].map(i => (
              <div key={i} className="h-11 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
            ))}
          </div>
        ) : todayPl.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {todayPl.map(e => <MatchCard key={e.id} match={e} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 gap-2">
            <span className="text-2xl">⚽</span>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Engir leikir í dag</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Tímabilslok 2025/26 · Arsenal fékk A*</p>
          </div>
        )}
      </div>

      {/* Arsenal recent */}
      {!loading && arsenalData && <ArsenalRecentResults arsenalData={arsenalData} />}

      {/* Arsenal card */}
      <div className="card flex items-center gap-3" style={{ border: '1px solid rgba(220,38,38,0.2)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(220,38,38,0.1)' }}>
          <span className="text-2xl">🔴</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold">Arsenal FC</div>
          <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted)' }}>
            <Star size={10} style={{ color: '#f59e0b' }} />
            <span>A* einkunn þetta tímabil · Premier League 2025/26</span>
          </div>
        </div>
        <a href="https://www.arsenal.com" target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs py-1.5 px-3">
          <ExternalLink size={12} />
        </a>
      </div>

      {/* The Athletic */}
      <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
         className="card flex items-center gap-3" style={{ border: '1px solid rgba(249,115,22,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(249,115,22,0.1)' }}>
          <span className="text-lg">📰</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">The Athletic</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Íþróttagreinar og greindir leikir</div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
      </a>
    </div>
  )
}
