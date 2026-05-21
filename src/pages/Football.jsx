import { useState } from 'react'
import { useWorldCup, WC_START, WC_END } from '../hooks/useWorldCup'
import { Zap, RefreshCw, Newspaper } from 'lucide-react'

function MatchCard({ m }) {
  const isLive = m.statusName === 'in'
  const isDone = m.completed
  const isPre = !isLive && !isDone

  const matchDate = new Date(m.date)
  const timeStr = matchDate.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
  const dateStr = matchDate.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="card py-3 px-4" style={{
      background: isLive ? 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(0,212,170,0.04))' : undefined,
      border: isLive ? '1px solid rgba(239,68,68,0.2)' : undefined,
    }}>
      {/* Match header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
          {m.note || m.group || dateStr}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <Zap size={8} /> {m.displayClock || 'LIVE'}
          </span>
        ) : isDone ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>Lokið</span>
        ) : (
          <span className="text-[10px] font-medium" style={{ color: 'var(--accent)' }}>{timeStr}</span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{m.home.flag}</span>
          <span className="text-xs font-medium text-center leading-tight">{m.home.name}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center min-w-[64px]">
          {(isLive || isDone) ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums">{m.home.score}</span>
              <span className="text-lg" style={{ color: 'var(--muted)' }}>–</span>
              <span className="text-2xl font-bold tabular-nums">{m.away.score}</span>
            </div>
          ) : (
            <span className="text-base font-bold" style={{ color: 'var(--muted)' }}>–</span>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{m.away.flag}</span>
          <span className="text-xs font-medium text-center leading-tight">{m.away.name}</span>
        </div>
      </div>

      {m.venue && (
        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--muted)' }}>📍 {m.venue}</p>
      )}
    </div>
  )
}

function NewsCard({ article }) {
  const pubDate = article.published
    ? new Date(article.published).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
    : null

  const Inner = (
    <div className="card flex gap-3 items-start py-3">
      {article.image && (
        <img src={article.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0"
             onError={e => { e.target.style.display = 'none' }} />
      )}
      {!article.image && (
        <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
             style={{ background: 'var(--surface2)' }}>
          <Newspaper size={20} style={{ color: 'var(--muted)' }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-2">{article.headline}</p>
        {article.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>{article.description}</p>
        )}
        {pubDate && (
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--muted)' }}>{pubDate}</p>
        )}
      </div>
    </div>
  )

  if (article.link) {
    return (
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
        {Inner}
      </a>
    )
  }
  return Inner
}

function CountdownBlock({ days }) {
  const now = new Date()
  const hours = Math.floor(((WC_START - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <div className="card text-center py-6" style={{
      background: 'linear-gradient(135deg, rgba(0,85,164,0.12), rgba(239,68,68,0.10))',
    }}>
      <div className="text-4xl mb-3">🏆</div>
      <h2 className="font-bold text-lg mb-1">FIFA World Cup 2026</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
        🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 México
      </p>
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{days}</span>
          <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>dagar</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent2)' }}>{hours}</span>
          <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>klukkustundir</span>
        </div>
      </div>
      <p className="text-sm font-medium">
        Hefst {WC_START.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
        48 lið · 16 hópar · 104 leikir
      </p>
    </div>
  )
}

export default function Football() {
  const [tab, setTab] = useState('matches')
  const {
    loading, preWC, days,
    liveMatches, todayMatches, completedMatches, upcomingMatches,
    news,
  } = useWorldCup()

  const matchesToShow = liveMatches.length > 0
    ? { label: '🔴 Í leik', items: liveMatches }
    : todayMatches.length > 0
      ? { label: 'Í dag', items: todayMatches }
      : completedMatches.length > 0
        ? { label: 'Síðustu niðurstöður', items: completedMatches.slice(0, 6) }
        : upcomingMatches.length > 0
          ? { label: 'Næstu leikir', items: upcomingMatches.slice(0, 6) }
          : null

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {liveMatches.length > 0
              ? `${liveMatches.length} leikir í gangi núna`
              : preWC
                ? `HMK 2026 · ${days} dagar`
                : 'FIFA World Cup 2026'}
          </p>
        </div>
        {liveMatches.length > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <Zap size={12} /> LIVE
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['matches', '⚽ Leikir'], ['news', '📰 Fréttir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="card animate-pulse-soft" style={{ height: 120 }} />
          ))}
        </div>
      )}

      {!loading && tab === 'matches' && (
        <div className="flex flex-col gap-3">
          {preWC && <CountdownBlock days={days} />}

          {matchesToShow && (
            <>
              <h3 className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>
                {matchesToShow.label}
              </h3>
              {matchesToShow.items.map(m => <MatchCard key={m.id} m={m} />)}
            </>
          )}

          {!matchesToShow && !preWC && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engir leikir tiltækir
            </div>
          )}
        </div>
      )}

      {!loading && tab === 'news' && (
        <div className="flex flex-col gap-2">
          {news.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar fréttir tiltækar
            </div>
          ) : (
            news.map(a => <NewsCard key={a.id} article={a} />)
          )}
        </div>
      )}
    </div>
  )
}
