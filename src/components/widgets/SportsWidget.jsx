import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ChevronRight, ExternalLink } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')

const TEAM_BTNS = [
  { emoji: '🔵', label: 'City', search: 'Man City FC' },
  { emoji: '❤️', label: 'LFC', search: 'Liverpool FC' },
  { emoji: '🇮🇸', label: 'Ísland', search: 'Ísland landsliðið' },
]

export default function SportsWidget() {
  const [diff, setDiff] = useState(() => Math.max(0, WC_START.getTime() - Date.now()))

  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, WC_START.getTime() - Date.now())), 60000)
    return () => clearInterval(id)
  }, [])

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const done = diff <= 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(249,115,22,0.15)' }}>
            <Trophy size={14} style={{ color: 'var(--accent3)' }} />
          </div>
          <h3 className="font-semibold text-sm">Íþróttir</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="rounded-xl p-3 mb-3" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.08))',
        border: '1px solid rgba(0,212,170,0.2)',
      }}>
        <div className="text-xs font-bold mb-1" style={{ color: 'rgba(0,212,170,0.8)', letterSpacing: '0.05em' }}>
          ⚽ WC2026
        </div>
        {done ? (
          <div className="font-black text-sm" style={{ color: 'var(--accent)' }}>🎉 Keppnin er hafin!</div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tabular-nums" style={{ color: '#fff' }}>{days}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
              {days === 1 ? 'dagur' : 'dagar'}
            </span>
            {hours > 0 && (
              <>
                <span className="text-lg font-black tabular-nums ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{hours}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>klst</span>
              </>
            )}
            <span className="text-xs ml-1" style={{ color: 'var(--muted)' }}>eftir</span>
          </div>
        )}
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>11. júní 2026 · Kanada/Mexíkó/BNA</div>
      </div>

      <div className="flex gap-2 mb-3">
        {TEAM_BTNS.map(team => (
          <a key={team.label}
             href={`https://www.google.com/search?q=${encodeURIComponent(team.search)}`}
             target="_blank" rel="noopener noreferrer"
             className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
             style={{ background: 'var(--surface2)', textDecoration: 'none' }}
             onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
             onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}>
            <span className="text-lg">{team.emoji}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{team.label}</span>
          </a>
        ))}
      </div>

      <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
         className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
         style={{ background: 'var(--surface2)', textDecoration: 'none' }}
         onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
         onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}>
        <span className="text-base">📰</span>
        <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>The Athletic</span>
        <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
      </a>
    </div>
  )
}
