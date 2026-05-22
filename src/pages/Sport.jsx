import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, Trophy, Zap } from 'lucide-react'

// ── World Cup countdown ──────────────────────────────────────────────────────
const WC_START = new Date('2026-06-11T00:00:00-05:00')
const WC_END   = new Date('2026-07-19T00:00:00-05:00')
function pad(n) { return String(n).padStart(2, '0') }

function WCCountdown() {
  const [cd, setCd] = useState(null)
  const now = Date.now()
  const isLive = now >= WC_START.getTime() && now < WC_END.getTime()
  const isDone = now >= WC_END.getTime()

  useEffect(() => {
    if (isLive || isDone) return
    function tick() {
      const diff = WC_START.getTime() - Date.now()
      if (diff <= 0) { setCd(null); return }
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isLive, isDone])

  const groups = [
    { label: 'Group A', teams: ['🇲🇽 Mexico', '🇧🇷 Brazil', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', '🇸🇪 Sweden'] },
    { label: 'Group B', teams: ['🇦🇷 Argentina', '🇫🇷 France', '🇳🇱 Netherlands', '🇵🇪 Peru'] },
    { label: 'Group C', teams: ['🇩🇪 Germany', '🇧🇪 Belgium', '🇺🇸 USA', '🇸🇳 Senegal'] },
    { label: 'Group D', teams: ['🇵🇹 Portugal', '🇪🇸 Spain', '🇨🇦 Canada', '🇦🇺 Australia'] },
  ]

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(0,0,0,0))', border: '1px solid rgba(249,115,22,0.3)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-bold tracking-wider" style={{ color: '#f97316' }}>🏆 FIFA WORLD CUP 2026</div>
          <div className="font-semibold mt-0.5">
            {isLive ? '⚽ Í gangi núna!' : isDone ? 'Lokið' : 'Byrjar 11. júní 2026'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {isLive ? 'USA · Canada · Mexico' : '48 lið · 104 leikir · 3 lönd'}
          </div>
        </div>
        <div className="text-5xl">⚽</div>
      </div>

      {!isLive && !isDone && cd && (
        <div className="flex gap-2 mb-4">
          {[['d', 'Dagar'], ['h', 'Klst'], ['m', 'Mín'], ['s', 'Sek']].map(([k, lbl]) => (
            <div key={k} className="flex-1 flex flex-col items-center py-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <span className="text-2xl font-bold tabular-nums" style={{ color: '#f97316' }}>{pad(cd[k])}</span>
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>{lbl}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {groups.map(g => (
          <div key={g.label} className="rounded-xl p-3" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#f97316' }}>{g.label}</div>
            {g.teams.map(t => (
              <div key={t} className="text-xs py-0.5" style={{ color: 'var(--text)' }}>{t}</div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>Sýnishorn · Uppsetning kann að breytast</p>
    </div>
  )
}

// ── ESPN soccer ──────────────────────────────────────────────────────────────
function SoccerScores() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [league, setLeague] = useState('eng.1')

  const leagues = [
    { id: 'eng.1',            label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL' },
    { id: 'uefa.champions',   label: '⭐ UCL' },
    { id: 'uefa.europa',      label: '🟠 UEL' },
    { id: 'esp.1',            label: '🇪🇸 La Liga' },
  ]

  useEffect(() => {
    setLoading(true)
    const cacheKey = `espn_soccer_${league}`
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3 * 60 * 1000) {
      setMatches(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).slice(0, 10).map(ev => {
          const comp = ev.competitions?.[0]
          const home = comp?.competitors?.find(c => c.homeAway === 'home')
          const away = comp?.competitors?.find(c => c.homeAway === 'away')
          const status = comp?.status?.type
          return {
            id: ev.id,
            home: home?.team?.shortDisplayName || home?.team?.displayName || '?',
            away: away?.team?.shortDisplayName || away?.team?.displayName || '?',
            homeScore: home?.score ?? '',
            awayScore: away?.score ?? '',
            state: status?.state || 'pre',
            detail: status?.shortDetail || status?.detail || '',
            clock: comp?.status?.displayClock || '',
            date: ev.date,
          }
        })
        sessionStorage.setItem(cacheKey, JSON.stringify(events))
        sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
        setMatches(events)
        setLoading(false)
      })
      .catch(() => { setMatches([]); setLoading(false) })
  }, [league])

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">⚽ Leikir</div>
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {leagues.map(l => (
            <button key={l.id} onClick={() => setLeague(l.id)}
              className="text-xs px-2 py-1 rounded-lg shrink-0 transition-all"
              style={{
                background: league === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: league === l.id ? 'var(--accent)' : 'var(--muted)',
              }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => <div key={i} className="animate-pulse-soft h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-6" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-1">📅</div>
          <div className="text-sm">Engir leikir á dagskrá</div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {matches.map(m => {
            const isLive = m.state === 'in'
            const isDone = m.state === 'post'
            return (
              <div key={m.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                   style={{ background: isLive ? 'rgba(0,212,170,0.06)' : 'var(--surface2)', border: isLive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent' }}>
                <div className="flex-1 text-sm text-right truncate">{m.home}</div>
                <div className="shrink-0 text-center w-20">
                  {m.state !== 'pre' ? (
                    <span className="font-bold tabular-nums" style={{ color: isLive ? 'var(--accent)' : 'var(--text)' }}>
                      {m.homeScore} – {m.awayScore}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(m.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {isLive && <div className="text-xs animate-pulse-soft" style={{ color: 'var(--accent)' }}>{m.clock || 'LIVE'}</div>}
                  {isDone && <div className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</div>}
                </div>
                <div className="flex-1 text-sm truncate">{m.away}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Golf scoreboard ──────────────────────────────────────────────────────────
function GolfLeaderboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('espn_golf')
    const cachedAt = sessionStorage.getItem('espn_golf_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 10 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch('https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard')
      .then(r => r.json())
      .then(d => {
        const event = d.events?.[0]
        if (!event) { setLoading(false); return }
        const comp = event.competitions?.[0]
        const players = (comp?.competitors || []).slice(0, 8).map(p => ({
          name: p.athlete?.shortName || p.athlete?.displayName || '?',
          score: p.score || 'E',
          pos: p.status?.position?.displayName || '-',
          thru: p.status?.thru || '-',
        }))
        const result = { name: event.shortName || event.name, players, status: comp?.status?.type?.description }
        sessionStorage.setItem('espn_golf', JSON.stringify(result))
        sessionStorage.setItem('espn_golf_at', String(Date.now()))
        setData(result)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="card flex flex-col gap-3">
      <div className="text-sm font-semibold">⛳ Golf</div>
      {loading ? (
        <div className="animate-pulse-soft h-20 rounded-xl" style={{ background: 'var(--surface2)' }} />
      ) : !data ? (
        <div className="text-center py-4" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-1">⛳</div>
          <div className="text-sm">Engin mót á dagskrá</div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{data.name}</div>
            {data.status && <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>{data.status}</span>}
          </div>
          <div className="flex flex-col gap-0">
            {data.players.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2"
                   style={{ borderBottom: i < data.players.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-5 text-right" style={{ color: 'var(--muted)' }}>{p.pos}</span>
                  <span className="text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Thru {p.thru}</span>
                  <span className="text-sm font-semibold w-8 text-right"
                        style={{ color: p.score?.startsWith('-') ? 'var(--success)' : p.score?.startsWith('+') ? 'var(--danger)' : 'var(--text)' }}>
                    {p.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Sport news via ESPN ───────────────────────────────────────────────────────
function SportNews() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('espn_news')
    const cachedAt = sessionStorage.getItem('espn_news_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setItems(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news')
      .then(r => r.json())
      .then(d => {
        const news = (d.articles || []).slice(0, 6).map(a => ({
          headline: a.headline,
          description: a.description,
          link: a.links?.web?.href || '#',
          published: a.published,
          images: a.images?.[0]?.url,
        }))
        sessionStorage.setItem('espn_news', JSON.stringify(news))
        sessionStorage.setItem('espn_news_at', String(Date.now()))
        setItems(news)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function timeAgo(s) {
    if (!s) return ''
    const diff = Date.now() - new Date(s).getTime()
    const h = Math.floor(diff / 3600000)
    return h < 24 ? `${h}h` : `${Math.floor(h/24)}d`
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="text-sm font-semibold">📰 Íþróttafréttir</div>
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => <div key={i} className="animate-pulse-soft h-4 rounded" style={{ background: 'var(--surface2)', width: `${60+i*12}%` }} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {items.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
               className="flex items-start gap-3 py-2.5 group"
               style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {item.images && (
                <img src={item.images} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">{item.headline}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{timeAgo(item.published)}</div>
              </div>
            </a>
          ))}
          {items.length === 0 && (
            <div className="text-center py-4" style={{ color: 'var(--muted)' }}>Engar fréttir tiltækar</div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Sport() {
  const [tab, setTab] = useState('wc')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['wc', '🏆 HM 2026'], ['soccer', '⚽ Knattspyrna'], ['golf', '⛳ Golf'], ['news', '📰 Fréttir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
              fontSize: 13,
              padding: '6px 12px',
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'wc'     && <WCCountdown />}
      {tab === 'soccer' && <SoccerScores />}
      {tab === 'golf'   && <GolfLeaderboard />}
      {tab === 'news'   && <SportNews />}
    </div>
  )
}
